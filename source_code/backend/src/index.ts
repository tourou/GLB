interface Env {
  DB: D1Database;
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Response helper with CORS
function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Error response helper
function errorResponse(message: string, status: number = 500) {
  console.error(`API Error [${status}]:`, message);
  return jsonResponse({ error: message }, status);
}

// Get user info from headers (automatically injected by YouWare)
function getUserFromRequest(request: Request) {
  const userId = request.headers.get('X-Encrypted-Yw-ID');
  const isLogin = request.headers.get('X-Is-Login') === '1';
  
  return { userId, isLogin };
}

// Ensure user exists in database, create if not exists
async function ensureUserExists(env: Env, userId: string) {
  if (!userId) return null;

  // Check if user exists
  const existingUser = await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?')
    .bind(userId)
    .first();

  if (existingUser) {
    // Update last_active
    await env.DB.prepare('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE encrypted_yw_id = ?')
      .bind(userId)
      .run();
    return existingUser;
  }

  // Create new user with default values
  await env.DB.prepare(`
    INSERT INTO users (encrypted_yw_id, level, points, join_date, last_active)
    VALUES (?, '初心者', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).bind(userId).run();

  // Return the newly created user
  return await env.DB.prepare('SELECT * FROM users WHERE encrypted_yw_id = ?')
    .bind(userId)
    .first();
}

// Update user profile from YouWare user info
async function updateUserProfile(env: Env, userId: string, userInfo: any) {
  if (!userId || !userInfo) return;

  const { display_name, photo_url } = userInfo;
  
  await env.DB.prepare(`
    UPDATE users 
    SET display_name = ?, photo_url = ?, last_active = CURRENT_TIMESTAMP
    WHERE encrypted_yw_id = ?
  `).bind(display_name, photo_url, userId).run();
}

// API Routes
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    const method = request.method;

    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      // Get user information
      const { userId, isLogin } = getUserFromRequest(request);

      // Route handlers
      if (pathname === '/api/user/profile') {
        if (method === 'GET') {
          // Get user profile
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const user = await ensureUserExists(env, userId);
          if (!user) {
            return errorResponse('ユーザーが見つかりません', 404);
          }

          // Get user stats
          const [postCount, commentCount, totalLikes, badgeCount] = await Promise.all([
            env.DB.prepare('SELECT COUNT(*) as count FROM posts WHERE user_id = ?').bind(userId).first(),
            env.DB.prepare('SELECT COUNT(*) as count FROM comments WHERE user_id = ?').bind(userId).first(),
            env.DB.prepare('SELECT SUM(likes) as total FROM posts WHERE user_id = ?').bind(userId).first(),
            env.DB.prepare('SELECT COUNT(*) as count FROM user_badges WHERE user_id = ?').bind(userId).first(),
          ]);

          const profile = {
            ...user,
            stats: {
              posts: postCount?.count || 0,
              comments: commentCount?.count || 0,
              likes: totalLikes?.total || 0,
              badges: badgeCount?.count || 0,
            }
          };

          return jsonResponse(profile);
        }
        
        if (method === 'PUT') {
          // Update user profile
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const data = await request.json();
          const { display_name, bio, level } = data;

          await env.DB.prepare(`
            UPDATE users 
            SET display_name = ?, bio = ?, level = ?, last_active = CURRENT_TIMESTAMP
            WHERE encrypted_yw_id = ?
          `).bind(display_name, bio, level, userId).run();

          return jsonResponse({ success: true, message: 'プロフィールを更新しました' });
        }
      }

      if (pathname === '/api/user/sync') {
        if (method === 'POST') {
          // Sync user info from YouWare platform
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const data = await request.json();
          await ensureUserExists(env, userId);
          await updateUserProfile(env, userId, data);

          return jsonResponse({ success: true, message: 'ユーザー情報を同期しました' });
        }
      }

      if (pathname === '/api/users') {
        if (method === 'GET') {
          // Get users list (for friends, etc.)
          const { results } = await env.DB.prepare(`
            SELECT encrypted_yw_id, display_name, photo_url, level, points, join_date
            FROM users 
            ORDER BY points DESC, join_date DESC
            LIMIT 50
          `).all();

          return jsonResponse(results);
        }
      }

      if (pathname === '/api/user/badges') {
        if (method === 'GET') {
          // Get user badges
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const { results } = await env.DB.prepare(`
            SELECT * FROM user_badges 
            WHERE user_id = ? 
            ORDER BY earned_at DESC
          `).bind(userId).all();

          return jsonResponse(results);
        }
      }

      // Posts API endpoints
      if (pathname === '/api/posts') {
        if (method === 'GET') {
          // Get posts list with filters
          const category = url.searchParams.get('category');
          const search = url.searchParams.get('search');
          const sortBy = url.searchParams.get('sortBy') || 'created_at';
          const limit = parseInt(url.searchParams.get('limit') || '20');
          const offset = parseInt(url.searchParams.get('offset') || '0');

          let query = `
            SELECT p.*, u.display_name, u.photo_url, u.level
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.encrypted_yw_id
            WHERE p.status = 'published'
          `;
          const params: any[] = [];

          if (category && ['qa', 'howto', 'showcase'].includes(category)) {
            query += ' AND p.category = ?';
            params.push(category);
          }

          if (search) {
            query += ' AND (p.title LIKE ? OR p.content LIKE ? OR p.tags LIKE ?)';
            params.push(`%${search}%`, `%${search}%`, `%${search}%`);
          }

          // Sort options
          switch (sortBy) {
            case 'popular':
              query += ' ORDER BY p.likes DESC, p.views DESC';
              break;
            case 'views':
              query += ' ORDER BY p.views DESC';
              break;
            case 'latest':
            default:
              query += ' ORDER BY p.created_at DESC';
              break;
          }

          query += ' LIMIT ? OFFSET ?';
          params.push(limit, offset);

          const { results } = await env.DB.prepare(query).bind(...params).all();

          return jsonResponse(results);
        }

        if (method === 'POST') {
          // Create new post
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const data = await request.json();
          const { category, title, content, tags, images, project_url } = data;

          if (!category || !title || !content) {
            return errorResponse('必要な項目が不足しています', 400);
          }

          if (!['qa', 'howto', 'showcase'].includes(category)) {
            return errorResponse('無効なカテゴリです', 400);
          }

          await ensureUserExists(env, userId);

          const tagsJson = tags ? JSON.stringify(tags) : null;
          const imagesJson = images ? JSON.stringify(images) : null;

          const result = await env.DB.prepare(`
            INSERT INTO posts (user_id, category, title, content, tags, images, project_url, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `).bind(userId, category, title, content, tagsJson, imagesJson, project_url || null).run();

          // Award points for posting (simplified for now)
          await env.DB.prepare(`
            INSERT INTO user_points_log (user_id, points, reason)
            VALUES (?, 10, 'post_created')
          `).bind(userId).run();
          
          await env.DB.prepare('UPDATE users SET points = points + 10 WHERE encrypted_yw_id = ?')
            .bind(userId).run();

          return jsonResponse({ 
            success: true, 
            message: '投稿を作成しました',
            postId: result.meta.last_row_id 
          });
        }
      }

      if (pathname.startsWith('/api/posts/')) {
        const postId = pathname.split('/')[3];
        
        if (method === 'GET') {
          // Get single post with comments
          const post = await env.DB.prepare(`
            SELECT p.*, u.display_name, u.photo_url, u.level
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.encrypted_yw_id
            WHERE p.id = ? AND p.status = 'published'
          `).bind(postId).first();

          if (!post) {
            return errorResponse('投稿が見つかりません', 404);
          }

          // Get comments for this post
          const { results: comments } = await env.DB.prepare(`
            SELECT c.*, u.display_name, u.photo_url, u.level
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.encrypted_yw_id
            WHERE c.post_id = ?
            ORDER BY c.is_best_answer DESC, c.likes DESC, c.created_at ASC
          `).bind(postId).all();

          // Increment view count
          await env.DB.prepare('UPDATE posts SET views = views + 1 WHERE id = ?')
            .bind(postId).run();

          return jsonResponse({
            ...post,
            comments
          });
        }

        if (method === 'PUT') {
          // Update post
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const post = await env.DB.prepare('SELECT user_id FROM posts WHERE id = ?')
            .bind(postId).first();

          if (!post) {
            return errorResponse('投稿が見つかりません', 404);
          }

          if (post.user_id !== userId) {
            return errorResponse('この投稿を編集する権限がありません', 403);
          }

          const data = await request.json();
          const { title, content, tags, images, project_url, status } = data;

          const tagsJson = tags ? JSON.stringify(tags) : null;
          const imagesJson = images ? JSON.stringify(images) : null;

          await env.DB.prepare(`
            UPDATE posts 
            SET title = ?, content = ?, tags = ?, images = ?, project_url = ?, status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).bind(title, content, tagsJson, imagesJson, project_url || null, status || 'published', postId).run();

          return jsonResponse({ success: true, message: '投稿を更新しました' });
        }

        if (method === 'DELETE') {
          // Delete post
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const post = await env.DB.prepare('SELECT user_id FROM posts WHERE id = ?')
            .bind(postId).first();

          if (!post) {
            return errorResponse('投稿が見つかりません', 404);
          }

          if (post.user_id !== userId) {
            return errorResponse('この投稿を削除する権限がありません', 403);
          }

          // Delete comments first (cascade)
          await env.DB.prepare('DELETE FROM comments WHERE post_id = ?').bind(postId).run();
          
          // Delete post
          await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(postId).run();

          return jsonResponse({ success: true, message: '投稿を削除しました' });
        }
      }

      if (pathname === '/api/posts/like') {
        if (method === 'POST') {
          // Like/unlike post
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const data = await request.json();
          const { postId } = data;

          // Toggle like (simple increment for now)
          await env.DB.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?')
            .bind(postId).run();

          return jsonResponse({ success: true, message: 'いいねしました' });
        }
      }

      // Comments API endpoints
      if (pathname === '/api/comments') {
        if (method === 'POST') {
          // Create new comment
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const data = await request.json();
          const { post_id, content } = data;

          if (!post_id || !content) {
            return errorResponse('必要な項目が不足しています', 400);
          }

          // Verify post exists
          const post = await env.DB.prepare('SELECT id FROM posts WHERE id = ? AND status = ?')
            .bind(post_id, 'published').first();

          if (!post) {
            return errorResponse('投稿が見つかりません', 404);
          }

          await ensureUserExists(env, userId);

          const result = await env.DB.prepare(`
            INSERT INTO comments (post_id, user_id, content, created_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          `).bind(post_id, userId, content).run();

          // Award points for commenting
          await env.DB.prepare(`
            INSERT INTO user_points_log (user_id, points, reason)
            VALUES (?, 5, 'comment_created')
          `).bind(userId).run();
          
          await env.DB.prepare('UPDATE users SET points = points + 5 WHERE encrypted_yw_id = ?')
            .bind(userId).run();

          // Get the created comment with user info
          const newComment = await env.DB.prepare(`
            SELECT c.*, u.display_name, u.photo_url, u.level
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.encrypted_yw_id
            WHERE c.id = ?
          `).bind(result.meta.last_row_id).first();

          return jsonResponse({ 
            success: true, 
            message: 'コメントを投稿しました',
            comment: newComment
          });
        }
      }

      if (pathname.startsWith('/api/comments/')) {
        const commentId = pathname.split('/')[3];

        if (method === 'PUT') {
          // Update comment
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const comment = await env.DB.prepare('SELECT user_id FROM comments WHERE id = ?')
            .bind(commentId).first();

          if (!comment) {
            return errorResponse('コメントが見つかりません', 404);
          }

          if (comment.user_id !== userId) {
            return errorResponse('このコメントを編集する権限がありません', 403);
          }

          const data = await request.json();
          const { content } = data;

          if (!content) {
            return errorResponse('コメント内容が必要です', 400);
          }

          await env.DB.prepare(`
            UPDATE comments 
            SET content = ?
            WHERE id = ?
          `).bind(content, commentId).run();

          return jsonResponse({ success: true, message: 'コメントを更新しました' });
        }

        if (method === 'DELETE') {
          // Delete comment
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const comment = await env.DB.prepare('SELECT user_id FROM comments WHERE id = ?')
            .bind(commentId).first();

          if (!comment) {
            return errorResponse('コメントが見つかりません', 404);
          }

          if (comment.user_id !== userId) {
            return errorResponse('このコメントを削除する権限がありません', 403);
          }

          await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(commentId).run();

          return jsonResponse({ success: true, message: 'コメントを削除しました' });
        }
      }

      if (pathname === '/api/comments/like') {
        if (method === 'POST') {
          // Like/unlike comment
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const data = await request.json();
          const { commentId } = data;

          // Toggle like (simple increment for now)
          await env.DB.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?')
            .bind(commentId).run();

          return jsonResponse({ success: true, message: 'コメントにいいねしました' });
        }
      }

      if (pathname === '/api/comments/best-answer') {
        if (method === 'POST') {
          // Mark comment as best answer (only post author can do this)
          if (!userId) {
            return errorResponse('ユーザーが認証されていません', 401);
          }

          const data = await request.json();
          const { commentId, postId } = data;

          // Check if user is the post author
          const post = await env.DB.prepare('SELECT user_id FROM posts WHERE id = ?')
            .bind(postId).first();

          if (!post) {
            return errorResponse('投稿が見つかりません', 404);
          }

          if (post.user_id !== userId) {
            return errorResponse('ベストアンサーを選ぶ権限がありません', 403);
          }

          // Remove best answer from other comments in this post
          await env.DB.prepare('UPDATE comments SET is_best_answer = 0 WHERE post_id = ?')
            .bind(postId).run();

          // Set this comment as best answer
          await env.DB.prepare('UPDATE comments SET is_best_answer = 1 WHERE id = ?')
            .bind(commentId).run();

          // Award bonus points to comment author
          const comment = await env.DB.prepare('SELECT user_id FROM comments WHERE id = ?')
            .bind(commentId).first();

          if (comment) {
            await env.DB.prepare(`
              INSERT INTO user_points_log (user_id, points, reason)
              VALUES (?, 20, 'best_answer_selected')
            `).bind(comment.user_id).run();
            
            await env.DB.prepare('UPDATE users SET points = points + 20 WHERE encrypted_yw_id = ?')
              .bind(comment.user_id).run();
          }

          return jsonResponse({ success: true, message: 'ベストアンサーに選択しました' });
        }
      }

      // Health check
      if (pathname === '/health') {
        return jsonResponse({ status: 'OK', timestamp: new Date().toISOString() });
      }

      // 404 for unmatched routes
      return errorResponse('エンドポイントが見つかりません', 404);

    } catch (error) {
      console.error('Request handling error:', error);
      return errorResponse('サーバーエラーが発生しました', 500);
    }
  },
};