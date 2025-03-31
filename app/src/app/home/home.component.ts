import { Component } from '@angular/core';
import { HeroComponent } from '../components/hero/hero.component';
import { MoviesComponent } from '../components/movies/movies.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, MoviesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
