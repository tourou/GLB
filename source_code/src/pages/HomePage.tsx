import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen, Award, TrendingUp, Users, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const stats = [
    { name: '総投稿数', value: '1,234', change: '+12%', changeType: 'increase' },
    { name: '活発なユーザー', value: '89', change: '+5%', changeType: 'increase' },
    { name: '今日の回答', value: '23', change: '+8%', changeType: 'increase' },
    { name: '解決済み', value: '567', change: '+3%', changeType: 'increase' },
  ];

  const recentPosts = [
    {
      id: 1,
      title: 'React Hooksの最適化について教えてください',
      category: 'Q&A',
      author: 'developer123',
      replies: 5,
      time: '2時間前',
      tags: ['React', 'JavaScript', 'フロントエンド']
    },
    {
      id: 2,
      title: 'TypeScriptでの型定義のベストプラクティス',
      category: 'How-To',
      author: 'codemaster',
      replies: 12,
      time: '4時間前',
      tags: ['TypeScript', 'ベストプラクティス']
    },
    {
      id: 3,
      title: '美しいUIコンポーネントライブラリを作りました',
      category: 'Showcase',
      author: 'designer_pro',
      replies: 8,
      time: '6時間前',
      tags: ['UI/UX', 'コンポーネント', '作品']
    },
  ];

  return (
    <div className="space-y-8">
      {/* ヘロセクション */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-4">
          YouWare クリエイター交流フォーラムへようこそ
        </h1>
        <p className="text-lg opacity-90 mb-6">
          学び・共有・作品発表・交流を通じて、スキル向上とつながりを促進しましょう
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/qa"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            質問をする
          </Link>
          <Link
            to="/showcase"
            className="bg-indigo-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-300 transition-colors"
          >
            作品を共有
          </Link>
        </div>
      </motion.div>

      {/* 統計 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {item.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-sm font-medium text-green-600">
                        {item.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* クイックアクセス */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Link
          to="/qa"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Q&A</h3>
              <p className="text-gray-600 text-sm">質問・回答</p>
            </div>
          </div>
        </Link>

        <Link
          to="/howto"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">How-To</h3>
              <p className="text-gray-600 text-sm">使い方・Tips共有</p>
            </div>
          </div>
        </Link>

        <Link
          to="/showcase"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 group"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Showcase</h3>
              <p className="text-gray-600 text-sm">作品シェア</p>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* 最新の投稿 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">最新の投稿</h2>
          <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700">
            すべて見る
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${post.category === 'Q&A' ? 'bg-blue-100 text-blue-800' : 
                        post.category === 'How-To' ? 'bg-green-100 text-green-800' : 
                        'bg-purple-100 text-purple-800'}
                    `}>
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.time}</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {post.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>by {post.author}</span>
                    <span>{post.replies} 回答</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 浮遊アクションボタン */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="fixed bottom-8 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-200 hover:scale-110"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
    </div>
  );
};