export interface User {
  id: string
  name: string
  email: string
  image?: string | null
  role: "USER" | "ADMIN"
  createdAt: Date
}

export interface Project {
  id: string
  title: string
  description: string
  image: string | null
  url: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
  author: {
    id: string
    name: string
    image: string | null
  }
  likeCount: number
  repostCount: number
  commentCount: number
  viewCount: number
  isLikedByUser: boolean
  isRepostedByUser: boolean
}

export interface Comment {
  id: string
  content: string
  createdAt: Date
  author: {
    id: string
    name: string
    image: string | null
  }
}

export interface Message {
  id: string
  content: string
  createdAt: Date
  read: boolean
  sender: {
    id: string
    name: string
    image: string | null
  }
  recipient: {
    id: string
    name: string
    image: string | null
  }
}

