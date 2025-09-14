import React, { useState, useEffect } from 'react';
import { Search, Award, Heart, Eye, ExternalLink, Github, User, Star, Plus, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePostsStore } from '../store/postsStore';
import { useAuthStore } from '../store/authStore';
import { PostForm } from '../components/PostForm';
import { ImageGallery } from '../components/ImageGallery';

export const ShowcasePage: React.FC = () => {
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
    setSelectedCategory('showcase');
    fetchPosts({ category: 'showcase' });
  }, [setSelectedCategory, fetchPosts]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    fetchPosts({ category: 'showcase', search: value, sortBy });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    fetchPosts({ category: 'showcase', search: searchTerm, sortBy: value });
  };

  const filteredPosts = posts.filter(post => post.category === 'showcase');

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setIsPostFormOpen(true);
    setShowDropdown(null);
  };

  const handleDeletePost = async (postId: number) => {
    if (window.confirm('この作品を削除しますか？')) {
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
          <h1 className="text-2xl font-bold text-gray-900">Showcase</h1>
          <p className="mt-1 text-gray-600">
            素晴らしい作品を発見し、あなたの作品を世界に共有しましょう
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsPostFormOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          作品を投稿
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
                placeholder="作品やテクノロジーで検索..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">読み込み中...</span>
        </div>
      )}

      {/* 作品一覧 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {!isLoading && filteredPosts.map((showcase, index) => (
          <motion.div
            key={showcase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            {/* サムネイル */}
            <div className="relative h-48">
              {showcase.images && showcase.images.length > 0 ? (
                <img
                  src={showcase.images[0]}
                  alt={showcase.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500 flex items-center justify-center">
                  <Award className="h-16 w-16 text-white opacity-60" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300" />
              
              {/* ホバー時のアクションボタン */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                {showcase.project_url && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.open(showcase.project_url, '_blank')}
                    className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <ExternalLink className="h-4 w-4 text-gray-700" />
                  </motion.button>
                )}
                {showcase.images && showcase.images.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => openImageGallery(showcase.images, 0)}
                    className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                  >
                    <Eye className="h-4 w-4 text-gray-700" />
                  </motion.button>
                )}
              </div>

              {/* 編集・削除ボタン（投稿者のみ表示） */}
              {isOwner(showcase) && (
                <div className="absolute top-4 left-4">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDropdown(showDropdown === showcase.id ? null : showcase.id);
                      }}
                      className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-700" />
                    </button>
                    
                    <AnimatePresence>
                      {showDropdown === showcase.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                        >
                          <div className="py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPost(showcase);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              編集
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePost(showcase.id);
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
                </div>
              )}
            </div>

            {/* コンテンツ */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">
                  {new Date(showcase.created_at).toLocaleDateString('ja-JP')}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                {showcase.title}
              </h3>

              <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                {showcase.content}
              </p>

              {/* タグ */}
              <div className="flex flex-wrap gap-2 mb-4">
                {showcase.tags && showcase.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* プロジェクトURL */}
              {showcase.project_url && (
                <div className="mb-4">
                  <a
                    href={showcase.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    プロジェクトを見る
                  </a>
                </div>
              )}

              {/* フッター */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <button
                    onClick={() => likePost(showcase.id)}
                    className="flex items-center space-x-1 hover:text-purple-600 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{showcase.likes}</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{showcase.views}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">
                      {showcase.display_name || 'ユーザー'}
                    </span>
                    <div className="text-gray-500">
                      {showcase.level || '初心者'}
                    </div>
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
          <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            作品が見つかりませんでした
          </h3>
          <p className="text-gray-600 mb-6">
            検索条件を変更するか、あなたの素晴らしい作品を投稿してみてください
          </p>
          <button 
            onClick={() => setIsPostFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            作品を投稿
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
            defaultCategory="showcase"
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