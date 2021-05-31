import { themeable } from '@seinopsys-forks/react-themeable';
import React, { VoidFunctionComponent } from 'react';
import { autoKey } from '../../autokey';
import { ColorChannelRGB } from '../../colorfunc';
import { Theme } from '../../theme';

/**
 * @internal
 */
export type RGBGradientTheme = Pick<Theme,
  'gradient' |
  'gradientRHigh' |
  'gradientRLow' |
  'gradientGHigh' |
  'gradientGLow' |
  'gradientBHigh' |
  'gradientBLow'>;

/**
 * @internal
 */
export interface RGBGradientProps {
  theme: Partial<RGBGradientTheme>;
  active: boolean;
  color: ColorChannelRGB;
  opacityLow: number;
  opacityHigh: number;
}

/**
 * @internal
 */
export const RGBGradient: VoidFunctionComponent<RGBGradientProps> = ({
  theme,
  active,
  color,
  opacityLow,
  opacityHigh
}) => {
  const themer = autoKey(themeable(theme));
  if (!active) return <noscript />;
  return (
    <>
      <div
        {...themer('gradient', `gradient${color.toUpperCase()}High`)}
        style={{ opacity: opacityHigh }}
      />
      <div
        {...themer('gradient', `gradient${color.toUpperCase()}Low`)}
        style={{ opacity: opacityLow }}
      />
    </>
  );
};
