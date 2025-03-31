import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faPencil,
  faPlay,
  faSpinner,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { MovieDetail } from '../../../models/movie.model';
import { ApiService } from '../../../services/api.service';
import { DeleteModalComponent } from '../delete/delete.component';

@Component({
  selector: 'app-movie-modal',
  imports: [CommonModule, FontAwesomeModule, DeleteModalComponent],
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
  faSpinner = faSpinner;
  faCheck = faCheck;
  isDeleting = false;
  isDeleteSuccess = false;
  showDeleteConfirm = false;

  constructor(private router: Router, private apiService: ApiService) {}

  onWatch() {
    this.router.navigate(['/watch', this.movie.id]);
  }

  onEdit() {
    this.router.navigate(['/edit', this.movie.id]);
  }

  async onDeleteConfirmed() {
    try {
      await this.apiService.deleteMovie(this.movie.id.toString());
      setTimeout(() => {
        this.movieDeleted.emit();
        this.onClose();
      }, 1500);
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  openDeleteConfirm() {
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
  }
}
