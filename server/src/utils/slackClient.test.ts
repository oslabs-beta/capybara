import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';

// --- Mocks needed BEFORE slackClient.ts is imported ---

// 1. Mock getSecretKeys from ../appSecrets
const mockGetSecretKeys = vi.fn().mockResolvedValue({
  SLACK_CONVERSATION_ID: 'C12345DEFAULT',
  SLACK_BOT_TOKEN: 'xoxb-test-slack-bot-token',
});
vi.mock('../appSecrets', () => ({
  default: mockGetSecretKeys,
}));

// 2. Mock @slack/web-api
// We need to mock the WebClient constructor and its chat.postMessage method
const mockChatPostMessage = vi.fn();

vi.mock('@slack/web-api', () => {
  return {
    WebClient: vi.fn().mockImplementation(() => ({
      chat: {
        postMessage: mockChatPostMessage,
      },
    })),
  };
});

// --- Dynamically import the module under test AFTER mocks are set up ---
// `slack_message` is the default export
let slack_message: typeof import('./slackClient').default;

beforeAll(async () => {
  const slackModule = await import('./slackClient');
  slack_message = slackModule.default;
});

// --- Tests ---
describe('Slack Client - slack_message', () => {
  beforeEach(() => {
    // Clear mock history for all mocks
    vi.clearAllMocks();

    mockChatPostMessage.mockResolvedValue({
      ok: true,
      ts: '12345.67890',
      channel: 'C12345DEFAULT', // Or the channel used in the test
    });

    // Ensure getSecretKeys mock is reset to its default for each test
    mockGetSecretKeys.mockResolvedValue({
      SLACK_CONVERSATION_ID: 'C12345DEFAULT',
      SLACK_BOT_TOKEN: 'xoxb-test-slack-bot-token',
    });
  });

  it('should successfully send a Slack message using default channel ID from secrets', async () => {
    const testMessageText = 'Hello, Slack from test!';
    const defaultChannelIdFromMock = 'C12345DEFAULT'; // From mockGetSecretKeys

    // Act: Call the function to be tested
    await slack_message(testMessageText);

    // 2. Check if web.chat.postMessage was called correctly
    expect(mockChatPostMessage).toHaveBeenCalledTimes(1);
    expect(mockChatPostMessage).toHaveBeenCalledWith({
      text: testMessageText,
      channel: defaultChannelIdFromMock, // Uses the SLACK_CONVERSATION_ID from the mocked secrets
    });
  });

  it('should successfully send a Slack message to a specified channel ID', async () => {
    const testMessageText = 'Hello, Slack to a specific channel!';
    const specifiedChannelId = 'C67890SPECIFIC';

    // Act: Call the function to be tested, providing a channel
    await slack_message(testMessageText, specifiedChannelId);

    // Assert: Check if dependencies were called correctly

    // 1. As above, getSecretKeys is top-level.

    // 2. Check if web.chat.postMessage was called correctly
    expect(mockChatPostMessage).toHaveBeenCalledTimes(1);
    expect(mockChatPostMessage).toHaveBeenCalledWith({
      text: testMessageText,
      channel: specifiedChannelId, // Uses the channel ID passed as an argument
    });
  });
});
