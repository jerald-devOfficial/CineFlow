import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

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

  onVideoLoaded() {
    // Ensure metadata is loaded and seeking is enabled
    const video = this.videoPlayer.nativeElement;
    if (video.duration === Infinity) {
      // If duration is not available, try to seek to a large time to force metadata load
      video.currentTime = 1e101;
      video.currentTime = 0;
    }
  }
}
