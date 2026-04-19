export type Role = "student" | "admin";
export type ReactionType = "love";
export type QuestionType = "midterm" | "final" | "assignment" | "other";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: Role;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  cover_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export type PostSearchResult = Pick<
  Post,
  "id" | "title" | "slug" | "excerpt" | "cover_image" | "created_at"
>;

export interface QuestionBank {
  id: string;
  level: string;
  semester: string;
  course: string;
  type: QuestionType;
  year: number | null;
  file_url: string;
  uploaded_by: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles?: Profile;
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  type: ReactionType;
  created_at: string;
  profiles?: Profile;
}