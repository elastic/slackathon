import { token } from '../config.json';
import slack from './slack';

export async function uploadToSlack(options) {
  const payload = { ...options, token };
  return await slack.files.upload(payload);
}
