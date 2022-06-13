import { SelectableValue } from '@grafana/data';

export const toSelection = (value: any, options?: Array<SelectableValue<any>>) =>
  options?.find?.((opt: SelectableValue<any>) => opt.value === value) || value;
