import { createServiceClient } from '../supabase/service';

export interface SearchParams {
  query: string;
  type?: 'video' | 'image' | 'audio' | 'document' | 'text' | 'all';
  category?: string;
  limit?: number;
  offset?: number;
}

export async function searchContent(params: SearchParams) {
  const supabase = createServiceClient();
  const limit = params.limit || 20;
  const offset = params.offset || 0;

  let queryBuilder = supabase
    .from('contents')
    .select(`
      id,
      type,
      title,
      description,
      category,
      view_count,
      like_count,
      comment_count,
      created_at,
      published_at,
      profiles:user_id (
        id,
        username,
        display_name,
        avatar_url,
        is_verified
      ),
      content_assets (
        id,
        storage_provider,
        storage_key,
        thumbnail_key,
        duration_seconds,
        width,
        height
      )
    `)
    .eq('status', 'published')
    .eq('visibility', 'public')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (params.query) {
    queryBuilder = queryBuilder.textSearch('search_vector', params.query, {
      type: 'websearch',
      config: 'english',
    });
  }

  if (params.type && params.type !== 'all') {
    queryBuilder = queryBuilder.eq('type', params.type);
  }

  if (params.category && params.category !== 'All') {
    queryBuilder = queryBuilder.eq('category', params.category);
  }

  const { data, error } = await queryBuilder;
  if (error) {
    console.error('[SearchService] Error performing search:', error);
    return [];
  }

  return data || [];
}