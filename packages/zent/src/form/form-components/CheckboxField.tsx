import * as React from 'react';
import { Omit } from 'utility-types';
import Checkbox, { ICheckboxProps, ICheckboxEvent } from '../../checkbox';
import { IFormComponentProps } from '../shared';
import { FormField, IFormFieldChildProps } from '../Field';
import { $MergeParams } from '../utils';
import { useEventCallbackRef } from '../../utils/hooks/useEventCallbackRef';

export type IFormCheckboxFieldProps<Value> = IFormComponentProps<
  boolean,
  Omit<ICheckboxProps<Value>, 'checked'>
>;

function CheckboxField<Value>({
  childProps,
  props,
}: {
  childProps: IFormFieldChildProps<boolean>;
  props: IFormCheckboxFieldProps<Value>;
}) {
  const { value, ...passedProps } = childProps;

  const onChangeRef = useEventCallbackRef(childProps.onChange);

  const onChange = React.useCallback(
    (e: ICheckboxEvent<Value>) => {
      onChangeRef.current?.(e.target.checked);
    },
    [onChangeRef]
  );

  return (
    <Checkbox
      {...props.props}
      {...passedProps}
      checked={value}
      onChange={onChange}
    />
  );
}

export function FormCheckboxField<Value>(
  props: IFormCheckboxFieldProps<Value>
) {
  return (
    <FormField
      {...props}
      defaultValue={
        (props as $MergeParams<IFormCheckboxFieldProps<Value>>).defaultValue ||
        false
      }
    >
      {childProps => <CheckboxField childProps={childProps} props={props} />}
    </FormField>
  );
}
