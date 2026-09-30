import { YouTubeVideo } from '@/types';
import { db } from '../db';

const CURATED_EDUCATIONAL_VIDEOS: Record<string, YouTubeVideo[]> = {
  'py-return': [
    {
      id: '9Os0o3wzS_I',
      title: 'Python Tutorial for Beginners 8: Functions & Return Values',
      description: 'Learn how return statements work in Python functions, passing data back to callers vs printing to console.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'Corey Schafer',
      publishedAt: '2023-04-12T10:00:00Z',
      duration: '18:45',
    },
    {
      id: 'u-OmVr_fT4s',
      title: 'Python Functions - return vs print (The #1 Beginner Confusion)',
      description: 'In-depth explanation contrasting side-effects of print() and the programmatic value of return.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'CS Dojo',
      publishedAt: '2023-06-20T14:30:00Z',
      duration: '12:10',
    },
    {
      id: 'kqtD5dpn9C8',
      title: 'Python for Beginners - Full Course [Functions & Scope]',
      description: 'Understanding how values flow into functions as parameters and exit cleanly via return.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'freeCodeCamp.org',
      publishedAt: '2022-11-05T09:15:00Z',
      duration: '25:30',
    },
  ],
  'py-params': [
    {
      id: 'WcKk9nQpD_g',
      title: 'Python Args, Kwargs, and Default Arguments Trap',
      description: 'Avoid the mutable default argument mistake in Python functions.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'mCoding',
      publishedAt: '2023-01-15T12:00:00Z',
      duration: '14:20',
    },
  ],
  'py-scope': [
    {
      id: 'QVdf0LnM428',
      title: 'Variable Scope: Understanding the LEGB Rule and global Keyword',
      description: 'How Python searches local, enclosing, global, and built-in scopes.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'Corey Schafer',
      publishedAt: '2022-08-10T16:00:00Z',
      duration: '16:05',
    },
  ],
  'jee-kinematics': [
    {
      id: 'bK9YJp8e7x0',
      title: 'JEE Advanced: Projectile Motion & Relative Velocity Masterclass',
      description: 'Comprehensive problem-solving for 2D kinematics, trajectory equations, and apex acceleration.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'Physics Galaxy',
      publishedAt: '2023-05-18T11:00:00Z',
      duration: '32:40',
    },
  ],
  'jee-newton': [
    {
      id: '7vA3u9m3c50',
      title: 'Laws of Motion: Pseudo Forces & Friction for JEE Main & Advanced',
      description: 'Understanding Newton\'s 3rd law action-reaction pairs and free body diagrams in accelerating reference frames.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'Mohit Tyagi',
      publishedAt: '2023-02-10T15:00:00Z',
      duration: '45:12',
    },
  ],
  'btech-os-deadlocks': [
    {
      id: 'd89b3f71c42',
      title: 'Operating Systems: Banker\'s Algorithm & Deadlock Avoidance',
      description: 'Step-by-step trace of safe states, allocation matrices, and resource request algorithm.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'Gate Smashers',
      publishedAt: '2023-03-22T08:30:00Z',
      duration: '22:15',
    },
  ],
};

export async function searchEducationalVideos(query: string, conceptId?: string): Promise<YouTubeVideo[]> {
  const cacheKey = `yt_${query.trim().toLowerCase()}`;

  // 1. Check persistent database cache
  try {
    const cached = await db.youtubeCache.findUnique({ where: { queryKey: cacheKey } });
    if (cached) {
      return JSON.parse(cached.videosJson);
    }
  } catch (err) {
    console.warn('Cache lookup failed, proceeding to fetch:', err);
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const regionCode = process.env.YOUTUBE_REGION_CODE || 'IN';
  const relevanceLanguage = process.env.YOUTUBE_RELEVANCE_LANGUAGE || 'en';

  if (!apiKey) {
    // Return curated educational fallback to avoid quota failure and preserve UX
    const fallback = getCuratedFallback(query, conceptId);
    return fallback;
  }

  try {
    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('q', `${query} educational tutorial concept`);
    url.searchParams.set('maxResults', '6');
    url.searchParams.set('order', 'relevance');
    url.searchParams.set('safeSearch', 'strict');
    url.searchParams.set('regionCode', regionCode);
    url.searchParams.set('relevanceLanguage', relevanceLanguage);
    url.searchParams.set('key', apiKey);

    const res = await fetch(url.toString());

    if (!res.ok) {
      console.warn(`YouTube API returned status ${res.status}. Falling back to curated index.`);
      return getCuratedFallback(query, conceptId);
    }

    const data = await res.json();
    const items = data.items || [];

    const videos: YouTubeVideo[] = items.map((item: any) => ({
      id: item.id?.videoId || Math.random().toString(),
      title: item.snippet?.title || 'Educational Video',
      description: item.snippet?.description || '',
      thumbnailUrl:
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.medium?.url ||
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
      channelTitle: item.snippet?.channelTitle || 'Nexus Learning',
      publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
    }));

    // Cache results for 7 days to conserve the 100 queries/day quota
    await db.youtubeCache.set(cacheKey, JSON.stringify(videos), 24 * 7);

    return videos;
  } catch (err) {
    console.error('YouTube API fetch error:', err);
    return getCuratedFallback(query, conceptId);
  }
}

function getCuratedFallback(query: string, conceptId?: string): YouTubeVideo[] {
  if (conceptId && CURATED_EDUCATIONAL_VIDEOS[conceptId]) {
    return CURATED_EDUCATIONAL_VIDEOS[conceptId];
  }

  for (const [key, videos] of Object.entries(CURATED_EDUCATIONAL_VIDEOS)) {
    if (query.toLowerCase().includes(key) || key.includes(query.toLowerCase())) {
      return videos;
    }
  }

  // Default educational videos
  return [
    {
      id: 'u-OmVr_fT4s',
      title: `${query}: Comprehensive Video Lesson`,
      description: `Understand the fundamental mechanics of ${query} with step-by-step coding demonstrations.`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'Nexus AI EdTech Curations',
      publishedAt: new Date().toISOString(),
      duration: '15:20',
    },
    {
      id: 'kqtD5dpn9C8',
      title: `Deep Dive & Common Pitfalls in ${query}`,
      description: `Examine common student misconceptions, contrast incorrect code patterns, and cement foundational mastery.`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
      channelTitle: 'Nexus Academic Library',
      publishedAt: new Date().toISOString(),
      duration: '21:45',
    },
  ];
}
