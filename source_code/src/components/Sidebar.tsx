import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, BookOpen, Award, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const navigation = [
    { name: t('navigation.home'), href: '/', icon: Home },
    { name: t('navigation.qa'), href: '/qa', icon: MessageCircle },
    { name: t('navigation.howto'), href: '/howto', icon: BookOpen },
    { name: t('navigation.showcase'), href: '/showcase', icon: Award },
    { name: 'フレンド', href: '/friends', icon: Users },
    { name: 'ランキング', href: '/ranking', icon: TrendingUp },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors relative
                      ${active
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-indigo-100 rounded-md"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                    <item.icon
                      className={`
                        mr-3 flex-shrink-0 h-6 w-6 relative z-10
                        ${active ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                      `}
                    />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* サイドバー下部の情報 */}
            <div className="px-3 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  今週の活動
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">投稿</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">回答</span>
                    <span className="font-medium">7</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">ポイント</span>
                    <span className="font-medium text-indigo-600">+120</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};