import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const movieId = searchParams.get('movieId');

  if (!movieId) {
    return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    console.error('TMDB API key is missing');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`
    );

    if (!res.ok) {
      // Some titles might be TV shows or have different endpoints, but for this MVP we focus on movies
      return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: res.status });
    }

    const data = await res.json();
    
    // Find the first video that is a "Trailer" on "YouTube"
    const trailer = data.results?.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    );

    return NextResponse.json({ trailerKey: trailer?.key || null });
  } catch (error) {
    console.error('Trailer API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
