import React, { VoidFunctionComponent } from 'react';
import { NumberInput, NumberInputBaseProps } from './number-input.js';

/**
 * @internal
 */
export type HInputProps = NumberInputBaseProps<'h'>;

/**
 * @internal
 */
export const HInput: VoidFunctionComponent<HInputProps> = props =>
  <NumberInput {...props as NumberInputBaseProps} min={0} max={360} />;
