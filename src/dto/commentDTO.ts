export interface CreateCommentDTO {
  userId: string;
  postId: string;
  content: string;
}

export interface CreateCommentResponseDTO {
  id: string;
  userId: string;
  postId: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface EditCommentDTO {
  id: string;
  userId: string;
  content?: string;
}

export interface EditCommentResponseDTO extends CreateCommentResponseDTO {}

export interface GetCommentResponseDTO extends CreateCommentResponseDTO {}

export interface GetPostCommentsResponseDTO extends CreateCommentResponseDTO {}
