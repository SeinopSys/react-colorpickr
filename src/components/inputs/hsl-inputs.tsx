import React, { useCallback, VoidFunctionComponent } from 'react';
import { HInput } from './h-input';
import { ModeInput} from './mode-input';
import { ModeInputsCommonProps } from './mode-inputs';
import { ColorInputChangeHandler } from './number-input';
import { SLAlphaInput } from './sl-alpha-input';

/**
 * @internal
 */
export interface HSLInputsProps extends ModeInputsCommonProps {
  changeHSL: ColorInputChangeHandler;
  h: number;
  s: number;
  l: number;
}

/**
 * @internal
 */
export const HSLInputs: VoidFunctionComponent<HSLInputsProps> = ({
  channel,
  setChannel,
  themer,
  themeModeInput,
  themeNumberInput,
  readOnly,
  modeInputName,
  changeHSL,
  h,
  s,
  l
}) => {
  const handleSetChannelH = useCallback(() => setChannel('h'), [setChannel]);
  const handleSetChannelS = useCallback(() => setChannel('s'), [setChannel]);
  const handleSetChannelL = useCallback(() => setChannel('l'), [setChannel]);
  return (
    <div>
      <div
        {...themer(
          'inputModeContainer',
          `${channel === 'h' ? 'active' : ''}`
        )}
      >
        <ModeInput
          name={modeInputName}
          theme={themeModeInput}
          checked={channel === 'h'}
          onChange={handleSetChannelH}
          readOnly={readOnly}
        />
        <HInput
          id='h'
          value={h}
          theme={themeNumberInput}
          onChange={changeHSL}
          readOnly={readOnly}
        />
      </div>
      <div
        {...themer(
          'inputModeContainer',
          `${channel === 's' ? 'active' : ''}`
        )}
      >
        <ModeInput
          name={modeInputName}
          theme={themeModeInput}
          checked={channel === 's'}
          onChange={handleSetChannelS}
          readOnly={readOnly}
        />
        <SLAlphaInput
          id='s'
          value={s}
          theme={themeNumberInput}
          onChange={changeHSL}
          readOnly={readOnly}
        />
      </div>
      <div
        {...themer(
          'inputModeContainer',
          `${channel === 'l' ? 'active' : ''}`
        )}
      >
        <ModeInput
          name={modeInputName}
          theme={themeModeInput}
          checked={channel === 'l'}
          onChange={handleSetChannelL}
          readOnly={readOnly}
        />
        <SLAlphaInput
          id='l'
          value={l}
          theme={themeNumberInput}
          onChange={changeHSL}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

