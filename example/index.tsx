import React, { Fragment, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ColorObject, ColorPickr, ColorPickrAPI } from '../src';

// Output fill that's outside of the react app.
const outputFill = document.getElementById('output-fill') as HTMLElement;
const INITIAL_VALUE = 'hsla(229, 96%, 62%, 1)';
outputFill.style.backgroundColor = INITIAL_VALUE;

function App() {
  const instance = useRef<ColorPickrAPI>(null);

  const isDark = (color: ColorObject) => {
    const { r, g, b, a } = color;
    return !(r * 0.299 + g * 0.587 + b * 0.114 > 186 || a < 0.5);
  };


  const override = () => {
    if (instance.current) instance.current.overrideValue('red');
  };

  const onChange = (color: ColorObject) => {
    const { h, s, l, a } = color;
    outputFill.style.backgroundColor = `hsla(${h}, ${s}%, ${l}%, ${a})`;
    if (isDark(color)) {
      outputFill.classList.add('color-white');
      outputFill.classList.remove('color-gray-dark');
    } else {
      outputFill.classList.add('color-gray-dark');
      outputFill.classList.remove('color-white');
    }
  };

  return React.createElement(Fragment, null, [
    React.createElement(ColorPickr, {
      initialValue: INITIAL_VALUE,
      onChange,
      apiRef: instance
    }),
    React.createElement('button', {
      className: 'btn btn--gray-light absolute top right mx12 my12',
      onClick: override
    }, 'override')
  ]);
}

ReactDOM.render(<App />, document.getElementById('app'));
