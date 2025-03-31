import { Routes } from '@angular/router';
import { EditPageComponent } from './edit/edit.component';
import { HomePageComponent } from './home/home.component';
import { NotFoundPageComponent } from './not-found/not-found.component';
import { UploadPageComponent } from './upload/upload.component';
import { WatchPageComponent } from './watch/watch.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'watch/:id', component: WatchPageComponent },
  { path: 'edit/:id', component: EditPageComponent },
  { path: 'upload', component: UploadPageComponent },
  { path: '**', component: NotFoundPageComponent },
];
