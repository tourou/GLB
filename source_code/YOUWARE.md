# YouWare クリエイター交流フォーラム - React Modern Development Guide

YouWareユーザー向けクリエイター交流フォーラムアプリケーションです。学び・共有・作品発表・交流を通じて、スキル向上とつながりを促進します。

## プロジェクト概要

- **目的**: YouWareユーザーが質問を投稿し、クリエイター同士で交流できるフォーラム
- **主要機能**: 
  - ユーザー認証（YouWareBackend利用予定）
  - 投稿機能（質問・ガイド・作品シェア）
  - フレンド機能（友達追加・交流）
  - アクティブ化インセンティブ（ポイント・バッジシステム）
- **ページ構成**: 
  1. ホーム - ダッシュボードと概要
  2. Q&A - 質問・回答
  3. How-To - 使い方・Tips共有  
  4. Showcase - 高品質な作品シェア
  5. プロフィール - ユーザー情報とアクティビティ

## 実装済み機能

- ✅ 基本フレームワーク設定（React + TypeScript + Tailwind CSS）
- ✅ ページ構造とナビゲーション（React Router DOM）
- ✅ レスポンシブデザイン対応
- ✅ 美しいUIコンポーネント（Framer Motion アニメーション）
- ✅ サイドバーナビゲーション
- ✅ ヘッダーコンポーネント（モバイル対応）
- ✅ 各ページの基本レイアウト
  - ホームページ（統計・最新投稿・クイックアクセス）
  - Q&Aページ（質問一覧・検索・フィルター）
  - How-Toページ（チュートリアル一覧・カテゴリフィルター）
  - Showcaseページ（作品一覧・カテゴリフィルター）
  - プロフィールページ（ユーザー情報・バッジ・統計）

## 実装完了済み（追加機能）

- ✅ ユーザー認証機能（YouWareBackend利用）
  - YouWareユーザー情報自動取得
  - データベースとの自動同期
  - プロフィール編集機能
- ✅ バックエンドAPI（Cloudflare Workers）
  - D1データベースとの統合
  - ユーザー情報管理
  - プロフィールCRUD操作
- ✅ フロントエンド状態管理（Zustand）
  - 認証状態管理
  - ユーザー情報のキャッシュ
  - エラーハンドリング
- ✅ 投稿機能（完全CRUD操作）
  - 投稿作成・編集・削除機能
  - Q&Aページでの投稿管理
  - 投稿者のみ編集・削除権限
  - 投稿フォームの編集モード対応

## 実装完了済み（コメント・返信機能）

- ✅ コメント機能（投稿への回答・コメント・ディスカッション）
  - CommentsSection コンポーネントの実装
  - コメントCRUD操作（作成・編集・削除）
  - コメントいいね機能
  - Q&Aページでのベストアンサー選択機能
  - ユーザー権限管理（投稿者のみ編集・削除可能）
  - ポイントシステム統合（コメント投稿で5ポイント、ベストアンサー選択で20ポイント）
  - リアルタイム状態更新
- ✅ バックエンドAPIの拡張
  - `/api/comments` - コメント作成
  - `/api/comments/:id` - コメント編集・削除
  - `/api/comments/like` - コメントいいね
  - `/api/comments/best-answer` - ベストアンサー選択
- ✅ フロントエンド状態管理の拡張
  - postsStoreにコメント関連のアクション追加
  - コメント表示・編集・削除の状態管理
  - エラーハンドリング

## 今後の実装予定

- 🔄 HowTo・Showcaseページへのコメント機能統合
- 🔄 フレンド機能
- 🔄 アクティブ化インセンティブ（ポイント・バッジシステム）
- ✅ 多言語対応（i18next利用）
  - 日本語・英語の翻訳リソース完備
  - ブラウザ言語検出機能
  - ヘッダーに言語切り替えUI実装

## Project Status

- **Project Type**: React + TypeScript Modern Web Application
- **Entry Point**: `src/main.tsx` (React application entry)
- **Build System**: Vite 7.0.0 (Fast development and build)
- **Styling System**: Tailwind CSS 3.4.17 (Atomic CSS framework)

## Core Design Principles

### Context-Driven Design Strategy
- Scenario Analysis First: Analyze the user's specific use case, target audience, and functional requirements before making design decisions
- Contextual Appropriateness: Choose design styles that align with the content purpose
- User Journey Consideration: Design interactions and visual flow based on how users will actually engage with the content
IMPORTANT: When users don't specify UI style preferences, always default to modern and responsive UI design with minimalist aesthetic

