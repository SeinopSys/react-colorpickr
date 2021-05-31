import { themeable } from '@seinopsys-forks/react-themeable';
import React, { ChangeEventHandler, VoidFunctionComponent } from 'react';
import { autoKey } from '../../autokey';
import type { Theme } from '../../theme';

/**
 * @internal
 */
export type ModeInputTheme = Pick<Theme, 'modeInputContainer' | 'modeInput'>;

/**
 * @internal
 */
export interface ModeInputProps {
  name: string;
  theme: Partial<ModeInputTheme>;
  checked: boolean;
  readOnly?: boolean;
  onChange: ChangeEventHandler;
}

/**
 * @internal
 */
export const ModeInput: VoidFunctionComponent<ModeInputProps> = ({
  name,
  theme,
  checked,
  readOnly,
  onChange,
}) => {
  const themer = autoKey(themeable(theme));
  return (
    <div {...themer('modeInputContainer')}>
      <input
        {...themer('modeInput')}
        type='radio'
        name={name}
        checked={checked}
        onChange={onChange}
        readOnly={readOnly}
      />
    </div>
  );
};
