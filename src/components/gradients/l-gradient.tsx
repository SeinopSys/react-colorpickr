import { themeable } from '@seinopsys-forks/react-themeable';
import React, { VoidFunctionComponent } from 'react';
import { autoKey } from '../../autokey';
import { Theme } from '../../theme';

/**
 * @internal
 */
export type LGradientTheme = Pick<Theme, 'gradient' | 'gradientLight'>;

/**
 * @internal
 */
export interface LGradientProps {
  theme: Partial<LGradientTheme>;
  active: boolean;
  opacityLow: number;
  opacityHigh: number;
}

/**
 * @internal
 */
export const LGradient: VoidFunctionComponent<LGradientProps> = ({ theme, active, opacityLow, opacityHigh }) => {
  const themer = autoKey(themeable(theme));
  if (!active) return <noscript />;

  // Opacity should be 0 when range value is at 0.5
  const high = (opacityHigh - 0.5) * 2;
  const low = (opacityLow - 0.5) * 2;

  return (
    <>
      <div {...themer('gradient', 'gradientLight')} />
      <div
        {...themer('gradient')}
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgb(128,128,128) 100%)'
        }}
      />
      <div
        {...themer('gradient')}
        style={{
          background: 'rgb(255,255,255)',
          opacity: high
        }}
      />
      <div
        {...themer('gradient')}
        style={{
          background: 'rgb(0,0,0)',
          opacity: low
        }}
      />
    </>
  );
};
