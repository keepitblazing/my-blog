export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface TagWithCount extends Tag {
  count: number;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
  created_at: string;
}