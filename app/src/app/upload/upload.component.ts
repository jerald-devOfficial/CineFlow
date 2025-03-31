import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadPageComponent {
  faSpinner = faSpinner;
  faCheck = faCheck;
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isUploading = false;
  previewUrl: string | null = null;
  videoElement: HTMLVideoElement | null = null;
  isSuccess = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    });
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
          this.router.navigate(['/']);
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
