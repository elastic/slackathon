import { Client } from 'elasticsearch';
import numeral from 'numeral';
import { last } from 'lodash';
import { es } from '../config.json';
const client = new Client(es);
export default () => ({
  help:
    'Get the top 5 for aggregation. <groupByField> <agg>:<metricField> [<dateMath:"now-1m"> <indexPattern:"*"> <timestamp:"@timestamp">]',
  example: 'beat.hostname avg:system.cpu.user.pct now-1m',
  fn: async args => {
    const [field, metric, since, indexPattern, timestamp] = args.split(/\s/);
    const [aggFn, metricField] = metric.split(':');
    const rangeTimestamp = timestamp || '@timestamp';
    const metricAgg =
      aggFn === 'count'
        ? {}
        : {
            metric: {
              [aggFn]: {
                field: metricField,
              },
            },
          };
    const sort = aggFn === 'count' ? { _count: 'desc' } : { metric: 'desc' };
    const props = {
      index: indexPattern || '*',
      body: {
        size: 0,
        query: {
          bool: {
            filter: {
              range: {
                [rangeTimestamp]: {
                  gte: since,
                  lte: 'now',
                },
              },
            },
          },
        },
        aggs: {
          metrics: {
            terms: { field, size: 5, order: sort },
            aggs: metricAgg,
          },
        },
      },
    };
    try {
      const resp = await client.search(props);
      const attachments = resp.aggregations.metrics.buckets.map(bucket => {
        const rawValue = aggFn === 'count' ? bucket.doc_count : bucket.metric.value || 0;
        const value = formatNumber(metricField, rawValue);
        return {
          color: '#DDDDDD',
          fallback: `${bucket.key} ${value}`,
          title: bucket.key,
          text: value,
        };
      });
      return {
        message: 'Here you go...',
        params: {
          attachments,
        },
      };
    } catch (e) {
      return {
        message: 'Oopsie! Looks like you stubbed your toe',
        params: {
          attachments: [
            {
              fallback: e.message,
              color: '#A30000',
              title: e.message,
              text: e.stack,
            },
          ],
        },
      };
    }
  },
});

function formatNumber(field, value) {
  if (!field) return value;
  const parts = field.split('.');
  const type = last(parts);
  switch (type) {
    case 'pct':
      return numeral(value).format('0.0%');
    case 'bytes':
      return numeral(value).format('0.0b');
    default:
      return numeral(value).foramt('0.0');
  }
}
