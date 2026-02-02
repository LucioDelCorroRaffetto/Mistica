interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): ValidationResult {
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`${field} es obligatorio`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);

  return {
    isValid,
    errors: isValid ? [] : ['El formato del email no es válido'],
  };
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateProduct(product: any): ValidationResult {
  const errors: string[] = [];

  if (!product.name || product.name.trim() === '') {
    errors.push('El nombre del producto es obligatorio');
  }

  if (!product.description || product.description.trim() === '') {
    errors.push('La descripción del producto es obligatoria');
  }

  if (typeof product.price !== 'number' || product.price <= 0) {
    errors.push('El precio debe ser un número mayor a 0');
  }

  if (typeof product.stock !== 'number' || product.stock < 0) {
    errors.push('El stock no puede ser negativo');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
