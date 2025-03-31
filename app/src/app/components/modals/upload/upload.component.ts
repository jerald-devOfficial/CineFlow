import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
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
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isUploading = false;
  previewUrl: string | null = null;
  videoElement: HTMLVideoElement | null = null;

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
    // Clean up previous video element if it exists
    if (this.videoElement) {
      URL.revokeObjectURL(this.videoElement.src);
    }

    // Create new video element
    this.videoElement = document.createElement('video');
    this.videoElement.preload = 'metadata';
    this.videoElement.playsInline = true;
    this.videoElement.muted = true;

    // Create object URL
    const objectUrl = URL.createObjectURL(file);
    this.videoElement.src = objectUrl;

    this.videoElement.onloadeddata = () => {
      // Try to play for a brief moment to ensure frame is loaded
      this.videoElement
        ?.play()
        .then(() => {
          setTimeout(() => {
            if (this.videoElement) {
              // Pause the video
              this.videoElement.pause();

              // Create canvas and draw the frame
              const canvas = document.createElement('canvas');
              canvas.width = 218;
              canvas.height = 123;

              const ctx = canvas.getContext('2d');
              if (ctx && this.videoElement) {
                ctx.drawImage(
                  this.videoElement,
                  0,
                  0,
                  canvas.width,
                  canvas.height
                );
                this.previewUrl = canvas.toDataURL('image/jpeg', 0.8);
              }
            }
          }, 1000); // Wait for 1 second to ensure frame is loaded
        })
        .catch((error) => {
          console.error('Error generating preview:', error);
          // Fallback preview
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
        this.uploadSuccessEvent.emit();
        this.closeModal();
      } catch (error) {
        this.isUploading = false;
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
