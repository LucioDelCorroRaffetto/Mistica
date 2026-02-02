import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFormValidation, type FormErrors } from './useFormValidation';

describe('useFormValidation', () => {
  const initialValues = { email: '', password: '' };

  const mockValidate = (values: any): FormErrors => {
    const errors: FormErrors = {};

    if (!values.email) {
      errors.email = 'Email is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }

    return errors;
  };

  test('should initialize with provided values', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidate)
    );

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });

  test('should update values on change', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidate)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'test@test.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.email).toBe('test@test.com');
  });

  test('should validate form and return true if valid', () => {
    const { result } = renderHook(() =>
      useFormValidation(
        { email: 'test@test.com', password: 'password123' },
        mockValidate
      )
    );

    const isValid = result.current.validateForm();
    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });

  test('should validate form and collect errors if invalid', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidate)
    );

    const isValid = result.current.validateForm();
    expect(isValid).toBe(false);
    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.password).toBe('Password is required');
  });

  test('should reset form to initial values', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidate)
    );

    act(() => {
      result.current.handleChange({
        target: { name: 'email', value: 'changed@test.com' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.email).toBe('changed@test.com');

    act(() => {
      result.current.reset();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
  });

  test('should track touched fields', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, mockValidate)
    );

    act(() => {
      result.current.handleBlur({
        target: { name: 'email', value: '' },
      } as React.FocusEvent<HTMLInputElement>);
    });

    expect(result.current.touched.email).toBe(true);
  });
});
