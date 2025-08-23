export interface MediaFile {
  id: string;
  originalFilename: string;
  publicUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  fileSize: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  position: number;
}

export interface PostAuthor {
  id: string;
  username: string;
  email: string;
  profileImagePath: string | null;
}

export interface Post {
  id: string;
  content: string;
  author: PostAuthor;
  mediaFiles: MediaFile[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
  liked: boolean;
}

export interface PostsResponse {
  status: string;
  message: string;
  success: boolean;
  data: Post[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}

export interface Comment {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
}