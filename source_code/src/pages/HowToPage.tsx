import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Clock, User, Eye, Heart, Bookmark, Plus, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostsStore } from '../store/postsStore';
import { useAuthStore } from '../store/authStore';
import { PostForm } from '../components/PostForm';
import { ImageGallery } from '../components/ImageGallery';

export const HowToPage: React.FC = () => {
  const { 
    posts, 
    isLoading, 
    error, 
    selectedCategory, 
    searchTerm, 
    sortBy,
    setSelectedCategory,
    setSearchTerm,
    setSortBy,
    fetchPosts,
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

  useEffect(() => {
    setSelectedCategory('howto');
    fetchPosts({ category: 'howto' });
  }, [setSelectedCategory, fetchPosts]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    fetchPosts({ category: 'howto', search: value, sortBy });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    fetchPosts({ category: 'howto', search: searchTerm, sortBy: value });
  };

  const filteredPosts = posts.filter(post => post.category === 'howto');

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



  return (
    <div className="space-y-6">
      {/* ページヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">How-To ガイド</h1>
          <p className="mt-1 text-gray-600">
            実践的なチュートリアルとTipsを発見・共有しましょう
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPostFormOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          ガイドを投稿
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
                placeholder="ガイドやトピックで検索..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="latest">最新順</option>
              <option value="popular">人気順</option>
              <option value="views">閲覧数順</option>
            </select>
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">読み込み中...</span>
        </div>
      )}

      {/* ガイド一覧 */}
      <div className="space-y-4">
        {!isLoading && filteredPosts.map((guide, index) => (
          <motion.div
            key={guide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              {/* アイコン */}
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>

              {/* メイン コンテンツ */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-500">
                    {new Date(guide.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {guide.title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {guide.content}
                </p>

                {/* 画像プレビュー */}
                {guide.images && guide.images.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {guide.images.slice(0, 3).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => openImageGallery(guide.images, index)}
                          className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={image}
                            alt={`ガイド画像 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                      {guide.images.length > 3 && (
                        <button
                          onClick={() => openImageGallery(guide.images, 3)}
                          className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500 flex-shrink-0 hover:bg-gray-200 transition-colors"
                        >
                          +{guide.images.length - 3}
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* タグ */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {guide.tags && guide.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* メタ情報 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{guide.views} 閲覧</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{guide.likes} いいね</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">
                          {guide.display_name || 'ユーザー'}
                        </span>
                        <div className="text-gray-500">
                          {guide.level || '初心者'}
                        </div>
                      </div>
                    </div>
                    
                    {/* 編集・削除ボタン（投稿者のみ表示） */}
                    {isOwner(guide) && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(showDropdown === guide.id ? null : guide.id);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>
                        
                        <AnimatePresence>
                          {showDropdown === guide.id && (
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
                                    handleEditPost(guide);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  編集
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeletePost(guide.id);
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
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ガイドが見つかりませんでした
          </h3>
          <p className="text-gray-600 mb-6">
            検索条件を変更するか、新しいガイドを投稿してみてください
          </p>
          <button 
            onClick={() => setIsPostFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            ガイドを投稿
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
            defaultCategory="howto"
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