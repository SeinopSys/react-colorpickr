import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import { ModeInput, ModeInputProps, ModeInputTheme } from './mode-input';
import userEvent from '@testing-library/user-event';

describe('ModeInput', () => {
  let wrapper: RenderResult;
  const props: ModeInputProps = {
    checked: false,
    theme: {},
    name: 'mode',
    onChange: jest.fn()
  };

  beforeEach(() => {
    wrapper = render(<ModeInput {...props} />);
  });

  test('renders', () => {
    expect(wrapper.baseElement).toMatchSnapshot();
  });

  test('onChange', () => {
    const input = screen.getByRole('radio');
    userEvent.click(input);
    expect(props.onChange).toHaveBeenCalled();
  });
});
