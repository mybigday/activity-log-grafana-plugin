export const toSelection = (value: any, options: any[]) =>
  options?.find?.((opt: any) => opt.value === value) || value;
