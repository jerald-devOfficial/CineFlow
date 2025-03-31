import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { MovieDetail } from '../../models/movie.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent implements OnInit, OnDestroy {
  movies: MovieDetail[] = [];
  isLoading = true;
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
}
