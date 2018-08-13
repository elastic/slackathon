import { token, name } from '../config.json';
import slack from './slack';

export default (to, text, params = {}) => {
  return slack.chat.postMessage({
    token,
    text,
    username: name,
    as_user: true,
    channel: to,
    ...params,
  });
};
