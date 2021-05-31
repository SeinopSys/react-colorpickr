import { render } from '@testing-library/react';
import React from 'react';
import { SLAlphaInput, SLAlphaInputProps } from './sl-alpha-input.js';

describe('SLAlphaInput', () => {
  test('renders', () => {
    const props: SLAlphaInputProps = {
      id: 's',
      value: 92,
      theme: {},
      onChange: jest.fn()
    };

    const { baseElement } = render(<SLAlphaInput {...props} />);
    expect(baseElement).toMatchSnapshot();
  });
});
