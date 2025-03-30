import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHome, faUpload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  imports: [NgOptimizedImage, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  logo = '/images/logo.png';
  faHome = faHome;
  faUpload = faUpload;
}
