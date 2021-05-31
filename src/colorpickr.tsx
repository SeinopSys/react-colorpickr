import { themeable } from '@seinopsys-forks/react-themeable';
import colorString from 'color-string';
import React, {
  ChangeEventHandler,
  CSSProperties,
  FocusEventHandler,
  MutableRefObject, RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
  VoidFunctionComponent
} from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { autoKey } from './autokey';

import {
  ALPHA_CHANNEL,
  ColorChannel,
  colorCoords,
  colorCoordValue,
  ColorMode,
  ColorObject,
  getColor,
  hsl2rgb,
  isDark,
  isHSLChannel,
  isRGBChannel,
  normalizeString,
  Position,
  rgb2hex,
  rgb2hsl,
  rgbaColor,
  toNumber
} from './colorfunc';
import { HGradient } from './components/gradients/h-gradient';
import { LGradient } from './components/gradients/l-gradient';
import { RGBGradient, RGBGradientTheme } from './components/gradients/rgb-gradient';
import { SGradient } from './components/gradients/s-gradient';
import { ModeInputTheme } from './components/inputs/mode-input';
import { ModeInputs } from './components/inputs/mode-inputs';
import {
  ColorInputChangeHandler,
  NumberInputChangeHandler,
  NumberInputTheme
} from './components/inputs/number-input';
import { SLAlphaInput } from './components/inputs/sl-alpha-input';
import { defaultTheme, Theme } from './theme';
import { XYControl } from './xy';

export interface ColorPickrAPI {
  overrideValue(cssColor: string, shouldUpdateInitialValue?: boolean): void;
}

export interface ColorPickrProps {
  onChange: (changeData: ColorObject & { hexInput: boolean; mode: ColorMode; channel: ColorChannel }) => void;
  channel?: ColorChannel;
  theme?: Partial<Theme>;
  initialMode?: ColorMode;
  initialValue?: string;
  reset?: boolean;
  alpha?: boolean;
  readOnly?: boolean;
  apiRef?: RefObject<ColorPickrAPI>;
}

