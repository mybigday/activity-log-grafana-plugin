import React, { FC } from 'react';
import { Segment, Icon, SegmentSection, InlineSegmentGroup, InlineLabel, SegmentInput } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { toSelection } from '../utils/select';

interface KeyOptions {
  label: string;
  key: string;
  options?: Array<SelectableValue<any>>;
  custom?: boolean;
  required?: boolean;
}

interface Props {
  label: string;
  onChange?(values: any[]): void;
  maps: KeyOptions[];
  values: any[];
}

const KeyValueSegment: FC<Props> = ({ label, onChange, maps, values }: Props) => {
  const displayValues: any[] = React.useMemo(() => [...values, {}], [values]);

  const putItem = React.useCallback(
    (index: number, content: any) => {
      const newValues = values.slice();
      newValues[index] = content;
      onChange?.(newValues);
    },
    [values, onChange]
  );

  const removeItem = React.useCallback(
    (index: number) => {
      onChange?.(values.filter((unuse, i) => i !== index));
    },
    [values, onChange]
  );

  return (
    <>
      {displayValues.map((value: any, index: number) => (
        <SegmentSection label={index === 0 ? label : ''} key={index}>
          {/* @ts-ignore */}
          <InlineSegmentGroup>
            {maps.map(({ label: fieldLabel, key, options, required, custom }) => (
              <InlineLabel width="auto" as="div" key={key}>
                <span>{fieldLabel}:</span>
                {options ? (
                  <Segment
                    key={index}
                    allowCustomValue={custom}
                    options={options}
                    placeholder={required ? '(required)' : '(optional)'}
                    value={toSelection(value[key], options)}
                    onChange={(item) => {
                      putItem(index, { ...value, [key]: item.value });
                    }}
                  />
                ) : (
                  <SegmentInput
                    key={index}
                    placeholder={required ? '(required)' : '(optional)'}
                    value={value[key]}
                    onChange={(val) => {
                      putItem(index, { ...value, [key]: val });
                    }}
                  />
                )}
              </InlineLabel>
            ))}
            {index < values.length && (
              <a className="gf-form-label query-part" onClick={() => removeItem(index)}>
                <Icon name="trash-alt" aria-label="Delete" />
              </a>
            )}
          </InlineSegmentGroup>
        </SegmentSection>
      ))}
    </>
  );
};

export default KeyValueSegment;
