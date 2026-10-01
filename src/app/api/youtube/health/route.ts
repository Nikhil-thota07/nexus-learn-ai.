import { NextResponse } from 'next/server';
import { checkYouTubeApiHealth } from '@/lib/youtube/service';

export async function GET() {
  const health = await checkYouTubeApiHealth();
  return NextResponse.json(health);
}
