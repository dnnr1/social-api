export interface CreatePostDTO {
  userId: string;
  content: string;
  media: string;
}

export interface CreatePostReponseDTO {
  id: string;
  userId: string;
  content: string;
  media: string;
  visibility?: string;
  created_at: Date;
  updated_at: Date;
}
