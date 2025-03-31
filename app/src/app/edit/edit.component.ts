import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faCalendarCheck,
  faCalendarPlus,
  faCheck,
  faSpinner,
  faTrash,
  faUndo,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { DeleteModalComponent } from '../components/modals/delete/delete.component';
import { MovieDetail } from '../models/movie.model';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DeleteModalComponent,
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class EditPageComponent implements OnInit {
  faSpinner = faSpinner;
  faCheck = faCheck;
  faUndo = faUndo;
  faVideo = faVideo;
  faTrash = faTrash;
  faCalendarPlus = faCalendarPlus;
  faCalendarCheck = faCalendarCheck;
  faArrowLeft = faArrowLeft;

  editForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = true;
  isSaving = false;
  previewUrl: string | null = null;
  videoElement: HTMLVideoElement | null = null;
  isSuccess = false;
  movieId: string = '';
  originalMovie: MovieDetail | null = null;
  showDeleteConfirm = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.movieId = this.route.snapshot.params['id'];
    try {
      const movie = await this.apiService.getMovie(this.movieId);
      this.originalMovie = movie;
      this.editForm.patchValue({
        title: movie.title,
        description: movie.description,
      });
      this.previewUrl = movie.thumbnail;
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading movie:', error);
      this.router.navigate(['/not-found']);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.selectedFile = file;
      this.createVideoPreview(file);
    } else {
      alert('Please select a valid video file');
      this.selectedFile = null;
    }
  }

  private createVideoPreview(file: File): void {
    if (this.videoElement) {
      URL.revokeObjectURL(this.videoElement.src);
    }

    this.videoElement = document.createElement('video');
    this.videoElement.preload = 'metadata';
    this.videoElement.playsInline = true;
    this.videoElement.muted = true;

    const objectUrl = URL.createObjectURL(file);
    this.videoElement.src = objectUrl;

    this.videoElement.onloadeddata = () => {
      this.videoElement
        ?.play()
        .then(() => {
          setTimeout(() => {
            if (this.videoElement) {
              this.videoElement.pause();

              const canvas = document.createElement('canvas');
              canvas.width = 1280; // 720p width for good balance of quality and size
              canvas.height = 720; // 720p height

              const ctx = canvas.getContext('2d');
              if (ctx && this.videoElement) {
                // Enable high-quality image rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // Get video dimensions
                const { videoWidth, videoHeight } = this.videoElement;
                const videoAspect = videoWidth / videoHeight;
                const canvasAspect = canvas.width / canvas.height;

                // Calculate dimensions to maintain aspect ratio
                let renderWidth = canvas.width;
                let renderHeight = canvas.height;
                let offsetX = 0;
                let offsetY = 0;

                if (videoAspect > canvasAspect) {
                  // Video is wider than canvas
                  renderHeight = canvas.width / videoAspect;
                  offsetY = (canvas.height - renderHeight) / 2;
                } else {
                  // Video is taller than canvas
                  renderWidth = canvas.height * videoAspect;
                  offsetX = (canvas.width - renderWidth) / 2;
                }

                // Add black background
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw the video frame
                ctx.drawImage(
                  this.videoElement,
                  offsetX,
                  offsetY,
                  renderWidth,
                  renderHeight
                );

                // Convert to high-quality JPEG
                this.previewUrl = canvas.toDataURL('image/jpeg', 0.92);
              }
            }
          }, 1000);
        })
        .catch((error) => {
          console.error('Error generating preview:', error);
          this.previewUrl = 'assets/images/assorted/video-placeholder.png';
        });
    };
  }

  resetForm(): void {
    if (this.originalMovie) {
      this.editForm.patchValue({
        title: this.originalMovie.title,
        description: this.originalMovie.description,
      });
      this.previewUrl = this.originalMovie.thumbnail;
      this.selectedFile = null;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.editForm.valid) {
      try {
        this.isSaving = true;

        // Only include thumbnail if we have both a new file and a preview URL
        const thumbnail =
          this.selectedFile && this.previewUrl ? this.previewUrl : undefined;

        await this.apiService.patchMovie(
          this.movieId,
          this.selectedFile || undefined, // Convert null to undefined
          this.editForm.get('title')?.value,
          this.editForm.get('description')?.value,
          thumbnail
        );

        this.isSaving = false;
        this.isSuccess = true;

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      } catch (error) {
        this.isSaving = false;
        this.isSuccess = false;
        console.error('Update error:', error);
      }
    }
  }

  async onDeleteConfirmed(): Promise<void> {
    try {
      await this.apiService.deleteMovie(this.movieId);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    if (this.videoElement) {
      URL.revokeObjectURL(this.videoElement.src);
    }
  }
}
