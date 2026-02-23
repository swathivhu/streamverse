import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'trending';
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    console.error('TMDB API key is missing');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  let endpoint = '';
  switch (type) {
    case 'top_rated':
      endpoint = '/movie/top_rated';
      break;
    case 'upcoming':
      endpoint = '/movie/upcoming';
      break;
    case 'trending':
    default:
      endpoint = '/trending/movie/week';
      break;
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=en-US&page=1`
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
