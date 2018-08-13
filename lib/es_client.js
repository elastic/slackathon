import { Client } from 'elasticsearch';
import { es } from '../config.json';
const client = new Client(es);

export default client;
