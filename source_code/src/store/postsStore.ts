import { create } from 'zustand';

interface Post {
  id: number;
  user_id: string;
  category: 'qa' | 'howto' | 'showcase';
  title: string;
  content: string;
  tags: string[] | null;
  images: string[] | null;
  project_url?: string | null;
  status: 'published' | 'draft' | 'resolved';
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
  display_name?: string;
  photo_url?: string;
  level?: string;
  comments?: Comment[];
}

interface Comment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  is_best_answer: number;
  likes: number;
  created_at: string;
  display_name?: string;
  photo_url?: string;
  level?: string;
}

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  selectedCategory: string;
  searchTerm: string;
  sortBy: string;
  
  // Actions
  setPosts: (posts: Post[]) => void;
  setCurrentPost: (post: Post | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: string) => void;
  
  // API calls
  fetchPosts: (filters?: any) => Promise<void>;
  fetchPost: (id: number) => Promise<void>;
  createPost: (postData: any) => Promise<number>;
  updatePost: (id: number, postData: any) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  likePost: (id: number) => Promise<void>;
  
  // Comment API calls
  createComment: (postId: number, content: string) => Promise<Comment>;
  updateComment: (commentId: number, content: string) => Promise<void>;
  deleteComment: (commentId: number) => Promise<void>;
  likeComment: (commentId: number) => Promise<void>;
  markBestAnswer: (commentId: number, postId: number) => Promise<void>;
}

