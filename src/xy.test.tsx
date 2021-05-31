import React from 'react';
import { render } from '@testing-library/react';
import { XYControl, XYControlProps } from './xy';

describe('XYControl', () => {
  test('renders', () => {
    const props: XYControlProps = {
      theme: {},
      x: 0,
      y: 10,
      xmax: 100,
      ymax: 100,
      isDark: false,
      onChange: jest.fn()
    };

    const { baseElement } = render(
      <XYControl {...props}>
        <span>children</span>
      </XYControl>
    );
    expect(baseElement).toMatchSnapshot();
  });

  test('renders isDark', () => {
    const props: XYControlProps = {
      theme: {},
      x: 0,
      y: 10,
      xmax: 100,
      ymax: 100,
      isDark: true,
      onChange: jest.fn()
    };

    const { baseElement } = render(
      <XYControl {...props}>
        <span>children</span>
      </XYControl>
    );
    expect(baseElement).toMatchSnapshot();
  });
});
