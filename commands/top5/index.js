import { Client } from 'elasticsearch';
import numeral from 'numeral';
import { last } from 'lodash';
import { es } from '../../config.json';
import { createTSVBChartLink } from './createTSVBChartLink';
const client = new Client(es);
const notFoundMessage = {
  message: "*Oh jeez, you're not gonna like this...* I couldn't find any results.",
};
export default () => ({
  help:
    'Get the top 5 for aggregation. *<groupByField> <agg>:<metricField> [<dateMath:"now-1m"> <auery> <indexPattern> <timestamp:"@timestamp">]*',
  example: 'beat.hostname avg:system.cpu.user.pct now-1m',
  fn: async args => {
    if (!args) return notFoundMessage;
    const [field, metric, since, query, indexPattern, timestamp] = args.split(/\s/);
    const [aggFn, metricField] = metric.split(':');
    const timeFieldName = timestamp || '@timestamp';
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
            must: [
              {
                query_string: {
                  query: query || '*',
                  analyze_wildcard: true,
                },
              },
            ],
            filter: {
              range: {
                [timeFieldName]: {
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
      const tsvbLink = createTSVBChartLink({
        indexPattern: indexPattern || '*',
        timeFieldName: timeFieldName,
        groupBy: field,
        aggFn,
        metricField,
        timespan: since,
        query,
      });
      if (attachments.length === 0) {
        return notFoundMessage;
      }
      return {
        message: 'Here you go...',
        params: {
          attachments: [
            ...attachments,
            {
              fallback: `View chart at: ${tsvbLink} `,
              actions: [
                {
                  type: 'button',
                  text: 'View Chart in Kibana',
                  url: tsvbLink,
                  style: 'primary',
                },
              ],
            },
          ],
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
