import { render } from '@testing-library/react';
import React from 'react';
import { HInput, HInputProps } from './h-input';

describe('HInput', () => {
  test('renders', () => {
    const props: HInputProps = {
      id: 'h',
      value: 200,
      theme: {},
      onChange: jest.fn()
    };

    const { baseElement } = render(<HInput {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
