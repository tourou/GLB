import React, { useState, useEffect } from 'react';
import { User, Settings, Award, Users, MessageCircle, BookOpen, Calendar, TrendingUp, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

export const ProfilePage: React.FC = () => {
  const { user, isLoading, fetchUserInfo, updateProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    display_name: '',
    bio: '',
    level: ''
  });

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  useEffect(() => {
    if (user) {
      setEditData({
        display_name: user.display_name || '',
        bio: user.bio || '',
        level: user.level || '初心者'
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">プロフィール読み込み中...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ユーザー情報を読み込めませんでした
          </h3>
          <p className="text-gray-600">
            ログインしているか確認してください
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: '概要', icon: User },
    { id: 'posts', name: '投稿', icon: MessageCircle },
    { id: 'badges', name: 'バッジ', icon: Award },
    { id: 'friends', name: 'フレンド', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* プロフィールヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32"></div>
        <div className="px-6 pb-6">
          <div className="relative -mt-16 mb-4">
            <div className="inline-block">
              <div className="h-24 w-24 rounded-full bg-white p-2 shadow-lg">
                {user.photo_url ? (
                  <img 
                    src={user.photo_url} 
                    alt="Profile" 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-indigo-600" />
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.display_name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  {user.level}
                </span>
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {user.points} ポイント
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {user.join_date ? new Date(user.join_date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short' }) : '不明'}参加
                </span>
              </div>
            </div>
            
            {!isEditing && (
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  プロフィール編集
                </button>
              </div>
            )}
            
            {isEditing && (
              <div className="mt-4 sm:mt-0 flex space-x-3">
                <button 
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? '保存中...' : '保存'}
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  表示名
                </label>
                <input
                  type="text"
                  value={editData.display_name}
                  onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  レベル
                </label>
                <select
                  value={editData.level}
                  onChange={(e) => setEditData({ ...editData, level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="初心者">初心者</option>
                  <option value="中級者">中級者</option>
                  <option value="上級者">上級者</option>
                  <option value="エキスパート">エキスパート</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  自己紹介
                </label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="あなたの経験やスキル、興味のある分野について教えてください..."
                />
              </div>
            </div>
          ) : (
            user.bio && (
              <p className="mt-4 text-gray-600 leading-relaxed">
                {user.bio}
              </p>
            )
          )}
        </div>
      </motion.div>

      {/* 統計カード */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-indigo-600 mb-1">{user.stats?.posts || 0}</div>
          <div className="text-sm text-gray-600">投稿</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{user.stats?.comments || 0}</div>
          <div className="text-sm text-gray-600">コメント</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">{user.stats?.likes || 0}</div>
          <div className="text-sm text-gray-600">いいね</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">{user.stats?.badges || 0}</div>
          <div className="text-sm text-gray-600">バッジ</div>
        </div>
      </motion.div>

      {/* タブナビゲーション */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative py-4 px-1 flex items-center space-x-2 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* 概要タブ */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">最近の活動</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-700">
                      <strong>React Hooks</strong>に関する質問に回答しました
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">2時間前</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-700">
                      <strong>TypeScript最適化</strong>のガイドを投稿しました
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">1日前</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Award className="h-5 w-5 text-purple-500" />
                    <span className="text-sm text-gray-700">
                      <strong>AI搭載アプリ</strong>をShowcaseに投稿しました
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">3日前</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">スキル・興味</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'UI/UX', 'AWS'].map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* バッジタブ */}
          {activeTab === 'badges' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">獲得バッジ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.badges.map((badge: any, index: number) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className={`
                        p-4 rounded-xl border-2 text-center
                        ${badge.rarity === 'gold' ? 'border-yellow-200 bg-yellow-50' :
                          badge.rarity === 'silver' ? 'border-gray-200 bg-gray-50' :
                          'border-amber-200 bg-amber-50'}
                      `}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-1">{badge.name}</h4>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* その他のタブ */}
          {(activeTab === 'posts' || activeTab === 'friends') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 mb-4">
                {activeTab === 'posts' ? <MessageCircle className="h-12 w-12 mx-auto" /> :
                 <Users className="h-12 w-12 mx-auto" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'posts' ? '投稿履歴' : 'フレンド一覧'}
              </h3>
              <p className="text-gray-600">
                この機能は後で実装予定です
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};