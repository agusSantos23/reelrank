export interface RegisterUser {
  name: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  avatarId?: string;
}