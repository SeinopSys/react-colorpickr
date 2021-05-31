import React, { VoidFunctionComponent } from 'react';
import { ColorChannelRGB } from '../../colorfunc';
import { NumberInput, NumberInputBaseProps } from './number-input';

/**
 * @internal
 */
export type RGBInputProps = NumberInputBaseProps<ColorChannelRGB>;

/**
 * @internal
 */
export const RGBInput: VoidFunctionComponent<RGBInputProps> = props =>
  <NumberInput {...props as NumberInputBaseProps} min={0} max={255} />;
