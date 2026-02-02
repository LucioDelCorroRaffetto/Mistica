import { useState, useCallback } from 'react';

/**
 * Form field error state
 */
export interface FormErrors {
  [key: string]: string;
}

/**
 * Hook para manejar validación de formularios
 * Encapsula lógica de validación y manejo de errores
 *
 * @param initialValues - Valores iniciales del formulario
 * @param validate - Función de validación personalizada
 * @returns Object con estado y métodos del formulario
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => FormErrors
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const updatedValues = {
        ...values,
        [name]: value,
      };
      
      setValues(updatedValues);

      // Validar en tiempo real si está tocado
      if (touched[name]) {
        validateFieldWithValues(name, value, updatedValues);
      }
      
      // Validación cruzada: si cambias password, revalidar confirmPassword
      if (name === 'password' && touched.confirmPassword) {
        validateFieldWithValues('confirmPassword', updatedValues.confirmPassword, updatedValues);
      }
      // Si cambias confirmPassword, revalidar con el password actual
      if (name === 'confirmPassword') {
        validateFieldWithValues('confirmPassword', value, updatedValues);
      }
    },
    [touched, values]
  );

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, value);
  }, []);

  const validateField = (name: string, value: string) => {
    validateFieldWithValues(name, value, { ...values, [name]: value });
  };

  const validateFieldWithValues = (name: string, value: string, allValues: T) => {
    if (validate) {
      const allErrors = validate(allValues);
      // Solo actualizar el error del campo específico
      setErrors(prev => ({
        ...prev,
        [name]: allErrors[name] || ''
      }));
    }
  };

  const validateForm = useCallback((setAllTouched = false): boolean => {
    if (!validate) return true;

    const formErrors = validate(values);
    setErrors(formErrors);
    
    if (setAllTouched) {
      const allTouched: Record<string, boolean> = {};
      Object.keys(values).forEach(key => {
        allTouched[key] = true;
      });
      setTouched(allTouched);
    }
    
    return Object.keys(formErrors).length === 0;
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setValues,
  };
}
