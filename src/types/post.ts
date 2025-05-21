export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  author?: string;
  category: "dev" | "diary";
  is_private: boolean;
}
