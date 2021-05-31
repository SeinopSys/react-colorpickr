import Color from 'color';
import colorString from 'color-string';

export type ColorMode = 'rgb' | 'hsl';

/**
 * @internal
 */
export const ALPHA_CHANNEL = 'α' as const;

/**
 * @internal
 */
export type ColorChannelRGB = 'r' | 'g' | 'b';

/**
 * @internal
 */
export type ColorChannelHSL = 'h' | 's' | 'l';

/**
 * @internal
 */
export type ColorChannelAlpha = typeof ALPHA_CHANNEL;

export type ColorChannel = ColorChannelRGB | ColorChannelHSL;

/**
 * @internal
 */
export type ColorChannelsObject = { [k in ColorChannel]: number };

export type ColorObject = ColorChannelsObject & { a: number; hex: string };

/**
 * @internal
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * @internal
 */
type ChannelValuesMap = {
  r: { b: number; g: number };
  g: { b: number; r: number };
  b: { r: number; g: number };
  h: { s: number; l: number };
  s: { h: number; l: number };
  l: { h: number; s: number };
};

/**
 * @internal
 */
export function isDark(r: number, g: number, b: number, a: number): boolean {
  return (
    r * 0.299 + g * 0.587 + b * 0.114 > 186 ||
    a < 0.5
  );
}

/**
 * Knock off the # and lowercase
 * @internal
 */
export const normalizeHex = (hex: string): string => hex.substring(1).toLowerCase();

/**
 * @internal
 */
export function getColor(cssColor: string): ColorObject {
  const isValid = colorString.get(cssColor);

  const color = Color(isValid ? cssColor : '#000');
  const { r, g, b, alpha } = color.rgb().object();
  const { h, s, l } = color.hsl().object();

  let hex: string;

  // If a short hex came in, accept it as value.
  if (isValid && cssColor.length === 4) {
    hex = normalizeHex(cssColor);
  } else {
    hex = normalizeHex(color.hex());
  }

  return {
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l),
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    a: typeof alpha === 'undefined' || isNaN(alpha) ? 1 : alpha,
    hex
  };
}

/**
 * @internal
 */
export function rgbaColor(r: number, g: number, b: number, a: number): string {
  return `rgba(${[r, g, b, a / 100].join(',')})`;
}

/**
 * @internal
 */
export function hsl2rgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const { r, g, b } = Color({ h, s, l }).rgb().object();
  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };
}

/**
 * @internal
 */
export function rgb2hex(r: number, g: number, b: number): string {
  return normalizeHex(Color({ r, g, b }).hex());
}

/**
 * @internal
 */
export function rgb2hsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const { h, s, l } = Color({ r, g, b }).hsl().object();
  return {
    h: Math.round(h),
    s: Math.round(s),
    l: Math.round(l)
  };
}

/**
 * @internal
 */
interface ColorCoordsResult {
  xmax: number;
  ymax: number;
  x: number;
  y: number;
}

/**
 * @internal
 */
const colorCoordsMapper: { [k in ColorChannel]: (color: ChannelValuesMap[k]) => ColorCoordsResult } = {
  r(color) {
    const ymax = 255;
    return {
      xmax: 255,
      ymax,
      x: color.b,
      y: ymax - color.g
    };
  },
  g(color) {
    const ymax = 255;
    return {
      xmax: 255,
      ymax,
      x: color.b,
      y: ymax - color.r
    };
  },
  b(color) {
    const ymax = 255;
    return {
      xmax: 255,
      ymax,
      x: color.r,
      y: ymax - color.g
    };
  },
  h(color) {
    const ymax = 100;
    return {
      xmax: 100,
      ymax,
      x: color.s,
      y: ymax - color.l
    };
  },
  s(color) {
    const ymax = 100;
    return {
      xmax: 360,
      ymax,
      x: color.h,
      y: ymax - color.l
    };
  },
  l(color) {
    const ymax = 100;
    return {
      xmax: 360,
      ymax,
      x: color.h,
      y: ymax - color.s
    };
  }
};

/**
 * Determine x y coordinates based on color channel.
 *
 * R: x = b, y = g
 * G: x = b, y = r
 * B: x = r, y = g
 *
 * H: x = s, y = l
 * S: x = h, y = l
 * L: x = h, y = s
 *
 * @internal
 * @param channel one of `r`, `g`, `b`, `h`, `s`, or `l`
 * @param color a color object of current values associated to key
 * @return {Object} coordinates
 */
export function colorCoords<C extends ColorChannel>(channel: C, color: ChannelValuesMap[C]): ColorCoordsResult {
  return colorCoordsMapper[channel](color as never);
}

/**
 * Takes a channel and returns its sibling values based on x,y positions
 *
 * R: x = b, y = g
 * G: x = b, y = r
 * B: x = r, y = g
 *
 * H: x = s, y = l
 * S: x = h, y = l
 * L: x = h, y = s
 *
 * @internal
 * @param {string} channel one of `r`, `g`, `b`, `h`, `s`, or `l`
 * @param {Object} pos x, y coordinates
 * @return {Object} Changed sibling values
 */
export function colorCoordValue<C extends ColorChannel>(channel: C, pos: Position): ChannelValuesMap[C] {
  const color: { [k in ColorChannel]?: number } = {};
  pos.x = Math.round(pos.x);
  pos.y = Math.round(pos.y);

  switch (channel) {
    case 'r':
      color.b = pos.x;
      color.g = 255 - pos.y;
      break;
    case 'g':
      color.b = pos.x;
      color.r = 255 - pos.y;
      break;
    case 'b':
      color.r = pos.x;
      color.g = 255 - pos.y;
      break;
    case 'h':
      color.s = pos.x;
      color.l = 100 - pos.y;
      break;
    case 's':
      color.h = pos.x;
      color.l = 100 - pos.y;
      break;
    case 'l':
      color.h = pos.x;
      color.s = 100 - pos.y;
      break;
  }

  return color as ChannelValuesMap[C];
}

/**
 * @internal
 */
export const isRGBChannel = (c: ColorChannel): boolean => ['r', 'g', 'b'].includes(c);

/**
 * @internal
 */
export const isHSLChannel = (c: ColorChannel): boolean => ['h', 's', 'l'].includes(c);

/**
 * @internal
 */
export const toNumber = (v: string): number => v ? parseInt(v, 10) : 0;

/**
 * Normalize to string and drop a leading hash if provided.
 * @internal
 */
export const normalizeString = (v: string) => {
  return v.trim().replace(/^#/, '');
};
