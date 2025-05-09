import { WebClient } from '@slack/web-api';
import getSecretKeys from '../appSecrets';

const { SLACK_CONVERSATION_ID, SLACK_BOT_TOKEN } = await getSecretKeys(); // Get saved URL from secret manager

const web = new WebClient(SLACK_BOT_TOKEN);

const slack_message = async (
  text: string,
  channel: string = SLACK_CONVERSATION_ID as string,
) => {
  const result = await web.chat.postMessage({
    text: text,
    channel: channel,
  });

  // console.log(`Successfully send message ${result}`);
};

// slack_message('I can see Google Secrets!!! 🪵🪵🪵');

export default slack_message;
