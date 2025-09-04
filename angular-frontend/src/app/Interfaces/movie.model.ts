export interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  year: number;
  posterUrl: string;
  overview :string;
  status: 'NowShowing' | 'ComingSoon';
}