import { Avatar } from "./Avatar.model";

export interface Saga {
  id: string;
  name: string;
  created_at: string;
  avatars: Avatar[];
}

