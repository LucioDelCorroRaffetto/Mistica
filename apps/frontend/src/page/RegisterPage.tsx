import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { useFormValidation, type FormErrors } from '../hook/useFormValidation';

/**
 * Validation rules for register form
 */
const validateRegisterForm = (values: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): FormErrors => {
  const errors: FormErrors = {};

  if (!values.username?.trim()) {
    errors.username = 'El nombre de usuario es obligatorio';
  } else if (values.username.length < 3) {
    errors.username = 'El nombre debe tener al menos 3 caracteres';
  } else if (values.username.length > 50) {
    errors.username = 'El nombre no puede exceder 50 caracteres';
  }

  if (!values.email) {
    errors.email = 'El email es obligatorio';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Email inválido';
  }

  if (!values.password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (values.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden';
  }

  return errors;
};

/**
 * Register page component
 * Handles user registration with validation and error handling
 */
export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { values, errors, touched, handleChange, handleBlur, validateForm, reset } =
    useFormValidation(
      { username: '', email: '', password: '', confirmPassword: '' },
      validateRegisterForm
    );

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setSuccessMessage(null);

    if (!validateForm(true)) {
      setGeneralError('Por favor completa todos los campos correctamente');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      setSuccessMessage('¡Cuenta creada exitosamente! Redirigiendo...');
      reset();
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setGeneralError(
        `No pudimos crear tu cuenta. ${errorMessage}. Intenta de nuevo.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-wrapper">
        <div className="register-form-header">
          <h1>Crear Cuenta</h1>
          <p>Únete a Mística hoy</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form-box">
          {generalError && (
            <div className="register-error-message">
              {generalError}
            </div>
          )}

          {successMessage && (
            <div className="register-success-message">
              {successMessage}
            </div>
          )}

          <div className="register-form-group">
            <label htmlFor="username">Nombre de Usuario</label>
            <input
              id="username"
              type="text"
              name="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="tu_usuario"
              className={errors.username && touched.username ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.username && touched.username && (
              <div className="register-form-error">{errors.username}</div>
            )}
            {!errors.username && values.username && touched.username && (
              <div className="register-form-hint success">✓ Nombre válido</div>
            )}
          </div>

          <div className="register-form-group">
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
              <div className="register-form-error">{errors.email}</div>
            )}
            {!errors.email && values.email && touched.email && (
              <div className="register-form-hint success">✓ Email válido</div>
            )}
          </div>

          <div className="register-form-group">
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
              <div className="register-form-error">{errors.password}</div>
            )}
            {!errors.password && values.password && touched.password && (
              <div className="register-form-hint success">✓ Contraseña válida</div>
            )}
          </div>

          <div className="register-form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="••••••••"
              className={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
              disabled={isLoading}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <div className="register-form-error">{errors.confirmPassword}</div>
            )}
            {!errors.confirmPassword && values.confirmPassword && touched.confirmPassword && values.password === values.confirmPassword && (
              <div className="register-form-hint success">✓ Contraseñas coinciden</div>
            )}
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-loading-spinner">
                <span className="spinner spinner-sm"></span>
                Creando Cuenta...
              </span>
            ) : (
              'Registrarse'
            )}
          </button>

          <div className="register-form-footer">
            <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a></p>
          </div>
        </form>
      </div>
    </div>
  );
}
