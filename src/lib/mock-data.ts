import { PlaceHolderImages } from './placeholder-images';

export interface Movie {
  id: string;
  title: string;
  genre: string;
  thumbnail: string;
  progress?: number; // Percentage watched (0-100)
}

// Generate unique movie sets from PlaceHolderImages
const trendingImages = PlaceHolderImages.filter(img => img.id.startsWith('m16') || img.id.startsWith('m17') || img.id.startsWith('m18') || img.id.startsWith('m19') || img.id.startsWith('m20'));
const newReleaseImages = PlaceHolderImages.filter(img => img.id.startsWith('m21') || img.id.startsWith('m22') || img.id.startsWith('m23') || img.id.startsWith('m24') || img.id.startsWith('m25'));
const actionImages = PlaceHolderImages.filter(img => img.id.startsWith('m1') || img.id.startsWith('m2') || img.id.startsWith('m3') || img.id.startsWith('m4') || img.id.startsWith('m5'));
const sciFiImages = PlaceHolderImages.filter(img => img.id.startsWith('m6') || img.id.startsWith('m7') || img.id.startsWith('m8') || img.id.startsWith('m9') || img.id.startsWith('m10'));
const dramaImages = PlaceHolderImages.filter(img => img.id.startsWith('m11') || img.id.startsWith('m12') || img.id.startsWith('m13') || img.id.startsWith('m14') || img.id.startsWith('m15'));
const continueWatchingImages = PlaceHolderImages.filter(img => img.id.startsWith('cw'));

export const TRENDING_MOVIES: Movie[] = [
  { id: 't1', title: 'Global Echo', genre: 'Thriller', thumbnail: trendingImages[0]?.imageUrl || '' },
  { id: 't2', title: 'Urban Pulse', genre: 'Drama', thumbnail: trendingImages[1]?.imageUrl || '' },
  { id: 't3', title: 'Light Shift', genre: 'Sci-Fi', thumbnail: trendingImages[2]?.imageUrl || '' },
  { id: 't4', title: 'The Silent Mist', genre: 'Mystery', thumbnail: trendingImages[3]?.imageUrl || '' },
  { id: 't5', title: 'Peak Horizon', genre: 'Adventure', thumbnail: trendingImages[4]?.imageUrl || '' },
];

export const NEW_RELEASES: Movie[] = [
  { id: 'n1', title: 'Neon Streets', genre: 'Action', thumbnail: newReleaseImages[0]?.imageUrl || '' },
  { id: 'n2', title: 'Dune Drifters', genre: 'Sci-Fi', thumbnail: newReleaseImages[1]?.imageUrl || '' },
  { id: 'n3', title: 'Deep Blue', genre: 'Documentary', thumbnail: newReleaseImages[2]?.imageUrl || '' },
  { id: 'n4', title: 'Wild Highlands', genre: 'Nature', thumbnail: newReleaseImages[3]?.imageUrl || '' },
  { id: 'n5', title: 'Frozen Frontier', genre: 'Adventure', thumbnail: newReleaseImages[4]?.imageUrl || '' },
];

export const ACTION_MOVIES: Movie[] = [
  { id: 'a1', title: 'Bullet Protocol', genre: 'Action', thumbnail: actionImages[0]?.imageUrl || '' },
  { id: 'a2', title: 'Chain Reaction', genre: 'Action', thumbnail: actionImages[1]?.imageUrl || '' },
  { id: 'a3', title: 'Midnight Chase', genre: 'Action', thumbnail: actionImages[2]?.imageUrl || '' },
  { id: 'a4', title: 'Iron Vigilante', genre: 'Action', thumbnail: actionImages[3]?.imageUrl || '' },
  { id: 'a5', title: 'Skyline Breach', genre: 'Action', thumbnail: actionImages[4]?.imageUrl || '' },
];

export const SCIFI_MOVIES: Movie[] = [
  { id: 's1', title: 'Stellar Voyager', genre: 'Sci-Fi', thumbnail: sciFiImages[0]?.imageUrl || '' },
  { id: 's2', title: 'Core Protocol', genre: 'Sci-Fi', thumbnail: sciFiImages[1]?.imageUrl || '' },
  { id: 's3', title: 'Neural Network', genre: 'Sci-Fi', thumbnail: sciFiImages[2]?.imageUrl || '' },
  { id: 's4', title: 'Exo Colony', genre: 'Sci-Fi', thumbnail: sciFiImages[3]?.imageUrl || '' },
  { id: 's5', title: 'Digital Ghost', genre: 'Sci-Fi', thumbnail: sciFiImages[4]?.imageUrl || '' },
];

export const CONTINUE_WATCHING: Movie[] = [
  { id: 'cw1', title: 'Chrono Echoes', genre: 'Sci-Fi', thumbnail: continueWatchingImages[0]?.imageUrl || '', progress: 72 },
  { id: 'cw2', title: 'Steel Foundry', genre: 'Action', thumbnail: continueWatchingImages[1]?.imageUrl || '', progress: 45 },
  { id: 'cw3', title: 'The Underpass', genre: 'Thriller', thumbnail: continueWatchingImages[2]?.imageUrl || '', progress: 15 },
];

export const CATEGORIES = [
  { name: 'Trending Now', items: TRENDING_MOVIES },
  { name: 'New Releases', items: NEW_RELEASES },
  { name: 'Action & Adventure', items: ACTION_MOVIES },
  { name: 'Sci-Fi Favorites', items: SCIFI_MOVIES },
];