### Modern Visual Sophistication
- Contemporary Aesthetics: Embrace contemporary design trends for modern aesthetics
- Typography Excellence: Master type scale relationships and strategic white space for premium hierarchy
- Advanced Layouts: Use CSS Grid, asymmetrical compositions, and purposeful negative space
- Strategic Color Systems: Choose palettes based on use cases and psychological impact

### Delightful Interactions
- Dynamic Over Static: Prioritize interactive experiences over passive presentations
- Micro-Interactions: Subtle hover effects, smooth transitions, and responsive feedback animations
- Animation Sophistication: Layer motion design that enhances usability without overwhelming
- Surprise Elements: Custom cursors, hidden Easter eggs, playful loading states, and unexpected interactive details (if applicable)

### Technical Excellence
- Reusable, typed React components with clear interfaces
- Leverage React 18's concurrent features to enhance user experience
- Adopt TypeScript for type-safe development experience
- Use Zustand for lightweight state management
- Implement smooth single-page application routing through React Router DOM

## Project Architecture

### Directory Structure

```
project-root/
├── index.html              # Main HTML template
├── package.json            # Node.js dependencies and scripts
├── package-lock.json       # Lock file for npm dependencies
├── README.md              # Project documentation
├── YOUWARE.md             # Development guide and template documentation
├── yw_manifest.json       # Project manifest file
├── vite.config.ts         # Vite build tool configuration
├── tsconfig.json          # TypeScript configuration (main)
├── tsconfig.app.json      # TypeScript configuration for app
├── tsconfig.node.json     # TypeScript configuration for Node.js
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── dist/                  # Build output directory (generated)
└── src/                   # Source code directory
    ├── App.tsx            # Main application component
    ├── main.tsx           # Application entry point
    ├── index.css          # Global styles and Tailwind CSS imports
    ├── vite-env.d.ts      # Vite type definitions
    ├── api/               # API related code
    ├── assets/            # Static assets
    ├── components/        # Reusable components
    │   ├── Header.tsx     # Header component with navigation
    │   └── Sidebar.tsx    # Sidebar navigation component
    ├── layouts/           # Layout components
    │   └── Layout.tsx     # Main layout wrapper
    ├── pages/             # Page components
    │   ├── HomePage.tsx   # Dashboard and overview
    │   ├── QAPage.tsx     # Q&A questions and answers
    │   ├── HowToPage.tsx  # How-To guides and tutorials
    │   ├── ShowcasePage.tsx # Project showcase
    │   └── ProfilePage.tsx # User profile and statistics
    ├── store/             # State management
    ├── styles/            # Style files
    └── types/             # TypeScript type definitions
```

### Code Organization Principles

- Write semantic React components with clear component hierarchy
- Use TypeScript interfaces and types to ensure type safety
- Create modular components with clear separation of concerns
- Prioritize maintainability and readability

## Tech Stack

### Core Framework
- **React**: 18.3.1 - Declarative UI library
- **TypeScript**: 5.8.3 - Type-safe JavaScript superset
- **Vite**: 7.0.0 - Next generation frontend build tool
- **Tailwind CSS**: 3.4.17 - Atomic CSS framework

### Routing and State Management
- **React Router DOM**: 6.30.1 - Client-side routing
- **Zustand**: 4.4.7 - Lightweight state management

### Internationalization Support
- **i18next**: 23.10.1 - Internationalization core library
- **react-i18next**: 14.1.0 - React integration for i18next
- **i18next-browser-languagedetector**: 7.2.0 - Browser language detection

### UI and Styling
- **Lucide React**: Beautiful icon library
- **Headless UI**: 1.7.18 - Unstyled UI components
- **Framer Motion**: 11.0.8 - Powerful animation library
- **GSAP**: 3.13.0 - High-performance professional animation library
- **clsx**: 2.1.0 - Conditional className utility

### 3D Graphics and Physics
- **Three.js**: 0.179.1 - JavaScript 3D graphics library
- **Cannon-es**: Modern TypeScript-enabled 3D physics engine
- **Matter.js**: 0.20.0 - 2D physics engine for web

## Technical Standards

### React Component Development Methodology

- Use functional components and React Hooks
- Implement single responsibility principle for components
- Create reusable and composable component architecture
- Use TypeScript for strict type checking

### Styling and Design System

- Use Tailwind CSS design token system
- Apply mobile-first responsive design approach
- Leverage modern layout techniques (Grid, Flexbox)
- Implement thoughtful animations and transitions through Framer Motion and GSAP
- Create immersive 3D visual experiences with Three.js
- Add realistic physics interactions using Cannon-es and Matter.js

