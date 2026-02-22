export interface Movie {
  id: string;
  title: string;
  genre: string;
  thumbnail: string;
}

export const MOVIES: Movie[] = [
  { id: '1', title: 'The Dark Night', genre: 'Action', thumbnail: 'https://picsum.photos/seed/10/400/600' },
  { id: '2', title: 'Interstellar Journey', genre: 'Sci-Fi', thumbnail: 'https://picsum.photos/seed/11/400/600' },
  { id: '3', title: 'Midnight Mystery', genre: 'Thriller', thumbnail: 'https://picsum.photos/seed/12/400/600' },
  { id: '4', title: 'Summer of 69', genre: 'Drama', thumbnail: 'https://picsum.photos/seed/13/400/600' },
  { id: '5', title: 'Space Cowboys', genre: 'Adventure', thumbnail: 'https://picsum.photos/seed/14/400/600' },
  { id: '6', title: 'Robot Dreams', genre: 'Sci-Fi', thumbnail: 'https://picsum.photos/seed/15/400/600' },
  { id: '7', title: 'Ocean Deep', genre: 'Documentary', thumbnail: 'https://picsum.photos/seed/16/400/600' },
  { id: '8', title: 'Lost in Time', genre: 'Fantasy', thumbnail: 'https://picsum.photos/seed/17/400/600' },
  { id: '9', title: 'Red Mars', genre: 'Sci-Fi', thumbnail: 'https://picsum.photos/seed/18/400/600' },
  { id: '10', title: 'Quiet Storm', genre: 'Romance', thumbnail: 'https://picsum.photos/seed/19/400/600' },
];

export const CATEGORIES = [
  { name: 'Trending Now', items: MOVIES.slice(0, 5) },
  { name: 'New Releases', items: MOVIES.slice(5, 10) },
  { name: 'Action & Adventure', items: MOVIES.filter(m => m.genre === 'Action' || m.genre === 'Adventure') },
  { name: 'Sci-Fi Favorites', items: MOVIES.filter(m => m.genre === 'Sci-Fi') },
];