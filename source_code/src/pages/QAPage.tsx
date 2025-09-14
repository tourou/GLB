import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, MessageCircle, Clock, User, ChevronUp, Edit2, Trash2, MoreVertical, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostsStore } from '../store/postsStore';
import { useAuthStore } from '../store/authStore';
import { PostForm } from '../components/PostForm';
import { ImageGallery } from '../components/ImageGallery';
import CommentsSection from '../components/CommentsSection';

export const QAPage: React.FC = () => {
  const { 
    posts, 
    currentPost,
    isLoading, 
    error, 
    selectedCategory, 
    searchTerm, 
    sortBy,
    setSelectedCategory,
    setSearchTerm,
    setSortBy,
    fetchPosts,
    fetchPost,
    likePost,
    deletePost
  } = usePostsStore();
  
  const { user } = useAuthStore();
  
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    setSelectedCategory('qa');
    fetchPosts({ category: 'qa' });
  }, [setSelectedCategory, fetchPosts]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    fetchPosts({ category: 'qa', search: value, sortBy });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    fetchPosts({ category: 'qa', search: searchTerm, sortBy: value });
  };

  const filteredPosts = posts.filter(post => post.category === 'qa');

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setIsPostFormOpen(true);
    setShowDropdown(null);
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('この投稿を削除しますか？')) {
      try {
        await deletePost(postId);
        setShowDropdown(null);
      } catch (error) {
        console.error('Failed to delete post:', error);
      }
    }
  };

  const closePostForm = () => {
    setIsPostFormOpen(false);
    setEditingPost(null);
  };

  const openImageGallery = (images: string[], startIndex: number = 0) => {
    setGalleryImages(images);
    setGalleryStartIndex(startIndex);
    setIsGalleryOpen(true);
  };

  const closeImageGallery = () => {
    setIsGalleryOpen(false);
    setGalleryImages([]);
    setGalleryStartIndex(0);
  };

  const isOwner = (post: any) => {
    // Debug logging to check ownership logic
    console.log('Checking ownership:', {
      hasUser: !!user,
      userInfo: user ? { user_id: user.user_id, display_name: user.display_name } : null,
      postInfo: { user_id: post.user_id, display_name: post.display_name }
    });
    
    return user && post.user_id === user.user_id;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(null);
    };
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDropdown]);

  const handleViewPost = async (postId: number) => {
    setSelectedPostId(postId);
    await fetchPost(postId);
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
  };

  // 投稿詳細表示の場合
  if (selectedPostId && currentPost) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Q&A一覧に戻る
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src={currentPost.photo_url || '/default-avatar.png'}
                alt={currentPost.display_name || 'ユーザー'}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{currentPost.display_name || 'ユーザー'}</p>
                <p className="text-sm text-gray-500">
                  {new Date(currentPost.created_at).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
              Q&A
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{currentPost.title}</h1>
          <div className="prose max-w-none text-gray-700 mb-6">
            <p className="whitespace-pre-wrap">{currentPost.content}</p>
          </div>

          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {currentPost.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {currentPost.comments?.length || 0} 回答
            </span>
            <span className="flex items-center gap-1">
              <ChevronUp className="h-4 w-4" />
              {currentPost.likes} いいね
            </span>
          </div>
        </motion.div>

        {/* コメントセクション */}
        <CommentsSection
          postId={currentPost.id}
          postAuthorId={currentPost.user_id}
          comments={currentPost.comments || []}
          category="qa"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Q&A</h1>
          <p className="mt-1 text-gray-600">
            技術的な質問をして、コミュニティから回答をもらいましょう
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPostFormOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          質問する
        </motion.button>
      </motion.div>

      {/* 検索とフィルター */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="質問や技術タグで検索..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="latest">最新順</option>
              <option value="popular">人気順</option>
              <option value="unanswered">未回答</option>
              <option value="resolved">解決済み</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* ローディング表示 */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">読み込み中...</span>
        </div>
      )}

      {/* 質問一覧 */}
      <div className="space-y-4">
        {!isLoading && filteredPosts.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => handleViewPost(question.id)}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              {/* 投票スコア */}
              <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                <button 
                  onClick={() => likePost(question.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                </button>
                <span className="text-lg font-semibold text-gray-700">
                  {question.likes}
                </span>
                <div className="text-xs text-gray-500">votes</div>
              </div>

              {/* メイン コンテンツ */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {question.status === 'resolved' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      解決済み
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(question.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {question.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {question.content}
                </p>

                {/* 画像プレビュー */}
                {question.images && question.images.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {question.images.slice(0, 3).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => openImageGallery(question.images, index)}
                          className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={image}
                            alt={`投稿画像 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                      {question.images.length > 3 && (
                        <button
                          onClick={() => openImageGallery(question.images, 3)}
                          className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 flex-shrink-0 hover:bg-gray-200 transition-colors"
                        >
                          +{question.images.length - 3}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* タグ */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags && question.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* メタ情報 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{question.comments?.length || 0} 回答</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{question.views} 閲覧</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {question.display_name || 'ユーザー'}
                        </span>
                        <div className="text-gray-500">
                          {question.level || '初心者'}
                        </div>
                      </div>
                    </div>
                    
                    {/* 編集・削除ボタン（投稿者のみ表示） */}
                    {/* DEBUG: Always show for testing - remove after debugging */}
                    {(isOwner(question) || true) && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(showDropdown === question.id ? null : question.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                        
                        <AnimatePresence>
                          {showDropdown === question.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                            >
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditPost(question);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  編集
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePost(question.id);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  削除
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 検索結果が空の場合 */}
      {!isLoading && filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            質問が見つかりませんでした
          </h3>
          <p className="text-gray-600 mb-6">
            検索条件を変更するか、新しい質問を投稿してみてください
          </p>
          <button 
            onClick={() => setIsPostFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            質問を投稿
          </button>
        </motion.div>
      )}
      
      {/* 投稿フォーム */}
      <AnimatePresence>
        {isPostFormOpen && (
          <PostForm
            isOpen={isPostFormOpen}
            onClose={closePostForm}
            editPost={editingPost}
          />
        )}
      </AnimatePresence>

      {/* 画像ギャラリー */}
      <ImageGallery
        images={galleryImages}
        isOpen={isGalleryOpen}
        onClose={closeImageGallery}
        initialIndex={galleryStartIndex}
      />
    </div>
  );
};