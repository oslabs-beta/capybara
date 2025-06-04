import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// --- Mocks needed BEFORE pubsubClient is imported ---

// 1. Mock getSecretKeys from ../appSecrets
// This needs to be available when pubsubClient.ts is evaluated.
const mockGetSecretKeys = vi.fn().mockResolvedValue({
  GCP_PROJECT_ID: 'test-project-id',
  GCP_KEY_FILE: JSON.stringify({
    client_email: 'test@example.com',
    private_key: 'test_key',
  }),
});
vi.mock('../appSecrets', () => ({
  default: mockGetSecretKeys,
}));

// 2. Mock @google-cloud/pubsub
// We need to mock the PubSub constructor and its methods like topic(), subscription(), etc.
const mockPublishMessage = vi.fn();
const mockSubscriptionOn = vi.fn();
const mockSubscriptionAck = vi.fn(); // For message.ack()
const mockSubscriptionNack = vi.fn(); // For message.nack()
const mockCreateSubscription = vi.fn();
const mockSubscriptionExists = vi.fn();

const mockTopic = vi.fn().mockImplementation(() => ({
  publishMessage: mockPublishMessage,
  createSubscription: mockCreateSubscription,
}));

const mockSubscription = vi.fn().mockImplementation(() => ({
  on: mockSubscriptionOn,
  exists: mockSubscriptionExists,
  // We'll add ack/nack to the message object itself if needed,
  // or mock the subscription object to have them if it's part of the subscription API.
  // For now, 'on' is the primary interaction for subscribeToTopic.
}));

vi.mock('@google-cloud/pubsub', () => {
  return {
    PubSub: vi.fn().mockImplementation(() => ({
      topic: mockTopic,
      subscription: mockSubscription,
    })),
    // Export Subscription if it's used for type checking or instanceof, though likely not for mocks
    Subscription: vi.fn(),
  };
});

// 3. Mock redis module to prevent module loading issues
vi.mock('redis', () => ({
  createClient: vi.fn().mockReturnValue({
    isOpen: true,
    on: vi.fn(),
    connect: vi.fn().mockResolvedValue(undefined),
    set: vi.fn().mockResolvedValue('OK'),
    get: vi.fn().mockResolvedValue(null),
    lPush: vi.fn().mockResolvedValue(1),
    lLen: vi.fn().mockResolvedValue(1),
    lTrim: vi.fn().mockResolvedValue('OK'),
    lRange: vi.fn().mockResolvedValue([]),
    mGet: vi.fn().mockResolvedValue([]),
  }),
}));

// 4. Mock ../services/processEvent (redisCache)
const mockRedisCache = vi.fn().mockResolvedValue(undefined);
vi.mock('../services/processEvent', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual, // Preserve other exports if any
    redisCache: mockRedisCache,
    // queryCache: vi.fn(), // Mock if queryCache were used in publishToTopic
  };
});

// 4. Mock chalk
vi.mock('chalk', () => ({
  default: {
    bgCyanBright: (text: string) => text,
    bgMagentaBright: (text: string) => text,
    greenBright: (text: string) => text,
    redBright: (text: string) => text,
    yellowBright: (text: string) => text,
    blueBright: (text: string) => text,
    // Add any other chalk functions used
    group: vi.fn(),
    groupEnd: vi.fn(),
    log: vi.fn(), // if console.log is used with chalk, otherwise not strictly needed for chalk mock
  },
}));

// --- Dynamically import the module under test AFTER mocks are set up ---
let publishToTopic: typeof import('./pubsubClient').default;
let subscribeToTopic: typeof import('./pubsubClient').subscribeToTopic;
let createSubscription: typeof import('./pubsubClient').createSubscription;

beforeAll(async () => {
  const pubsubModule = await import('./pubsubClient');
  publishToTopic = pubsubModule.default;
  subscribeToTopic = pubsubModule.subscribeToTopic;
  createSubscription = pubsubModule.createSubscription;
});

