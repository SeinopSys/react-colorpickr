import { themeable } from '@seinopsys-forks/react-themeable';
import clamp from 'clamp';
import React, {
  EventHandler,
  FunctionComponent,
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { autoKey } from './autokey';
import { Theme } from './theme';

interface Coords {
  start: { x?: number; y?: number };
  offset: { x?: number; y?: number };
  cb?: null | VoidFunction;
}

/**
 * @internal
 */
export type XYControlTheme = Pick<Theme, 'xyControlContainer' | 'xyControl' | 'xyControlDark'>;

/**
 * @internal
 */
export interface XYControlProps {
  theme: Partial<XYControlTheme>;
  x: number;
  y: number;
  xmax: number;
  ymax: number;
  isDark: boolean;
  onChange: (position: { x: number; y: number }) => void;
}

/**
 * @internal
 */
const XYControl: FunctionComponent<XYControlProps> = ({
  children,
  theme,
  x,
  y,
  xmax,
  ymax,
  isDark,
  onChange
}) => {
  const xyControlContainer = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const [coords, setCoords] = useState<Coords>({ start: {}, offset: {}, cb: null });
  const top = Math.round(clamp((y / ymax) * 100, 0, 100));
  const left = Math.round(clamp((x / xmax) * 100, 0, 100));
  const themer = autoKey(themeable(theme));

  useEffect(() => {
    mounted.current = true;
  }, []);

  const change = useCallback((pos: { left: number; top: number }) => {
    if (!mounted) return;
    const container = xyControlContainer.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    onChange({
      x: (clamp(pos.left, 0, rect.width) / rect.width) * xmax,
      y: (clamp(pos.top, 0, rect.height) / rect.height) * ymax
    });
  }, [onChange, xmax, ymax]);

  const drag = useCallback((e: WindowEventMap['mousemove'] | WindowEventMap['touchmove']) => {
    const { start, offset } = coords;
    e.preventDefault();
    const top =
      ('changedTouches' in e ? e.changedTouches[0].clientY : e.clientY) +
      (start.y || 0) -
      (offset.y || 0);
    const left =
      ('changedTouches' in e ? e.changedTouches[0].clientX : e.clientX) +
      (start.x || 0) -
      (offset.x || 0);

    change({ top, left });
  }, [change, coords]);

  const dragEnd = useCallback(() => {
    window.removeEventListener('mousemove', drag);
    window.removeEventListener('mouseup', dragEnd);
    window.removeEventListener('touchmove', drag);
    window.removeEventListener('touchend', dragEnd);
  }, [drag]);

  useEffect(() => {
    if (!coords.start.x) return;

    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchmove', drag);
    window.addEventListener('touchend', dragEnd);

    return () => dragEnd();
  }, [coords, drag, dragEnd]);

  const dragStart: EventHandler<TouchEvent<HTMLDivElement> | MouseEvent<HTMLDivElement>> = (e) => {
    e.preventDefault();
    if (!mounted) return;
    const container = xyControlContainer.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const y = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;

    const offset = {
      left: x - rect.left,
      top: y - rect.top
    };

    change(offset);

    setCoords({
      start: { x: offset.left, y: offset.top },
      offset: { x, y }
    });
  };

  return (
    <div
      {...themer('xyControlContainer')}
      ref={xyControlContainer}
      onTouchStart={dragStart}
      onMouseDown={dragStart}
    >
      <div
        {...themer('xyControl', `${isDark ? 'xyControlDark' : ''}`)}
        style={{
          top: `${top}%`,
          left: `${left}%`
        }}
      />
      {children}
    </div>
  );
};

export { XYControl };
