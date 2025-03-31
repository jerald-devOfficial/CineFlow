import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPencil,
  faPlay,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MovieDetail } from '../../../models/movie.model';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-movie-modal',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieModalComponent {
  @Input() movie!: MovieDetail;
  @Output() closeModal = new EventEmitter<void>();
  @Output() movieDeleted = new EventEmitter<void>();

  faPlay = faPlay;
  faPencil = faPencil;
  faTrash = faTrash;
  faTimes = faTimes;

  constructor(private router: Router, private apiService: ApiService) {}

  onWatch() {
    this.router.navigate(['/watch', this.movie.id]);
  }

  onEdit() {
    this.router.navigate(['/edit', this.movie.id]);
  }

  async onDelete() {
    if (confirm(`Are you sure you want to delete "${this.movie.title}"?`)) {
      try {
        await this.apiService.deleteMovie(this.movie.id.toString());
        this.movieDeleted.emit();
        this.onClose();
      } catch (error) {
        console.error('Error deleting movie:', error);
      }
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