// --- Tests ---
describe('PubSub Client', () => {
  beforeEach(() => {
    // Clear mock history but not implementations that are set up once (like PubSub constructor)
    vi.clearAllMocks(); // Clears call history, instances, and results

    // Re-mock getSecretKeys for each test if different secrets are needed,
    // or ensure the initial mock is sufficient for all tests.
    // For these success-only tests, the initial one is likely fine.
    // If getSecretKeys was more dynamic:
    // mockGetSecretKeys.mockResolvedValue({
    //   GCP_PROJECT_ID: 'test-project-id',
    //   GCP_KEY_FILE: JSON.stringify({ client_email: 'test@example.com', private_key: 'test_key' }),
    // });

    // Reset specific mock function implementations if they need to change per test
    mockPublishMessage.mockResolvedValue('mock-message-id');
    mockSubscriptionExists.mockResolvedValue([false]); // Default to subscription NOT existing
    mockCreateSubscription.mockResolvedValue([
      { name: 'mock-created-subscription' },
    ]); // Mock the [subscription] part
    mockSubscription.mockImplementation(() => ({
      // Ensure subscription() returns an object with 'on' and 'exists'
      on: mockSubscriptionOn,
      exists: mockSubscriptionExists,
    }));
    mockTopic.mockImplementation(() => ({
      publishMessage: mockPublishMessage,
      createSubscription: mockCreateSubscription,
    }));
  });

  describe('publishToTopic', () => {
    it('should successfully publish a message to the specified topic', async () => {
      const topicName = 'test-topic';
      const data = { message: 'Hello PubSub!' };
      const attributes = { source: 'test' };
      const expectedMessageId = 'mock-message-id';

      mockPublishMessage.mockResolvedValue(expectedMessageId);

      const messageId = await publishToTopic(topicName, data, attributes);

      expect(mockTopic).toHaveBeenCalledWith(topicName);
      expect(mockPublishMessage).toHaveBeenCalledWith({
        data: Buffer.from(JSON.stringify(data)),
        attributes,
      });
      expect(mockRedisCache).toHaveBeenCalledWith(topicName, data);
      expect(messageId).toBe(expectedMessageId);
    });
  });

  describe('subscribeToTopic', () => {
    it('should successfully subscribe to a topic and call message handler', async () => {
      const subscriptionName = 'test-subscription';
      const mockMessageHandler = vi.fn().mockResolvedValue(undefined);

      // Simulate a message coming in
      const mockMessage = {
        id: '1',
        data: Buffer.from(JSON.stringify({ event: 'test-event' })),
        attributes: { origin: 'mock' },
        ack: mockSubscriptionAck, // Attach ack mock to the message
        nack: mockSubscriptionNack,
      };

      // Configure the 'on' method mock for the subscription
      // This is tricky because 'on' takes a callback that it will invoke.
      mockSubscriptionOn.mockImplementation((event, callback) => {
        if (event === 'message') {
          // Simulate receiving a message shortly after subscription
          setTimeout(() => callback(mockMessage), 0);
        }
        return mockSubscription(subscriptionName); // Return `this` or the subscription object
      });

      await subscribeToTopic(subscriptionName, mockMessageHandler);

      // Allow time for the async message handler and ack to be called
      await new Promise((resolve) => setTimeout(resolve, 50)); // Small delay

      expect(mockSubscription).toHaveBeenCalledWith(
        subscriptionName,
        expect.any(Object),
      ); // Check for flowControl options
      expect(mockSubscriptionOn).toHaveBeenCalledWith(
        'message',
        expect.any(Function),
      );
      expect(mockMessageHandler).toHaveBeenCalledWith(
        JSON.parse(mockMessage.data.toString()),
        mockMessage.attributes,
      );
      expect(mockMessage.ack).toHaveBeenCalledTimes(1); // Check if autoAck worked
    });
  });

  describe('createSubscription', () => {
    it('should successfully create a new subscription if it does not exist', async () => {
      const topicName = 'new-topic';
      const subscriptionName = 'new-subscription';
      const mockCreatedSub = { name: subscriptionName };

      mockSubscriptionExists.mockResolvedValue([false]); // Subscription does not exist
      mockCreateSubscription.mockResolvedValue([mockCreatedSub]); // Mock the creation

      const subscription = await createSubscription(
        topicName,
        subscriptionName,
      );

      expect(mockTopic).toHaveBeenCalledWith(topicName);
      expect(mockSubscription).toHaveBeenCalledWith(subscriptionName); // For the .exists() call
      expect(mockSubscriptionExists).toHaveBeenCalledTimes(1);
      expect(mockCreateSubscription).toHaveBeenCalledWith(
        subscriptionName,
        expect.any(Object),
      ); // Check options
      expect(subscription).toEqual(mockCreatedSub);
    });

    it('should return an existing subscription if it already exists', async () => {
      const topicName = 'existing-topic';
      const subscriptionName = 'existing-subscription';
      const mockExistingSubInstance = {
        name: subscriptionName,
        on: mockSubscriptionOn,
        exists: mockSubscriptionExists,
      };

      mockSubscriptionExists.mockResolvedValue([true]); // Subscription DOES exist
      mockSubscription.mockReturnValue(mockExistingSubInstance); // pubSubClient.subscription(subscriptionName) returns this

      const subscription = await createSubscription(
        topicName,
        subscriptionName,
      );

      expect(mockSubscription).toHaveBeenCalledWith(subscriptionName); // For .exists()
      expect(mockSubscription).toHaveBeenCalledWith(subscriptionName); // For returning the existing sub
      expect(mockSubscriptionExists).toHaveBeenCalledTimes(1);
      expect(mockCreateSubscription).not.toHaveBeenCalled(); // Creation should not be called
      expect(subscription).toEqual(mockExistingSubInstance);
    });
  });
});
