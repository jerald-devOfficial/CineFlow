import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { MovieDetail } from '../../models/movie.model';
import { ApiService } from '../../services/api.service';
import { MovieModalComponent } from '../modals/movie/movie.component';

interface Movie {
  title: string;
  image: string;
  netflixUrl: string;
}

@Component({
  selector: 'app-movies-component',
  standalone: true,
  imports: [CommonModule, MovieModalComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent implements OnInit, OnDestroy {
  movies: MovieDetail[] = [];
  netflixMovies: Movie[] = [
    {
      title: 'Demon Slayer',
      image: 'assets/images/movies/demon-slayer.png',
      netflixUrl: 'https://www.netflix.com/title/81091393',
    },
    {
      title: 'One Piece',
      image: 'assets/images/movies/one-piece.png',
      netflixUrl: 'https://www.netflix.com/title/80217863',
    },
    {
      title: 'Suits',
      image: 'assets/images/movies/suits.png',
      netflixUrl: 'https://www.netflix.com/title/70195800',
    },
    {
      title: 'The Legend of Korra',
      image: 'assets/images/movies/the-legend-of-korra.png',
      netflixUrl: 'https://www.netflix.com/title/80027563',
    },
    {
      title: 'The Garfield Show',
      image: 'assets/images/movies/the-garfield-show.png',
      netflixUrl: 'https://www.netflix.com/title/70180088',
    },
  ];
  isLoading = true;
  selectedMovie: MovieDetail | null = null;
  private refreshSubscription?: Subscription;
  private isInitialLoad = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Initial load
    this.loadMovies();

    // Set up periodic refresh (every 5 seconds)
    this.refreshSubscription = interval(5000).subscribe(() => {
      this.loadMovies(false);
    });
  }

  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  async loadMovies(showLoading: boolean = true) {
    try {
      // Only show loading on initial load
      if (showLoading && this.isInitialLoad) {
        this.isLoading = true;
      }

      const fetchedMovies = await this.apiService.getMovies();
      // Only update if the data has changed
      if (JSON.stringify(this.movies) !== JSON.stringify(fetchedMovies)) {
        console.log('Movies updated:', fetchedMovies);
        this.movies = fetchedMovies;
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      if (this.isInitialLoad) {
        this.isLoading = false;
        this.isInitialLoad = false;
      }
    }
  }

  openModal(movie: MovieDetail) {
    this.selectedMovie = movie;
  }

  closeModal() {
    this.selectedMovie = null;
  }
}
