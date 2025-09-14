import React, { useState, useEffect } from 'react';
import { X, Plus, Hash, Upload, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePostsStore } from '../store/postsStore';
import { useAuthStore } from '../store/authStore';

interface PostFormProps {
  isOpen: boolean;
  onClose: () => void;
  editPost?: any;
  defaultCategory?: 'qa' | 'howto' | 'showcase';
}

export const PostForm: React.FC<PostFormProps> = ({ 
  isOpen, 
  onClose, 
  editPost,
  defaultCategory = 'qa'
}) => {
  const { createPost, updatePost, isLoading } = usePostsStore();
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    category: editPost?.category || defaultCategory,
    title: editPost?.title || '',
    content: editPost?.content || '',
    tags: editPost?.tags || [],
    images: editPost?.images || [],
    project_url: editPost?.project_url || ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  // Reset form when editPost changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        category: editPost?.category || defaultCategory,
        title: editPost?.title || '',
        content: editPost?.content || '',
        tags: editPost?.tags || [],
        images: editPost?.images || [],
        project_url: editPost?.project_url || ''
      });
      setError('');
    }
  }, [isOpen, editPost, defaultCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('ログインが必要です');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('タイトルと内容は必須です');
      return;
    }

    try {
      if (editPost) {
        await updatePost(editPost.id, formData);
      } else {
        await createPost(formData);
      }
      
      // Reset form and close
      setFormData({
        category: 'qa',
        title: '',
        content: '',
        tags: [],
        images: []
      });
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : '投稿に失敗しました');
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      category: 'qa',
      title: '',
      content: '',
      tags: [],
      images: []
    });
    setError('');
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError('');

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} は画像ファイルではありません`);
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} のファイルサイズが大きすぎます (最大5MB)`);
        }

        // Convert to base64 for preview (in real app, upload to cloud storage)
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error(`${file.name} の読み込みに失敗しました`));
          reader.readAsDataURL(file);
        });
      });

      const imageUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls]
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : '画像のアップロードに失敗しました');
    } finally {
      setUploadingImages(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const getCategoryInfo = () => {
    switch (formData.category) {
      case 'qa':
        return {
          name: 'Q&A',
          description: '技術的な質問や疑問を投稿',
          placeholder: '何について質問したいですか？',
          contentPlaceholder: '問題の詳細、試したこと、期待する結果などを具体的に記述してください...'
        };
      case 'howto':
        return {
          name: 'How-To',
          description: '実践的なガイドやチュートリアルを投稿',
          placeholder: 'どのようなガイドを作成しますか？',
          contentPlaceholder: 'ステップバイステップの手順、コード例、注意点などを詳しく記述してください...'
        };
      case 'showcase':
        return {
          name: 'Showcase',
          description: '自分の作品やプロジェクトを紹介',
          placeholder: 'どのような作品を紹介しますか？',
          contentPlaceholder: '作品の概要、使用技術、開発背景、工夫した点などを詳しく説明してください...'
        };
      default:
        return {
          name: 'Q&A',
          description: '技術的な質問や疑問を投稿',
          placeholder: '何について質問したいですか？',
          contentPlaceholder: '問題の詳細、試したこと、期待する結果などを具体的に記述してください...'
        };
    }
  };

  if (!isOpen) return null;

  const categoryInfo = getCategoryInfo();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editPost ? `${categoryInfo.name}を編集` : `${categoryInfo.name}を投稿`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {categoryInfo.description}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タイトル
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={categoryInfo.placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              内容
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder={categoryInfo.contentPlaceholder}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Project URL (Showcase only) */}
          {formData.category === 'showcase' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロジェクトURL (任意)
              </label>
              <input
                type="url"
                value={formData.project_url}
                onChange={(e) => setFormData(prev => ({ ...prev, project_url: e.target.value }))}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                デモサイト、GitHubリポジトリ、ライブ版などのURLを入力してください
              </p>
            </div>
          )}

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              画像 (任意)
            </label>
            
            {/* Upload Area */}
            <div className="mb-4">
              <label className="block">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImages}
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {uploadingImages ? 'アップロード中...' : 'クリックして画像を選択、またはドラッグ&ドロップ'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF対応 (最大5MB)
                  </p>
                </div>
              </label>
            </div>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`アップロード画像 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              タグ
            </label>
            
            {/* Add Tag Input */}
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="タグを追加"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Tag List */}
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-indigo-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim() || !formData.content.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '投稿中...' : editPost ? '更新' : '投稿'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};