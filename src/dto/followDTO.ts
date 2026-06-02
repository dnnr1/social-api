export interface FollowDTO {
  followerId: string;
  followingId: string;
}

export interface FollowResponseDTO {
  followerId: string;
  followingId: string;
  created_at: Date;
}

export interface GetFollowersResponseDTO extends FollowResponseDTO {}

export interface GetFollowingResponseDTO extends FollowResponseDTO {}
