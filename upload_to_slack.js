import Slack from 'slack';
import { token } from './config.json';

export async function uploadToSlack(options) {
  const slack = new Slack({ token });
  const payload = { ...options, token };

  console.log(payload);
  return await slack.files.upload(payload);
}