### CSS Import Order Rules

**CRITICAL**: `@import` statements must come BEFORE all other CSS statements to avoid PostCSS warnings.

### State Management Approach

- Use Zustand for global state management
- Prioritize React built-in Hooks for local state
- Implement clear data flow and state update patterns
- Ensure state predictability and debugging capabilities

### Performance Optimization Requirements

- Use React.memo and useMemo for component optimization
- Implement code splitting and lazy loading
- Optimize resource loading and caching strategies
- Ensure all interactions work on both touch and pointer devices

## Development Commands

- **Install dependencies**: `npm install`
- **Build project**: `npm run build`

## ⚠️ CRITICAL: Do NOT Modify index.html Entry Point

**WARNING**: This is a Vite + React project. **NEVER** modify this critical line in `index.html`:

```html
<script type="module" src="/src/main.tsx"></script>
```

**Why**: This is the core entry point. Any modification will cause the app to completely stop working.

**Do instead**: Work in `src/` directory - modify `App.tsx`, add components in `src/components/`, pages in `src/pages/`.

**If accidentally modified**: 
1. Restore: `<script type="module" src="/src/main.tsx"></script>`
2. Rebuild: `npm run build`

## Build and Deployment

The project uses Vite build system:
- **Development server**: `http://127.0.0.1:5173`
- **Build output**: `dist/` directory
- **Supports HMR**: Hot Module Replacement
- **Optimized production build**: Automatic code splitting and optimization

## Configuration Files

- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `yw_manifest.json` - Project manifest file

## Backend Integration Strategy

### YouWare Backend Integration Plan
- **Authentication**: Integrate YouWare Backend user authentication system
- **Database**: Use D1 SQLite database for posts, comments, user data
- **File Storage**: R2 bucket for profile images and project assets
- **API Structure**: RESTful API endpoints for CRUD operations

### Data Models (Implemented)
- **Users**: Profile information, points, badges, preferences ✅
- **Posts**: Questions, guides, showcase items with categorization ✅
- **Comments**: Answers and responses to posts ✅
- **User_badges**: Achievement badges and rewards ✅
- **Friendships**: User relationships and networking ✅
- **User_points_log**: Point transaction history ✅

### Backend API Endpoints (Implemented)

**ユーザー管理**
- `GET /api/user/profile` - ユーザープロフィール取得
- `PUT /api/user/profile` - プロフィール更新
- `POST /api/user/sync` - YouWareユーザー情報同期
- `GET /api/users` - ユーザー一覧取得
- `GET /api/user/badges` - ユーザーバッジ取得

**投稿管理**
- `GET /api/posts` - 投稿一覧取得（フィルター・検索対応）
- `POST /api/posts` - 新規投稿作成
- `GET /api/posts/:id` - 投稿詳細取得（コメント含む）
- `PUT /api/posts/:id` - 投稿更新
- `DELETE /api/posts/:id` - 投稿削除
- `POST /api/posts/like` - 投稿いいね

**コメント管理**
- `POST /api/comments` - コメント作成
- `PUT /api/comments/:id` - コメント更新
- `DELETE /api/comments/:id` - コメント削除
- `POST /api/comments/like` - コメントいいね
- `POST /api/comments/best-answer` - ベストアンサー選択

**システム**
- `GET /health` - ヘルスチェック

### Authentication Flow (Enhanced)
**多重認証システムの実装**：
1. **プロダクション環境（YouWareプラットフォーム）**:
   - `window.__user_info__` グローバル変数から取得（優先）
   - フォールバック：`https://backend.youware.com/__user_info__` エンドポイント
2. **開発環境（localhost/paintress）**:
   - 自動的にモックユーザー認証を有効化
   - テストユーザーで全機能利用可能
3. **データ同期**:
   - バックエンドとの自動同期
   - Zustandでリアルタイム状態管理
   - 認証失敗時のグレースフル処理

## Next Development Steps

1. **Backend Setup**: Create YouWare Backend with database schema
2. **Authentication Integration**: Connect frontend with YouWare user system
3. **Post Management**: Implement CRUD operations for all post types
4. **Real-time Features**: Add notifications and live updates
5. **Gamification**: Complete points and badge system
6. **Internationalization**: Implement multi-language support
7. **Mobile Optimization**: Fine-tune mobile responsiveness
8. **Performance**: Add caching and optimization strategies