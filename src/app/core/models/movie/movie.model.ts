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
}