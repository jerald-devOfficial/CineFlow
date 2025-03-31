import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import arrGenerator from '../../../utils/arr-generator.utils'; // Import the utility
import { UploadComponent } from '../modals/upload/upload.component';
import { MoviesComponent } from '../movies/movies.component';

@Component({
  selector: 'app-hero-component',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, UploadComponent],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  @ViewChild(MoviesComponent) moviesComponent?: MoviesComponent;

  faFilm = faFilm;
  isModalOpen = false;

  // Create a property to hold the generated array
  gradientOverlays = arrGenerator(10);

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onUploadSuccess(): void {
    // Refresh movies list after successful upload
    if (this.moviesComponent) {
      this.moviesComponent.loadMovies();
    }
  }
}
