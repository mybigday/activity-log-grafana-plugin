import React, { ComponentType } from 'react';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { InlineField, InlineFieldRow, Select } from '@grafana/ui';
import { find } from 'lodash';
import { DataSource } from '../datasource';
import { ActivityLogOptions, ActivityLogQuery, QueryFilter, Operator } from '../types';
import KeyValueSegment from '../components/KeyValueSegment';

type Props = QueryEditorProps<DataSource, ActivityLogQuery, ActivityLogOptions>;

interface LastQuery {
  filter?: QueryFilter[];
  metric: string;
}

const toOption = (options: any) =>
  Array.isArray(options)
    ? options.map((value) => ({ label: value, value }))
    : Object.entries(options).map(([label, value]) => ({ label, value }));

const dbCommonFields = toOption([
  'event_id',
  'device_id',
  'data',
  'data.sender',
  'data.subspaceId',
  'data.properties',
  'data.updateMap',
]);

export const QueryEditor: ComponentType<Props> = ({ datasource, onChange, onRunQuery, query }) => {
  const [metric, setMetric] = React.useState<SelectableValue<string | number>>();
  const [filter, setFilter] = React.useState(query.filter ?? []);

  const [lastQuery, setLastQuery] = React.useState<LastQuery | null>(null);

  const [metricOptions, setMetricOptions] = React.useState<Array<SelectableValue<string | number>>>([]);
  const [isMetricOptionsLoading, setIsMetricOptionsLoading] = React.useState<boolean>(false);

  const loadMetrics = React.useCallback(
    () =>
      datasource.listMetrics().then(
        (result) => {
          const metrics = result.map((value) => ({ label: value.text, value: value.value }));

          const foundMetric = find(metrics, (metric) => metric.value === query.target);

          setMetric(foundMetric === undefined ? { label: '', value: '' } : foundMetric);

          return metrics;
        },
        (response) => {
          setMetric({ label: '', value: '' });
          setMetricOptions([]);

          throw new Error(response.statusText);
        }
      ),
    [datasource, query.target]
  );

  const refreshMetricOptions = React.useCallback(() => {
    setIsMetricOptionsLoading(true);
    loadMetrics()
      .then((metrics) => {
        setMetricOptions(metrics);
      })
      .finally(() => {
        setIsMetricOptionsLoading(false);
      });
  }, [loadMetrics, setMetricOptions, setIsMetricOptionsLoading]);

  // Initializing metric options
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => refreshMetricOptions(), []);

  React.useEffect(() => {
    if (metric?.value === undefined || metric?.value === '') {
      return;
    }
    if (lastQuery !== null && metric?.value === lastQuery.metric && filter === lastQuery.filter) {
      return;
    }

    setLastQuery({ filter, metric: metric.value.toString() });

    onChange({ ...query, filter, target: metric.value.toString() });

    onRunQuery();
  }, [filter, metric, onChange, onRunQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <InlineFieldRow>
        <InlineField>
          <Select
            isLoading={isMetricOptionsLoading}
            prefix="Metric: "
            options={metricOptions}
            placeholder="Select metric"
            value={metric}
            onChange={(v) => {
              setMetric(v);
            }}
          />
        </InlineField>
      </InlineFieldRow>
      <KeyValueSegment
        label="Filter"
        values={filter}
        maps={[
          { label: 'Field', key: 'key', options: dbCommonFields, custom: true, required: true },
          { label: 'Oprtator', key: 'operator', options: toOption(Operator), required: true },
          { label: 'Value', key: 'value', required: true },
        ]}
        onChange={(values) => setFilter(values)}
      />
    </>
  );
};
