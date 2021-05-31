import { Themeable } from '@seinopsys-forks/react-themeable';

export type AutoKeyedThemer<ThemeName extends string> = (...names: Parameters<Themeable<ThemeName>>[1][]) => ReturnType<Themeable<ThemeName>>;
export type AutoKey = <ThemeName extends string>(func: Themeable<ThemeName>) => AutoKeyedThemer<ThemeName>;

/**
 * Generate an autokey to be used with react-themeable
 * @internal
 */
export const autoKey: AutoKey = (func) => {
  let autoKey = 1;
  return (...names) => func(autoKey++, ...names);
};
