import React, { VoidFunctionComponent } from 'react';
import { ColorChannelAlpha } from '../../colorfunc';
import { NumberInput, NumberInputBaseProps } from './number-input';

/**
 * @internal
 */
export type SLAlphaInputProps = NumberInputBaseProps<'s' | 'l'> | NumberInputBaseProps<ColorChannelAlpha>;

/**
 * @internal
 */
export const SLAlphaInput: VoidFunctionComponent<SLAlphaInputProps> = props =>
  <NumberInput {...props as NumberInputBaseProps} min={0} max={100} />;
