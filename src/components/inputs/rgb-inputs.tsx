import React, { useCallback, VoidFunctionComponent } from 'react';
import { ModeInput} from './mode-input';
import { ModeInputsCommonProps } from './mode-inputs';
import { ColorInputChangeHandler } from './number-input';
import { RGBInput } from './rgb-input';

/**
 * @internal
 */
export interface RGBInputsProps extends ModeInputsCommonProps {
  changeRGB: ColorInputChangeHandler;
  r: number;
  g: number;
  b: number;
}

/**
 * @internal
 */
export const RGBInputs: VoidFunctionComponent<RGBInputsProps> = ({
  channel,
  setChannel,
  themer,
  themeModeInput,
  themeNumberInput,
  readOnly,
  modeInputName,
  changeRGB,
  r,
  g,
  b
}) => {
  const handleSetChannelR = useCallback(() => setChannel('r'), [setChannel]);
  const handleSetChannelG = useCallback(() => setChannel('g'), [setChannel]);
  const handleSetChannelB = useCallback(() => setChannel('b'), [setChannel]);
  return (
    <div>
      <div
        {...themer(
          'inputModeContainer',
          `${channel === 'r' ? 'active' : ''}`
        )}
      >
        <ModeInput
          theme={themeModeInput}
          name={modeInputName}
          checked={channel === 'r'}
          onChange={handleSetChannelR}
          readOnly={readOnly}
        />
        <RGBInput
          id='r'
          theme={themeNumberInput}
          value={r}
          onChange={changeRGB}
          readOnly={readOnly}
        />
      </div>
      <div
        {...themer(
          'inputModeContainer',
          `${channel === 'g' ? 'active' : ''}`
        )}
      >
        <ModeInput
          theme={themeModeInput}
          name={modeInputName}
          checked={channel === 'g'}
          onChange={handleSetChannelG}
          readOnly={readOnly}
        />
        <RGBInput
          id='g'
          value={g}
          theme={themeNumberInput}
          onChange={changeRGB}
          readOnly={readOnly}
        />
      </div>
      <div
        {...themer(
          'inputModeContainer',
          `${channel === 'b' ? 'active' : ''}`
        )}
      >
        <ModeInput
          theme={themeModeInput}
          name={modeInputName}
          checked={channel === 'b'}
          onChange={handleSetChannelB}
          readOnly={readOnly}
        />
        <RGBInput
          id='b'
          theme={themeNumberInput}
          value={b}
          onChange={changeRGB}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};
