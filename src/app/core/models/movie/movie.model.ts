export interface Movie {
  id: string;
  title: string;
  original_title: string;
  overview?: string;
  original_language?: string;
  score?: number;
  release_date?: string;
  budget?: number;
  revenue?: number;
  runtime?: number;
  status?: "enabled" | "disabled";
  tagline?: string;
  poster_id?: string;
  backdrop_id?: string;
  created_at: string;
  updated_at: string;
  genres?: {
    id: string;
    name: string;
  }[];
  user_relation: UserRelation;
}

export interface UserRelation{
  user_id: string;
  movie_id: string;
  rating: number;
  acting_rating: number;
  music_rating: number;
  pacing_rating: number;
  story_rating: number;
  entertainment_rating: number;
  visuals_rating: number;
  is_favorite: boolean;
  to_watch: boolean | null;
}