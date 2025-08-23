import React, { useState, useEffect } from 'react';
import type { Post } from '@/types/post';
import TopHeader from '@/components/ui/NavBar/NavBar';
import PostCard from '@/components/post/PostCard';
import postApi from '@/services/post/apiPost';
import userApi from '@/services/user/apiUser';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
    fetchPosts();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await userApi.getCurrentUser();
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchPosts = async (pageNum: number = 0, append: boolean = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      
      const response = await postApi.getAllPosts(pageNum, 10);
      
      if (append) {
        const validPosts = (response.data || []).filter(post => post.id) as Post[];
        setPosts(prev => [...prev, ...validPosts]);
      } else {
        const validPosts = (response.data || []).filter(post => post.id) as Post[];
        setPosts(validPosts);
      }
      
      setHasMore(pageNum < (response.totalPages || 1) - 1);
      setPage(pageNum);
      
    } catch (err: unknown) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, true);
    }
  };

  // FIX: Simplify handleLike và return updated post data
  const handleLike = async (postId: string, isCurrentlyLiked: boolean) => {
    try {
      let response;
      if (isCurrentlyLiked) {
        response = await postApi.unlikePost(postId);
      } else {
        response = await postApi.likePost(postId);
      }
      
      // Update posts list với data từ server
      if (response.data) {
        setPosts(prev => prev.map(post => 
          post.id === postId ? response.data! : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error; // Re-throw để PostCard có thể handle
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const handleUpdatePost = (postId: string, updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? updatedPost : post
    ));
  };

  const getProfileImageSrc = (profileImagePath?: string | null): string => {
    if (!profileImagePath || profileImagePath.trim() === '') {
      return '/default-avatar.png';
    }
    return profileImagePath.startsWith('http') ? profileImagePath : `http://localhost:8080${profileImagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopHeader
          fullName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Loading..."}
          username={currentUser?.username || ""}
          userAvatar={getProfileImageSrc(currentUser?.profileImagePath)}
          userId={currentUser?.id || ""}
          isAuthenticated={true}
        />
        
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopHeader
          fullName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Error"}
          username={currentUser?.username || ""}
          userAvatar={getProfileImageSrc(currentUser?.profileImagePath)}
          userId={currentUser?.id || ""}
          isAuthenticated={true}
        />
        
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopHeader
        fullName={currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Social Media"}
        username={currentUser?.username || ""}
        userAvatar={getProfileImageSrc(currentUser?.profileImagePath)}
        userId={currentUser?.id || ""}
        isAuthenticated={true}
      />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {currentUser?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <button className="w-full text-left bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-6 py-4 text-gray-600 text-lg">
                What's on your mind, {currentUser?.firstName || 'there'}?
              </button>
            </div>
          </div>
          <div className="flex items-center justify-around mt-6 pt-4 border-t border-gray-200">
            <button className="flex items-center space-x-3 px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <span className="text-xl">📸</span>
              <span className="font-medium">Photo/Video</span>
            </button>
            <button className="flex items-center space-x-3 px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              <span className="text-xl">😊</span>
              <span className="font-medium">Feeling/Activity</span>
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div>
          {posts.length > 0 ? (
            <>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onDelete={handleDeletePost}
                  onUpdate={handleUpdatePost}
                />
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {loadingMore ? (
                      <span className="flex items-center space-x-2">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Loading...</span>
                      </span>
                    ) : (
                      'Load More Posts'
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
              <div className="text-gray-400 text-8xl mb-6">📝</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">No posts yet</h3>
              <p className="text-gray-500 text-lg">Be the first to share something amazing!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;