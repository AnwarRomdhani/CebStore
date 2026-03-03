export type Role = 'USER' | 'ADMIN';

export type AuthUserDto = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
};

