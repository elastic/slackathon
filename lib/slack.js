import Slack from 'slack';
import { token } from '../config.json';

const slack = new Slack({ token });

export default slack;
