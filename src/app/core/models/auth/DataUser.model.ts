import { Avatar } from "../Avatar.model";

export interface BasicUser {
  id: string;
  avatar_id: string;
  config_scorer: string;
  email: string;
  name: string;
  lastname: string;
  avatar?: Avatar | null;
}

export interface RegisterUser {
  name: string;
  lastname: string;
  email: string;
  password: string;
  password_confirmation: string;
  avatarId?: string;
}

export interface LoginUser {
  email?: string | null;
  password?: string | null;
}

