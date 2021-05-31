import React, { useMemo, VoidFunctionComponent } from 'react';
import { themeable } from '@seinopsys-forks/react-themeable';
import { autoKey } from '../../autokey';
import type { Theme } from '../../theme';

/**
 * @internal
 */
export type HGradientTheme = Pick<Theme, 'gradient' | 'gradientHue'>;

/**
 * @internal
 */
export interface HGradientProps {
  theme: Partial<HGradientTheme>;
  active: boolean;
  hueBackground: string;
}

/**
 * @internal
 */
const HGradient: VoidFunctionComponent<HGradientProps> = ({ theme, active, hueBackground }) => {
  const themer = useMemo(() => autoKey(themeable(theme)), [theme]);

  if (!active) return null;

  return (
    <>
      <div {...themer('gradient')} style={{ backgroundColor: hueBackground }} />
      <div {...themer('gradient', 'gradientHue')} />
    </>
  );
};

export { HGradient };
