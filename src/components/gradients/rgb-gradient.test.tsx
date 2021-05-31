import React from 'react';
import { render } from '@testing-library/react';
import { RGBGradient, RGBGradientProps } from './rgb-gradient.js';

describe('RGBGradient', () => {
  test('renders', () => {
    const props: RGBGradientProps = {
      active: true,
      color: 'r',
      theme: {},
      opacityLow: 0,
      opacityHigh: 0
    };

    const { baseElement } = render(<RGBGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });

  test('renders with opacity', () => {
    const props: RGBGradientProps = {
      active: false,
      color: 'r',
      theme: {},
      opacityLow: 0.5,
      opacityHigh: 0.6
    };

    const { baseElement } = render(<RGBGradient {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
