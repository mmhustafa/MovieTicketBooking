export interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  year: number;
  posterUrl: string;
  status: 'NowShowing' | 'ComingSoon';
}