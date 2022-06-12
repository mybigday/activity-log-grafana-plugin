import { DataSourcePlugin } from '@grafana/data';
import { DataSource } from './datasource';
import { ConfigEditor } from './views/ConfigEditor';
import { QueryEditor } from './views/QueryEditor';
import { ActivityLogQuery, ActivityLogOptions } from './types';

export const plugin = new DataSourcePlugin<DataSource, ActivityLogQuery, ActivityLogOptions>(DataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
