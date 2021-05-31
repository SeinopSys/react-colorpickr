import { themeable } from '@seinopsys-forks/react-themeable';
import React, {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useState,
  VoidFunctionComponent
} from 'react';
import { autoKey } from '../../autokey';
import { ColorChannel, ColorChannelAlpha, ColorObject } from '../../colorfunc';
import type { Theme } from '../../theme';

/**
 * @internal
 */
export interface ColorInputChangeHandler extends NumberInputChangeHandler<ColorChannel> {
  (color: Partial<ColorObject>, _?: undefined): void;
}

/**
 * @internal
 */
export type NumberInputId = ColorChannel | ColorChannelAlpha;

/**
 * @internal
 */
export type NumberInputChangeHandler<ID = NumberInputId> = (id: ID, nextValue: number) => void;

/**
 * @internal
 */
export type NumberInputTheme = Pick<Theme, 'numberInputContainer' | 'numberInputLabel' | 'numberInput'>;

/**
 * @internal
 */
export interface NumberInputBaseProps<ID = NumberInputId> {
  id: ID;
  value: number;
  theme: Partial<NumberInputTheme>;
  onChange: NumberInputChangeHandler<ID>;
  readOnly?: boolean;
}

export interface NumberInputProps<ID = NumberInputId> extends NumberInputBaseProps<ID> {
  min: number;
  max: number;
}

export const NumberInput: VoidFunctionComponent<NumberInputProps> = ({
  id,
  value,
  theme,
  onChange,
  min,
  max,
  readOnly
}) => {
  const [internalValue, setInternalValue] = useState<string>(() => String(value));

  useEffect(() => {
    setInternalValue(String(value));
  }, [value]);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setInternalValue(e.target.value);

    // Remove any leading zero and convert to number
    let nextValue = e.target.value ? parseInt(e.target.value, 10) : 0;

    // Don't exceed max value
    if (nextValue > max) nextValue = max;
    onChange(id, nextValue);
  }, [id, max, onChange]);

  const themer = autoKey(themeable(theme));
  return (
    <div {...themer('numberInputContainer')}>
      <label htmlFor={id} {...themer('numberInputLabel')}>
        {id}
      </label>
      <input
        id={id}
        readOnly={readOnly || undefined}
        {...themer('numberInput')}
        value={internalValue}
        onChange={onInputChange}
        type='number'
        min={min}
        max={max}
        step={1}
      />
    </div>
  );
};
