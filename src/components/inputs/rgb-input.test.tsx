import { render } from '@testing-library/react';
import React from 'react';
import { RGBInput, RGBInputProps } from './rgb-input';

describe('RgbInput', () => {
  test('renders', () => {
    const props: RGBInputProps = {
      id: 'r',
      value: 200,
      theme: {},
      onChange: jest.fn()
    };

    const { baseElement } = render(<RGBInput {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
