import { Post } from './post';
import { Tag } from './tag';

// Supabase 쿼리 결과 타입
export interface PostWithTagsRelation extends Post {
  post_tags?: PostTagRelation[];
}

export interface PostTagRelation {
  tags: Tag;
}

// 태그별 포스트 조회 시 사용되는 타입
export interface PostWithInnerTags extends Post {
  post_tags: PostTagRelation[];
}