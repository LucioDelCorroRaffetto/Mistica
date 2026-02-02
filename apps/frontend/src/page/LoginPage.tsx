import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { useFormValidation, type FormErrors } from '../hook/useFormValidation';

/**
 * Validation rules for login form
 */
const validateLoginForm = (values: {
  email: string;
  password: string;
}): FormErrors => {
  const errors: FormErrors = {};

  if (!values.email) {
    errors.email = 'Email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Email inválido';
  }

  if (!values.password) {
    errors.password = 'Contraseña es obligatoria';
  } else if (values.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  return errors;
};

/**
 * Login page component
 * Handles user authentication with email and password
 * Separates form logic using custom hooks and reusable components
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { values, errors, touched, handleChange, handleBlur, validateForm, reset } =
    useFormValidation(
      { email: '', password: '' },
      validateLoginForm
    );

  /**
   * Handles form submission
   * Validates before attempting login
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: values.email, password: values.password });
      reset();
      navigate('/');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setGeneralError(
        `Credenciales incorrectas. Por favor intenta de nuevo. ${errorMessage}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-wrapper">
        <div className="login-form-header">
          <h1>Bienvenido</h1>
          <p>Inicia sesión en tu cuenta</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form-box">
          {generalError && (
            <div className="login-error-message">
              {generalError}
            </div>
          )}
          
          <div className="form-input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="tu@email.com"
              className={errors.email && touched.email ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.email && touched.email && (
              <div className="form-input-error">{errors.email}</div>
            )}
          </div>

          <div className="form-input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              className={errors.password && touched.password ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.password && touched.password && (
              <div className="form-input-error">{errors.password}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-loading-spinner">
                <span className="spinner spinner-sm"></span>
                Entrando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <div className="login-form-footer">
            <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}