// API client for making requests to our backend

// Content generation
export async function generateContent(data: {
  prompt: string
  platform?: string
  theme?: string
}) {
  const response = await fetch("/api/content/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to generate content")
  }

  return response.json()
}

// Account analysis
export async function analyzeAccount(data: {
  accountUrl: string
  platform?: string
}) {
  const response = await fetch("/api/account-analyst", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to analyze account")
  }

  return response.json()
}

// Posts
export async function getPosts(params?: {
  status?: string
  platform?: string
  limit?: number
  offset?: number
}) {
  const searchParams = new URLSearchParams()

  if (params?.status) searchParams.append("status", params.status)
  if (params?.platform) searchParams.append("platform", params.platform)
  if (params?.limit) searchParams.append("limit", params.limit.toString())
  if (params?.offset) searchParams.append("offset", params.offset.toString())

  const response = await fetch(`/api/posts?${searchParams.toString()}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch posts")
  }

  return response.json()
}

export async function createPost(data: {
  content: string
  platform: string
  scheduledFor?: string
  image?: string
}) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create post")
  }

  return response.json()
}

export async function getPost(id: string) {
  const response = await fetch(`/api/posts/${id}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch post")
  }

  return response.json()
}

export async function updatePost(
  id: string,
  data: {
    content?: string
    platform?: string
    scheduledFor?: string | null
    publishedAt?: string | null
    image?: string | null
    status?: "draft" | "scheduled" | "published" | "failed"
  },
) {
  const response = await fetch(`/api/posts/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update post")
  }

  return response.json()
}

export async function deletePost(id: string) {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete post")
  }

  return response.json()
}

// Analytics
export async function getAnalytics(params?: {
  startDate?: string
  endDate?: string
  platforms?: string[]
}) {
  const searchParams = new URLSearchParams()

  if (params?.startDate) searchParams.append("startDate", params.startDate)
  if (params?.endDate) searchParams.append("endDate", params.endDate)
  if (params?.platforms) searchParams.append("platforms", params.platforms.join(","))

  const response = await fetch(`/api/analytics?${searchParams.toString()}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch analytics")
  }

  return response.json()
}

// Profile
export async function getProfile() {
  const response = await fetch("/api/profile")

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch profile")
  }

  return response.json()
}

export async function updateProfile(data: {
  name?: string
  company?: string | null
  bio?: string | null
}) {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update profile")
  }

  return response.json()
}

export async function updateBrandProfile(data: {
  brandVoice?: string
  vocabulary?: string[]
}) {
  const response = await fetch("/api/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update brand profile")
  }

  return response.json()
}

export async function generateBrandProfile(data: {
  contentSamples: string[]
}) {
  const response = await fetch("/api/brand-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to generate brand profile")
  }

  return response.json()
}