const API_BASE_URL = 'https://backend.youware.com';

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,
  
  selectedCategory: 'all',
  searchTerm: '',
  sortBy: 'latest',

  setPosts: (posts) => set({ posts }),
  setCurrentPost: (post) => set({ currentPost: post }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSortBy: (sort) => set({ sortBy: sort }),

  fetchPosts: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const params = new URLSearchParams();
      
      const { selectedCategory, searchTerm, sortBy } = get();
      
      if (filters.category || (selectedCategory && selectedCategory !== 'all')) {
        params.append('category', filters.category || selectedCategory);
      }
      
      if (filters.search || searchTerm) {
        params.append('search', filters.search || searchTerm);
      }
      
      if (filters.sortBy || sortBy) {
        params.append('sortBy', filters.sortBy || sortBy);
      }
      
      if (filters.limit) {
        params.append('limit', filters.limit.toString());
      }
      
      if (filters.offset) {
        params.append('offset', filters.offset.toString());
      }

      const response = await fetch(`${API_BASE_URL}/api/posts?${params}`);
      
      if (response.ok) {
        const posts = await response.json();
        
        // Parse tags and images from JSON string
        const postsWithParsedData = posts.map((post: any) => ({
          ...post,
          tags: post.tags ? JSON.parse(post.tags) : [],
          images: post.images ? JSON.parse(post.images) : []
        }));
        
        set({ posts: postsWithParsedData, isLoading: false });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '投稿の取得に失敗しました');
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      set({ 
        error: error instanceof Error ? error.message : '投稿の取得に失敗しました',
        isLoading: false 
      });
    }
  },

  fetchPost: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
      
      if (response.ok) {
        const post = await response.json();
        
        // Parse tags and images from JSON string
        const postWithParsedData = {
          ...post,
          tags: post.tags ? JSON.parse(post.tags) : [],
          images: post.images ? JSON.parse(post.images) : []
        };
        
        set({ currentPost: postWithParsedData, isLoading: false });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '投稿の取得に失敗しました');
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      set({ 
        error: error instanceof Error ? error.message : '投稿の取得に失敗しました',
        isLoading: false 
      });
    }
  },

  createPost: async (postData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Refresh posts list
        await get().fetchPosts();
        
        set({ isLoading: false });
        return result.postId;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '投稿の作成に失敗しました');
      }
    } catch (error) {
      console.error('Failed to create post:', error);
      set({ 
        error: error instanceof Error ? error.message : '投稿の作成に失敗しました',
        isLoading: false 
      });
      throw error;
    }
  },

  updatePost: async (id: number, postData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        // Refresh posts list and current post
        await Promise.all([
          get().fetchPosts(),
          get().fetchPost(id)
        ]);
        
        set({ isLoading: false });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '投稿の更新に失敗しました');
      }
    } catch (error) {
      console.error('Failed to update post:', error);
      set({ 
        error: error instanceof Error ? error.message : '投稿の更新に失敗しました',
        isLoading: false 
      });
      throw error;
    }
  },

  deletePost: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from posts list and clear current post if it's the deleted one
        const { posts, currentPost } = get();
        const updatedPosts = posts.filter(post => post.id !== id);
        
        set({ 
          posts: updatedPosts,
          currentPost: currentPost?.id === id ? null : currentPost,
          isLoading: false 
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '投稿の削除に失敗しました');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      set({ 
        error: error instanceof Error ? error.message : '投稿の削除に失敗しました',
        isLoading: false 
      });
      throw error;
    }
  },

  likePost: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/posts/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId: id }),
      });

      if (response.ok) {
        // Update likes count in local state
        const { posts, currentPost } = get();
        
        const updatedPosts = posts.map(post => 
          post.id === id ? { ...post, likes: post.likes + 1 } : post
        );
        
        const updatedCurrentPost = currentPost?.id === id 
          ? { ...currentPost, likes: currentPost.likes + 1 }
          : currentPost;
        
        set({ 
          posts: updatedPosts,
          currentPost: updatedCurrentPost
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'いいねに失敗しました');
      }
    } catch (error) {
      console.error('Failed to like post:', error);
      set({ error: error instanceof Error ? error.message : 'いいねに失敗しました' });
    }
  },

  createComment: async (postId: number, content: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post_id: postId, content }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update current post with new comment if it's the same post
        const { currentPost } = get();
        if (currentPost && currentPost.id === postId) {
          const updatedPost = {
            ...currentPost,
            comments: [...(currentPost.comments || []), result.comment]
          };
          set({ currentPost: updatedPost });
        }
        
        return result.comment;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'コメントの投稿に失敗しました');
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
      set({ error: error instanceof Error ? error.message : 'コメントの投稿に失敗しました' });
      throw error;
    }
  },

  updateComment: async (commentId: number, content: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        // Update comment in current post
        const { currentPost } = get();
        if (currentPost && currentPost.comments) {
          const updatedComments = currentPost.comments.map(comment =>
            comment.id === commentId ? { ...comment, content } : comment
          );
          set({ 
            currentPost: { ...currentPost, comments: updatedComments }
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'コメントの更新に失敗しました');
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
      set({ error: error instanceof Error ? error.message : 'コメントの更新に失敗しました' });
      throw error;
    }
  },

  deleteComment: async (commentId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove comment from current post
        const { currentPost } = get();
        if (currentPost && currentPost.comments) {
          const updatedComments = currentPost.comments.filter(comment => comment.id !== commentId);
          set({ 
            currentPost: { ...currentPost, comments: updatedComments }
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'コメントの削除に失敗しました');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      set({ error: error instanceof Error ? error.message : 'コメントの削除に失敗しました' });
      throw error;
    }
  },

  likeComment: async (commentId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });

      if (response.ok) {
        // Update likes count in current post
        const { currentPost } = get();
        if (currentPost && currentPost.comments) {
          const updatedComments = currentPost.comments.map(comment =>
            comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
          );
          set({ 
            currentPost: { ...currentPost, comments: updatedComments }
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'コメントのいいねに失敗しました');
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
      set({ error: error instanceof Error ? error.message : 'コメントのいいねに失敗しました' });
    }
  },

  markBestAnswer: async (commentId: number, postId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/comments/best-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, postId }),
      });

      if (response.ok) {
        // Update best answer status in current post
        const { currentPost } = get();
        if (currentPost && currentPost.comments) {
          const updatedComments = currentPost.comments.map(comment => ({
            ...comment,
            is_best_answer: comment.id === commentId ? 1 : 0
          }));
          set({ 
            currentPost: { ...currentPost, comments: updatedComments }
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ベストアンサーの選択に失敗しました');
      }
    } catch (error) {
      console.error('Failed to mark best answer:', error);
      set({ error: error instanceof Error ? error.message : 'ベストアンサーの選択に失敗しました' });
      throw error;
    }
  },
}));