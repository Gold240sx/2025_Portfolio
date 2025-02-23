import type { Media, Post, User } from "../payload-types";

export interface PayloadMedia extends Media {
  url: string;
}

export interface PayloadPost extends Post {
  featuredImage: PayloadMedia;
  author: User;
}

export interface PayloadResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}
