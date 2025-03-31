import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheck,
  faSpinner,
  faTimes,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-upload',
  imports: [FontAwesomeModule, ReactiveFormsModule, CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  @Output() closeModalEvent = new EventEmitter<void>();
  @Output() uploadSuccessEvent = new EventEmitter<void>();

  faTimes = faTimes;
  faSpinner = faSpinner;
  faCheck = faCheck;
  faVideo = faVideo;
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isUploading = false;
  previewUrl: string | null = null;
  videoElement: HTMLVideoElement | null = null;
  isSuccess = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  closeModal(): void {
    this.closeModalEvent.emit();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      this.selectedFile = file;
      this.createVideoPreview(file);
    } else {
      alert('Please select a valid video file');
      this.selectedFile = null;
      this.previewUrl = null;
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

  async onSubmit(): Promise<void> {
    if (this.uploadForm.valid && this.selectedFile && this.previewUrl) {
      try {
        this.isUploading = true;
        await this.apiService.postMovie(
          this.selectedFile,
          this.uploadForm.get('title')?.value,
          this.uploadForm.get('description')?.value,
          this.previewUrl
        );

        this.isUploading = false;
        this.isSuccess = true;

        setTimeout(() => {
          this.uploadSuccessEvent.emit();
          this.closeModal();
        }, 1500);
      } catch (error) {
        this.isUploading = false;
        this.isSuccess = false;
        console.error('Upload error:', error);
      }
    }
  }

  ngOnDestroy() {
    if (this.videoElement) {
      URL.revokeObjectURL(this.videoElement.src);
    }
  }
}
