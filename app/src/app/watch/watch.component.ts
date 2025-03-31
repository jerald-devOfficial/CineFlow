import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { MovieDetail } from '../models/movie.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-watch-page',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.css',
})
export class WatchPageComponent implements OnInit {
  movie?: MovieDetail;
  isLoading = true;
  faArrowLeft = faArrowLeft;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      try {
        this.movie = await this.apiService.getMovie(id);
      } catch (error) {
        console.error('Error loading movie:', error);
        this.router.navigate(['/']); // Redirect to home if movie not found
      } finally {
        this.isLoading = false;
      }
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
