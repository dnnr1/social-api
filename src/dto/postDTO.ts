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

export interface EditPostDTO {
  id: string;
  userId: string;
  visibility?: string;
  content?: string;
  media?: string;
}

export interface EditPostResponseDTO extends CreatePostReponseDTO {}

export interface GetAllPostsResponseDTO extends CreatePostReponseDTO {}

export interface GetPostResponseDTO extends CreatePostReponseDTO {}
