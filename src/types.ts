import { DataQuery, DataSourceJsonData } from '@grafana/data';

export enum AggregateFunction {
  None = 'none',
  Count = 'count',
  Min = 'min',
  Max = 'max',
  Sum = 'sum',
  Average = 'avg',
  StdDev = 'stddev',
  Variance = 'variance',
  First = 'first',
  Last = 'last',
}

export enum Operator {
  Equal = '=',
  NotEqual = '!=',
  Less = '<',
  LessEqual = '<=',
  Greater = '>',
  GreaterEqual = '>=',
  Match = '=~',
  NotMatch = '!~',
}

export interface QueryField {
  key: string;
  alias?: string;
  aggregate?: AggregateFunction;
}

export interface QueryFilter {
  key: string;
  operator: Operator;
  value: any;
}

export interface ActivityLogQuery extends DataQuery {
  target?: string;
  fields?: QueryField[];
  filter?: QueryFilter[];
}

export interface TextValuePair {
  text: string;
  value: any;
}

export const defaultQuery: Partial<ActivityLogQuery> = {};

/**
 * These are options configured for each DataSource instance
 */
export interface ActivityLogOptions extends DataSourceJsonData {
  site?: string;
  workspaceId?: string;
}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface ActivityLogSecureOptions {
  authToken?: string;
}
