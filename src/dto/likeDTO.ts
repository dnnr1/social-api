export interface LikeDTO {
  userId: string;
  postId: string;
}

export interface LikeResponseDTO {
  userId: string;
  postId: string;
  created_at: Date;
}

export interface GetPostLikesResponseDTO extends LikeResponseDTO {}
