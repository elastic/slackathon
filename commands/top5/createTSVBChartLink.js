import rison from 'rison-node';
import uuid from 'uuid';
import { last } from 'lodash';
import globalState from './globalState.json';
import appState from './appState.json';

const getFormatter = field => {
  if (!field) return 'number';
  const parts = field.split('.');
  const type = last(parts);
  switch (type) {
    case 'pct':
      return 'percent';
    case 'bytes':
      return 'bytes';
    default:
      return 'number';
  }
};

export const createTSVBChartLink = ({
  indexPattern,
  groupBy,
  aggFn,
  metricField,
  timeFieldName,
  query,
}) => {
  const globalRison = encodeURIComponent(
    rison.encode({
      ...globalState,
      time: {
        ...globalState.time,
        from: 'now-1h',
      },
    })
  );
  const metrics =
    aggFn === 'count'
      ? [{ id: uuid.v1(), type: 'count' }]
      : [{ id: uuid.v1(), type: aggFn, field: metricField }];
  const numberFormat = getFormatter(metricField);
  const termsOrderBy = aggFn === 'count' ? '_count' : metrics[0].id;
  const appStateRison = encodeURIComponent(
    rison.encode({
      ...appState,
      vis: {
        ...appState.vis,
        params: {
          ...appState.vis.params,
          index_pattern: indexPattern,
          time_field: timeFieldName,
          filter: query || '*',
          series: [
            {
              ...appState.vis.params.series[0],
              terms_field: groupBy,
              terms_order_by: termsOrderBy,
              metrics,
              formatter: numberFormat,
            },
          ],
        },
      },
    })
  );
  return `http://localhost:5601/app/kibana#/visualize/create?type=metrics&_g=${globalRison}&_a=${appStateRison}`;
};
