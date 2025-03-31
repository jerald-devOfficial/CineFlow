import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
})
export class DeleteModalComponent {
  @Input() title: string = '';
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();

  faTrash = faTrash;
  faSpinner = faSpinner;
  faCheck = faCheck;

  isDeleting = false;
  isDeleteSuccess = false;

  async onConfirmDelete(): Promise<void> {
    this.isDeleting = true;
    this.confirmDelete.emit();

    // Show success state
    this.isDeleting = false;
    this.isDeleteSuccess = true;
  }

  onCancel(): void {
    this.cancelDelete.emit();
  }
}
