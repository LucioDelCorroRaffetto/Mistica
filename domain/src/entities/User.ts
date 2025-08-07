export type Role = 'admin' | 'cliente';

export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public role: Role = 'cliente'
  ) {}

  changeRole(newRole: Role) {
    this.role = newRole;
  }
}
