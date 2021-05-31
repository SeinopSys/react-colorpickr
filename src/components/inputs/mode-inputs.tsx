import React, { VoidFunctionComponent } from 'react';
import { ColorChannel, ColorMode } from '../../colorfunc';
import { PackageAutoKeyedThemer } from '../../theme';
import { HSLInputs, HSLInputsProps } from './hsl-inputs';
import { ModeInputTheme } from './mode-input';
import { NumberInputTheme } from './number-input';
import { RGBInputs, RGBInputsProps } from './rgb-inputs';

/**
 * @internal
 */
export interface ModeInputsCommonProps {
  themer: PackageAutoKeyedThemer;
  themeModeInput: ModeInputTheme;
  themeNumberInput: NumberInputTheme;
  channel: ColorChannel;
  setChannel: (channel: ColorChannel) => void;
  readOnly: boolean;
  modeInputName: string;
}

/**
 * @internal
 */
export interface ModeInputsProps extends ModeInputsCommonProps, RGBInputsProps, HSLInputsProps {
  mode: ColorMode;
}

/**
 * @internal
 */
export const ModeInputs: VoidFunctionComponent<ModeInputsProps> = ({
  mode,
  changeRGB,
  changeHSL,
  r,
  g,
  b,
  h,
  s,
  l,
  ...commonProps
}) => {
  return mode === 'rgb'
    ? <RGBInputs {...commonProps} changeRGB={changeRGB} r={r} g={g} b={b} />
    : <HSLInputs {...commonProps} changeHSL={changeHSL} h={h} s={s} l={l} />;
};
