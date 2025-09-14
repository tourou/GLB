import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import LanguageSwitcher from './LanguageSwitcher';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoading, fetchUserInfo } = useAuthStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              CreatorForum
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/qa" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('navigation.qa')}
            </Link>
            <Link 
              to="/howto" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('navigation.howto')}
            </Link>
            <Link 
              to="/showcase" 
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {t('navigation.showcase')}
            </Link>
          </nav>

          {/* 検索バー */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={t('common.search')}
              />
            </div>
          </div>

          {/* ユーザーアクション */}
          <div className="flex items-center space-x-4">
            {/* 言語切り替え */}
            <LanguageSwitcher />
            
            {/* 通知 */}
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* プロフィール */}
            <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
              {user?.photo_url ? (
                <img 
                  src={user.photo_url} 
                  alt="Profile" 
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
              )}
              {user && (
                <span className="hidden lg:block text-sm font-medium">
                  {user.display_name || 'ユーザー'}
                </span>
              )}
              {isLoading && (
                <span className="hidden lg:block text-sm text-gray-500">
                  {t('common.loading')}
                </span>
              )}
            </Link>

            {/* モバイルメニュー */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-400 hover:text-gray-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/qa"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                onClick={toggleMenu}
              >
                {t('navigation.qa')}
              </Link>
              <Link
                to="/howto"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                onClick={toggleMenu}
              >
                {t('navigation.howto')}
              </Link>
              <Link
                to="/showcase"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                onClick={toggleMenu}
              >
                {t('navigation.showcase')}
              </Link>
            </div>
            
            {/* モバイル検索 */}
            <div className="px-4 pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder={t('common.search')}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};