export const ColorPickr: VoidFunctionComponent<ColorPickrProps> = ({
  initialValue = '#000',
  alpha = true,
  reset = true,
  initialMode = 'hsl',
  channel = 'h',
  theme = {},
  readOnly = false,
  apiRef,
  onChange
}) => {
  // eslint-disable-next-line no-undef
  const modeInputName = useMemo(() => !process.env.TESTING ? `mode-${Math.random()}` : '', []);
  const [mode, setInputMode] = useState<ColorMode>(initialMode);
  const [color, setColor] = useState<ColorObject>(() => assignColor(initialValue));

  const assignColor = useCallback((v: string) => {
    let color = getColor(v);
    if (!alpha && color.a < 1) {
      console.warn(
        `[ColorPickr] ${v} contains an alpha channel "${color.a}" but alpha is set to "false". Resetting to "1".`
      );
      color = { ...color, a: 1 };
    }

    return color;
  }, [alpha]);

  const [i, setInitialValue] = useState<ColorObject>(() => assignColor(initialValue));
  const [hexInput, setHexInput] = useState<boolean>(false);

  const overrideValue: ColorPickrAPI['overrideValue'] = useCallback((cssColor, shouldUpdateInitialValue = false) => {
    const nextColor = assignColor(cssColor);

    unstable_batchedUpdates(() => {
      if (shouldUpdateInitialValue) {
        setInitialValue(nextColor);
      }
      setColor(nextColor);
    });
  }, [assignColor]);

  useEffect(() => {
    if (apiRef) (apiRef as MutableRefObject<ColorPickrAPI>).current = { overrideValue };
  }, [apiRef, overrideValue]);

  useEffect(() => {
    onChange({ hexInput, mode, channel, ...color });
  }, [hexInput, mode, channel, color, onChange]);

  const setNextColor = useCallback((obj: Partial<ColorObject>) => {
    setColor({ ...color, ...obj });
  }, [color]);

  const changeHSL: ColorInputChangeHandler = useCallback((p, inputValue) => {
    let j: Partial<ColorObject> = {};
    if (typeof p !== 'string') {
      j = p;
    }
    if (typeof inputValue !== 'undefined' && typeof p === 'string') {
      j[p] = inputValue;
    }
    const h = j.h || color.h;
    const s = j.s || color.s;
    const l = j.l || color.l;
    const rgb = hsl2rgb(h, s, l);
    const hex = rgb2hex(rgb.r, rgb.g, rgb.b);
    unstable_batchedUpdates(() => {
      setNextColor({ ...j, ...rgb, hex });
      setHexInput(false);
    });
  }, [color.h, color.l, color.s, setNextColor]);

  const changeRGB: ColorInputChangeHandler = useCallback((p, inputValue) => {
    let j: Partial<ColorObject> = {};
    if (typeof p !== 'string') {
      j = p;
    }
    if (typeof inputValue !== 'undefined' && typeof p === 'string') {
      j[p] = inputValue;
    }
    const r = j.r || color.r;
    const g = j.g || color.g;
    const b = j.b || color.b;
    const hsl = rgb2hsl(r, g, b);
    const hex = rgb2hex(r, g, b);
    unstable_batchedUpdates(() => {
      setNextColor({ ...j, ...hsl, hex });
      setHexInput(false);
    });
  }, [color.b, color.g, color.r, setNextColor]);

  const changeAlpha: NumberInputChangeHandler = useCallback((_, v) => {
    unstable_batchedUpdates(() => {
      setNextColor({ a: v / 100 });
      setHexInput(false);
    });
  }, [setNextColor]);

  const changeHEX: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const value = normalizeString(e.target.value);
    const hex = `#${value}`;
    const isValid = colorString.get(hex);
    const tempColor = assignColor(hex) || color;
    const nextColor = { ...tempColor, hex: value };
    unstable_batchedUpdates(() => {
      setColor(nextColor);
      setHexInput(Boolean(isValid));
    });
  }, [assignColor, color]);

  const onBlurHEX: FocusEventHandler<HTMLInputElement> = useCallback((e) => {
    const hex = `#${normalizeString(e.target.value)}`;

    // If an invalid hex value remains `onBlur`, correct course by calling
    // `getColor` which will return a valid one to us.
    const nextColor = assignColor(hex) || color;
    unstable_batchedUpdates(() => {
      setColor(nextColor);
      setHexInput(true);
    });
  }, [assignColor, color]);

  const handleReset = () => setColor(i);

  const onXYChange = useCallback((pos: Position) => {
    const color = colorCoordValue(channel, pos);
    if (isRGBChannel(channel)) changeRGB(color);
    if (isHSLChannel(channel)) changeHSL(color);
  }, [changeHSL, changeRGB, channel]);

  const onColorSliderChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const value = toNumber(e.target.value);
    const color: Partial<ColorObject> = {};
    color[channel] = value;
    if (isRGBChannel(channel)) changeRGB(color);
    if (isHSLChannel(channel)) changeHSL(color);
  }, [changeHSL, changeRGB, channel]);

  const onAlphaSliderChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    const value = toNumber(e.target.value);
    changeHSL({
      a: value / 100
    });
  }, [changeHSL]);

  const setMode: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    unstable_batchedUpdates(() => {
      setInputMode(e.target.value as unknown as ColorMode);
      setHexInput(false);
    });
  }, []);

  const setChannel = useCallback((channel: ColorChannel) => {
    unstable_batchedUpdates(() => {
      setChannel(channel);
      setHexInput(false);
    });
  }, []);

  const { r, g, b, h, s, l, hex } = color;
  const a = Math.round(color.a * 100);
  const themeObject: Theme = { ...defaultTheme, ...theme };

  if (!readOnly) {
    themeObject.numberInput = `${themeObject.numberInput} bg-white`;
  } else {
    themeObject.xyControlContainer = `${themeObject.xyControlContainer} events-none`;
  }

  const themer = autoKey(themeable(themeObject));

  const themeRGBGradient: RGBGradientTheme = {
    gradient: themeObject.gradient,
    gradientRHigh: themeObject.gradientRHigh,
    gradientRLow: themeObject.gradientRLow,
    gradientGHigh: themeObject.gradientGHigh,
    gradientGLow: themeObject.gradientGLow,
    gradientBHigh: themeObject.gradientBHigh,
    gradientBLow: themeObject.gradientBLow
  };

  const themeNumberInput: NumberInputTheme = {
    numberInputContainer: themeObject.numberInputContainer,
    numberInputLabel: themeObject.numberInputLabel,
    numberInput: themeObject.numberInput
  };

  const themeModeInput: ModeInputTheme = {
    modeInputContainer: themeObject.modeInputContainer,
    modeInput: themeObject.modeInput
  };

  let channelMax;
  if (isRGBChannel(channel)) {
    channelMax = 255;
  } else if (channel === 'h') {
    channelMax = 360;
  } else {
    channelMax = 100;
  }

  const rgbaBackground = rgbaColor(r, g, b, a);
  const opacityGradient = `linear-gradient(
      to right,
      ${rgbaColor(r, g, b, 0)},
      ${rgbaColor(r, g, b, 100)}
    )`;

  const hueBackground = `hsl(${h}, 100%, 50%)`;

  // Slider background color for saturation & value.
  const hueSlide: CSSProperties = {};
  if (channel === 'l') {
    hueSlide.background = `linear-gradient(to left, #fff 0%, ${hueBackground} 50%, #000 100%)`;
  } else if (channel === 's') {
    hueSlide.background = `linear-gradient(to left, ${hueBackground} 0%, #bbb 100%)`;
  }

  // Opacity between color spaces in RGB & SL
  let opacityHigh = 0;
  let opacityLow = 0;

  if (isRGBChannel(channel)) {
    opacityHigh = Math.round((color[channel] / 255) * 100) / 100;
    opacityLow = Math.round(100 - (color[channel] / 255) * 100) / 100;
  } else if (['s', 'l'].includes(channel)) {
    opacityHigh = Math.round((color[channel] / 100) * 100) / 100;
    opacityLow = Math.round(100 - (color[channel] / 100) * 100) / 100;
  }
  return (
    <div {...themer('container')}>
      <div {...themer('topWrapper')}>
        <div {...themer('gradientContainer')}>
          <XYControl
            {...colorCoords(channel, color)}
            isDark={isDark(r, g, b, a)}
            theme={{
              xyControlContainer: themeObject.xyControlContainer,
              xyControl: themeObject.xyControl,
              xyControlDark: themeObject.xyControlDark
            }}
            onChange={onXYChange}
          >
            <RGBGradient
              active={channel === 'r'}
              theme={themeRGBGradient}
              color='r'
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <RGBGradient
              active={channel === 'g'}
              theme={themeRGBGradient}
              color='g'
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <RGBGradient
              active={channel === 'b'}
              theme={themeRGBGradient}
              color='b'
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <HGradient
              theme={{
                gradient: themeObject.gradient,
                gradientHue: themeObject.gradientHue
              }}
              active={channel === 'h'}
              hueBackground={hueBackground}
            />
            <SGradient
              theme={{
                gradient: themeObject.gradient,
                gradientSaturation: themeObject.gradientSaturation
              }}
              active={channel === 's'}
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
            <LGradient
              theme={{
                gradient: themeObject.gradient,
                gradientLight: themeObject.gradientLight
              }}
              active={channel === 'l'}
              opacityLow={opacityLow}
              opacityHigh={opacityHigh}
            />
          </XYControl>
          <div
            {...themer(
              'slider',
              'colorModeSlider',
              `colorModeSlider${channel.toUpperCase()}`
            )}
          >
            <input
              {...(readOnly ? { disabled: true } : {})}
              data-testid='color-slider'
              type='range'
              value={color[channel]}
              style={hueSlide}
              onChange={onColorSliderChange}
              min={0}
              max={channelMax}
            />
          </div>
          {alpha && (
            <div {...themer('slider', 'tileBackground')}>
              <input
                {...(readOnly ? { disabled: true } : {})}
                data-testid='alpha-slider'
                type='range'
                value={a}
                onChange={onAlphaSliderChange}
                style={{ background: opacityGradient }}
                min={0}
                max={100}
              />
            </div>
          )}
        </div>
        <div {...themer('controlsContainer')}>
          <div {...themer('toggleGroup')}>
            <label {...themer('toggleContainer')}>
              <input
                data-testid='mode-hsl'
                checked={mode === 'hsl'}
                onChange={setMode}
                value='hsl'
                name='toggle'
                type='radio'
              />
              <div {...themer('toggle')}>HSL</div>
            </label>
            <label {...themer('toggleContainer')}>
              <input
                data-testid='mode-rgb'
                checked={mode === 'rgb'}
                onChange={setMode}
                value='rgb'
                name='toggle'
                type='radio'
              />
              <div {...themer('toggle')}>RGB</div>
            </label>
          </div>
          <ModeInputs
            mode={mode}
            channel={channel}
            setChannel={setChannel}
            themer={themer}
            themeModeInput={themeModeInput}
            themeNumberInput={themeNumberInput}
            readOnly={readOnly}
            modeInputName={modeInputName}
            r={r}
            g={g}
            b={b}
            changeRGB={changeRGB}
            h={h}
            s={s}
            l={l}
            changeHSL={changeHSL}
          />
          {alpha && (
            <div {...themer('alphaContainer')}>
              <SLAlphaInput
                id={ALPHA_CHANNEL}
                value={a}
                theme={themeNumberInput}
                onChange={changeAlpha}
                readOnly={readOnly || undefined}
              />
            </div>
          )}
        </div>
      </div>
      <div {...themer('bottomWrapper')}>
        <div {...themer('swatchCompareContainer')}>
          {reset && (
            <div {...themer('tileBackground', 'currentSwatchContainer')}>
              <button
                {...themer('swatch', 'currentSwatch')}
                {...(readOnly
                  ? { disabled: true, 'aria-disabled': true }
                  : {})}
                title='Reset color'
                aria-label='Reset color'
                data-testid='color-reset'
                type='button'
                style={{
                  backgroundColor: `rgba(${i.r}, ${i.g}, ${i.b}, ${i.a})`
                }}
                onClick={handleReset}
              >
                {`${readOnly ? '' : 'Reset'}`}
              </button>
            </div>
          )}
          <div {...themer('tileBackground', 'newSwatchContainer')}>
            <div
              {...themer('swatch')}
              style={{ backgroundColor: rgbaBackground }}
            />
          </div>
        </div>
        <div {...themer('hexContainer')}>
          <label {...themer('numberInputLabel')}>#</label>
          <input
            readOnly={readOnly}
            {...themer('numberInput')}
            data-testid='hex-input'
            value={hex}
            onChange={changeHEX}
            onBlur={onBlurHEX}
            type='text'
          />
        </div>
      </div>
    </div>
  );
};
