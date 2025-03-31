export interface MovieDetail {
  id: number;
  title: string;
  description: string;
  created_date: string;
  video_file: string;
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

export interface Movie {
  title: string;
  video_file: string;
  description: string;
}
