export type Role = 'admin' | 'cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}
