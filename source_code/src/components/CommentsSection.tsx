import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Heart, Star, Edit3, Trash2, Send, Check } from 'lucide-react';
import { usePostsStore } from '../store/postsStore';
import { useAuthStore } from '../store/authStore';

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

interface CommentsSectionProps {
  postId: number;
  postAuthorId: string;
  comments: Comment[];
  category: 'qa' | 'howto' | 'showcase';
}

export default function CommentsSection({ postId, postAuthorId, comments, category }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createComment, updateComment, deleteComment, likeComment, markBestAnswer, error } = usePostsStore();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createComment(postId, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('コメント投稿エラー:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = (commentId: number, currentContent: string) => {
    setEditingComment(commentId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, editContent.trim());
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('コメント編集エラー:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('このコメントを削除しますか？')) return;

    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('コメント削除エラー:', error);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated) return;

    try {
      await likeComment(commentId);
    } catch (error) {
      console.error('コメントいいねエラー:', error);
    }
  };

  const handleMarkBestAnswer = async (commentId: number) => {
    try {
      await markBestAnswer(commentId, postId);
    } catch (error) {
      console.error('ベストアンサー選択エラー:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 30) return `${days}日前`;
    
    return date.toLocaleDateString('ja-JP');
  };

  // Sort comments: best answers first, then by likes and date
  const sortedComments = [...comments].sort((a, b) => {
    if (a.is_best_answer !== b.is_best_answer) {
      return b.is_best_answer - a.is_best_answer;
    }
    if (a.likes !== b.likes) {
      return b.likes - a.likes;
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const canMarkBestAnswer = category === 'qa' && user && user.encrypted_yw_id === postAuthorId;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          コメント ({comments.length})
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* New Comment Form */}
      {isLoading ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">認証情報を確認中...</p>
        </div>
      ) : isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <img
                src={user?.photo_url || '/default-avatar.png'}
                alt={user?.display_name || 'ユーザー'}
                className="h-10 w-10 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  category === 'qa' ? '回答を投稿...' :
                  category === 'howto' ? '質問やコメントを投稿...' :
                  'コメントを投稿...'
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {newComment.length}/1000文字
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? '投稿中...' : '投稿'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">コメントを投稿するにはログインが必要です</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-red-600 mt-1">
              開発環境: 認証情報の読み込み中です。ページを再読み込みしてください。
            </p>
          )}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {sortedComments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`relative p-4 rounded-lg border transition-colors ${
                comment.is_best_answer 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {comment.is_best_answer === 1 && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    ベストアンサー
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={comment.photo_url || '/default-avatar.png'}
                    alt={comment.display_name || 'ユーザー'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {comment.display_name || 'ユーザー'}
                    </h4>
                    {comment.level && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        {comment.level}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>

                  {editingComment === comment.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          保存
                        </button>
                        <button
                          onClick={() => setEditingComment(null)}
                          className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {comment.content}
                      </p>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          disabled={!isAuthenticated}
                          className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Heart className="h-3 w-3" />
                          {comment.likes}
                        </button>

                        {canMarkBestAnswer && comment.is_best_answer === 0 && (
                          <button
                            onClick={() => handleMarkBestAnswer(comment.id)}
                            className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 transition-colors"
                          >
                            <Star className="h-3 w-3" />
                            ベストアンサーに選択
                          </button>
                        )}

                        {user && user.encrypted_yw_id === comment.user_id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditComment(comment.id, comment.content)}
                              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <Edit3 className="h-3 w-3" />
                              編集
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              削除
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {category === 'qa' ? 'まだ回答がありません。最初の回答を投稿してみませんか？' :
               category === 'howto' ? 'まだコメントがありません。質問やコメントを投稿してみませんか？' :
               'まだコメントがありません。最初のコメントを投稿してみませんか？'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}