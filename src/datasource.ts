import { FetchResponse, getBackendSrv, getTemplateSrv } from '@grafana/runtime';
import { BackendSrvRequest } from '@grafana/runtime/services/backendSrv';
import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MetricFindValue,
} from '@grafana/data';

import { ActivityLogQuery, ActivityLogOptions } from './types';

export class DataSource extends DataSourceApi<ActivityLogQuery, ActivityLogOptions> {
  url: string;

  constructor(instanceSettings: DataSourceInstanceSettings<ActivityLogOptions>) {
    super(instanceSettings);

    this.url = instanceSettings.url || `/api/datasources/proxy/${this.id}`;
  }

  query(options: DataQueryRequest<ActivityLogQuery>): Promise<DataQueryResponse> {
    // @ts-ignore
    const adhocFilters = getTemplateSrv().getAdhocFilters(this.name);
    return getBackendSrv()
      .datasourceRequest<DataQueryResponse>({
        url: `${this.url}/api/query`,
        method: 'POST',
        data: {
          ...options,
          adhocFilters,
        },
      })
      .then((res: FetchResponse<DataQueryResponse>) => res.data);
  }

  testDatasource() {
    return this.doFetch({
      url: `${this.url}/api/health`,
      method: 'GET',
    });
  }

  listMetrics(): Promise<MetricFindValue[]> {
    return this.doFetch<MetricFindValue[]>({
      url: `${this.url}/api/metrics`,
      method: 'GET',
    });
  }

  getTagKeys(options?: any): Promise<MetricFindValue[]> {
    return this.doFetch<MetricFindValue[]>({
      url: `${this.url}/api/tag-keys`,
      method: 'POST',
      data: options ?? {},
    });
  }

  getTagValues(options: any): Promise<MetricFindValue[]> {
    return this.doFetch<MetricFindValue[]>({
      url: `${this.url}/api/tag-values`,
      method: 'POST',
      data: options,
    });
  }

  doFetch<T>(options: BackendSrvRequest): Promise<T> {
    return getBackendSrv().request(options);
  }
}
