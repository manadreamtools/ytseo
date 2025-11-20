export interface User {
  username: string;
  password?: string; // Only used internally for auth check
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  dateCreated: string;
}

export interface CRMContact {
  id: string;
  title: string;
  thumbnail: string;
  subs: number;
  seoScore: number;
  status: 'lead' | 'contacted' | 'negotiating' | 'partner';
  email: string;
  notes: string;
  dateAdded: string;
  schedule: Task[];
}

export interface YouTubeChannelSnippet {
  title: string;
  description: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  channelTitle?: string; // Present in search results
}

export interface YouTubeChannelStatistics {
  viewCount: string;
  subscriberCount: string;
  hiddenSubscriberCount: boolean;
  videoCount: string;
}

export interface YouTubeChannel {
  id: string;
  snippet: YouTubeChannelSnippet;
  statistics: YouTubeChannelStatistics;
}

export interface SearchResultItem {
  id: {
    kind: string;
    channelId: string;
  };
  snippet: YouTubeChannelSnippet;
}

export interface Scores {
  seoScore: number;
  titleScore: number;
  engScore: number;
  tagScore: number;
  descScore: number;
}

export interface YouTubeVideoSnippet {
  title: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  publishedAt: string;
}

export interface YouTubeVideoStatistics {
  viewCount: string;
  likeCount?: string;
  commentCount?: string;
}

export interface YouTubeVideo {
  id: string;
  snippet: YouTubeVideoSnippet;
  statistics: YouTubeVideoStatistics;
}