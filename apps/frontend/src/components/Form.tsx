import React, { type ReactNode } from 'react';

/**
 * Props for the Form component
 */
export interface FormProps {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  submitLabel?: string;
  isLoading?: boolean;
}

/**
 * Reusable form wrapper component
 * Handles layout and submission for authentication and other forms
 */
export function Form({
  title,
  onSubmit,
  children,
  submitLabel = 'Enviar',
  isLoading = false,
}: FormProps) {
  return (
    <article className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {title}
        </h2>
        <form onSubmit={onSubmit}>
          {children}
          <div className="flex items-center justify-center mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? 'Procesando...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </article>
  );
}
