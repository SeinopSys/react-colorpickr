import { themeable } from '@seinopsys-forks/react-themeable';
import React, { useMemo, VoidFunctionComponent } from 'react';
import { autoKey } from '../../autokey';
import { Theme } from '../../theme';

/**
 * @internal
 */
export type SGradientTheme = Pick<Theme, 'gradient' | 'gradientSaturation'>;

/**
 * @internal
 */
export interface SGradientProps {
  theme: Partial<SGradientTheme>;
  active: boolean;
  opacityLow: number;
  opacityHigh: number;
}

/**
 * @internal
 */
export const SGradient: VoidFunctionComponent<SGradientProps> = ({
  theme,
  active,
  opacityLow,
  opacityHigh
}) => {
  const themer = useMemo(() => autoKey(themeable(theme)), [theme]);

  if (!active) return null;

  return (
    <>
      <div
        {...themer('gradient', 'gradientSaturation')}
        style={{ opacity: opacityHigh }}
      />
      <div
        {...themer('gradient')}
        style={{
          background: 'linear-gradient(to bottom, rgb(255,255,255) 0%, rgba(128,128,128,0) 50%, rgb(0,0,0) 100%)',
          opacity: opacityHigh
        }}
      />
      <div
        {...themer('gradient')}
        style={{
          background: 'linear-gradient(to bottom, rgb(255,255,255) 0%, rgb(128,128,128) 50%, rgb(0,0,0) 100%)',
          opacity: opacityLow
        }}
      />
    </>
  );
};
