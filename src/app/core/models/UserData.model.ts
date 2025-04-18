import { Avatar } from "./Avatar.model";

export interface UserData {
  id: string;
  email: string;
  name: string;
  lastname: string;
  avatar?: Avatar | null;
}