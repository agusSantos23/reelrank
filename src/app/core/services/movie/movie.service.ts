import { Injectable } from '@angular/core';


export interface MovieBasicInfo {
  id: string,
  title: string,
  releaseYear: number,
  duration: number,
  score: number,
  posterId: string
}

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private movies: MovieBasicInfo[] = [
    {
      id: "tt0068646",
      title: 'The Godfather',
      releaseYear: 1972,
      duration: 175,
      score: 92,
      posterId: '0RN4Q5Sm'
    },
    {
      id: "tt0111161",
      title: 'The Shawshank Redemption',
      releaseYear: 1994,
      duration: 142,
      score: 93,
      posterId: 'S47nNXGh'
    },
    {
      id: "tt0071562",
      title: 'The Godfather: Part II',
      releaseYear: 1974,
      duration: 202,
      score: 90,
      posterId: 'RGCLp94n'
    },
    {
      id: "tt0468569",
      title: 'The Dark Knight',
      releaseYear: 2008,
      duration: 152,
      score: 90,
      posterId: 'Hp1wZ4YV'
    },
    {
      id: "tt0108052",
      title: 'Schindler\'s List',
      releaseYear: 1993,
      duration: 195,
      score: 89,
      posterId: 'Z62SvJzg'
    },
    {
      id: "tt0167260",
      title: 'The Lord of the Rings: The Return of the King',
      releaseYear: 2003,
      duration: 201,
      score: 90,
      posterId: 'G3WVfdwS'
    },
    {
      id: "tt0050083",
      title: '12 Angry Men',
      releaseYear: 1957,
      duration: 96,
      score: 90,
      posterId: 'PzZHhtMw'
    },
    {
      id: "tt0110912",
      title: 'Pulp Fiction',
      releaseYear: 1994,
      duration: 154,
      score: 89,
      posterId: 'Wjs8r7h'
    },
  ];

  constructor() { }

  getMovies() {
    return this.movies;
  }

  getMovie(id: string) {
    return this.movies.find(movie => movie.id === id);
  }
}
