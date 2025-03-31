import { Injectable } from '@angular/core';
import axios from 'axios';
import { MovieDetail } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: { 'Content-Type': 'application/json' },
  });

  constructor() {}

  async getMovies(): Promise<MovieDetail[]> {
    try {
      const response = await this.api.get<MovieDetail[]>('movie/');
      return response.data;
    } catch (error) {
      console.error('Something went wrong.', error);
      throw error;
    }
  }

  async getMovie(id: string): Promise<MovieDetail> {
    try {
      const response = await this.api.get<MovieDetail>(`movie/${id}`);
      return response.data;
    } catch (error) {
      console.error('Something went wrong.', error);
      throw error;
    }
  }

  async postMovie(
    videoFile: File,
    title: string,
    description: string,
    thumbnail: string
  ): Promise<any> {
    try {
      const thumbnailFile = await this.base64ToFile(
        thumbnail,
        `${title}_thumbnail.jpg`
      );

      const formData = new FormData();
      formData.append('video_file', videoFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('thumbnail', thumbnailFile);

      const response = await this.api.post('movie/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading movie:', error);
      throw error;
    }
  }

  private async base64ToFile(
    base64String: string,
    filename: string
  ): Promise<File> {
    const response = await fetch(base64String);
    const blob = await response.blob();
    return new File([blob], filename, { type: 'image/jpeg' });
  }

  async patchMovie(
    id: string,
    videoFile: File | null | undefined,
    title: string,
    description: string,
    thumbnail?: string
  ): Promise<any> {
    try {
      const formData = new FormData();

      if (videoFile != null && videoFile != undefined) {
        formData.append('video_file', videoFile);
        if (thumbnail) {
          const thumbnailFile = await this.base64ToFile(
            thumbnail,
            `${title}_thumbnail.jpg`
          );
          formData.append('thumbnail', thumbnailFile);
        }
      }

      if (title) {
        formData.append('title', title);
      }

      if (description) {
        formData.append('description', description);
      }

      const response = await this.api.patch(`movie/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  }

  async deleteMovie(id: string): Promise<any> {
    try {
      await this.api.delete(`movie/${id}`);
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  }
}
