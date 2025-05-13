import { Avatar } from "../Avatar.model";

export interface BasicUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  deleted_last_movie_watchlist: boolean;
  avatar_id: string;
  config_scorer: 'starts' | 'slider';
  maximum_star_rating: number;
  maximum_slider_rating: number;
  vote_type: 'simple' | 'advanced';
  status: 'normal' | 'blocked';
  action_count: number;
  avatar?: Avatar | null;
  statistics?: StatisticsUser;
  genres?: GenresUser[];
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

export interface StatisticsUser {
  most_viewed_genre: string;
  rated_movies: number;
  average_rating: number;
  watching_movies: number
}

export interface GenresUser {
  id: string;
  name: string;
  pivot: {
    genre_id: string;
    user_id: string;
  }
}
