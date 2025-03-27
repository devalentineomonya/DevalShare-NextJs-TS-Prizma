// This is a placeholder file for data fetching functions
// In a real application, these would interact with your database

import type { Project, Comment } from "@/lib/types"

// Mock data for development
const mockProjects: Project[] = [
  {
    id: "1",
    title: "AI-Powered Code Assistant",
    description:
      "A VS Code extension that uses AI to help developers write better code faster. It provides intelligent code suggestions, refactoring tips, and documentation assistance.",
    image: "/placeholder.svg?height=400&width=600",
    url: "https://github.com/example/ai-code-assistant",
    published: true,
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
    author: {
      id: "user1",
      name: "Alex Johnson",
      image: null,
    },
    likeCount: 42,
    repostCount: 12,
    commentCount: 8,
    viewCount: 156,
    isLikedByUser: false,
    isRepostedByUser: false,
  },
  {
    id: "2",
    title: "React Component Library",
    description:
      "A comprehensive library of reusable React components with Tailwind CSS styling. Includes form elements, navigation, modals, and more.",
    image: "/placeholder.svg?height=400&width=600",
    url: "https://github.com/example/react-components",
    published: true,
    createdAt: new Date("2023-06-22"),
    updatedAt: new Date("2023-06-22"),
    author: {
      id: "user2",
      name: "Sarah Miller",
      image: null,
    },
    likeCount: 78,
    repostCount: 23,
    commentCount: 15,
    viewCount: 342,
    isLikedByUser: false,
    isRepostedByUser: false,
  },
]

const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "comment1",
      content: "This is amazing! I've been looking for something like this.",
      createdAt: new Date("2023-05-16"),
      author: {
        id: "user3",
        name: "Michael Chen",
        image: null,
      },
    },
    {
      id: "comment2",
      content: "Have you considered adding support for TypeScript?",
      createdAt: new Date("2023-05-17"),
      author: {
        id: "user4",
        name: "Emily Rodriguez",
        image: null,
      },
    },
  ],
}

// Data fetching functions
export async function getProjects(): Promise<Project[]> {
  // In a real app, this would fetch from your database
  return mockProjects
}

export async function getProjectById(id: string): Promise<Project | null> {
  // In a real app, this would fetch from your database
  return mockProjects.find((project) => project.id === id) || null
}

export async function getCommentsByProjectId(projectId: string): Promise<Comment[]> {
  // In a real app, this would fetch from your database
  return mockComments[projectId] || []
}

export async function getSimilarProjects(currentProjectId: string): Promise<Project[]> {
  // In a real app, this would fetch similar projects based on tags, categories, etc.
  return mockProjects.filter((project) => project.id !== currentProjectId).slice(0, 3)
}

