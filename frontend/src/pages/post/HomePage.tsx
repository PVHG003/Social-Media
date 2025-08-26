import React, { useState, useEffect } from 'react';
import type { Post } from '@/types/post';
import TopHeader from '@/components/ui/NavBar/NavBar';
import PostCard from '@/components/post/PostCard';
import LeftSidebar from '@/components/ui/SideBar/LeftSidebar';
import RightSidebar from '@/components/ui/SideBar/RightSidebar';
import CreatePostModal from '@/components/post/CreatePostModal';
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
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

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

  const handleLike = async (postId: string, isCurrentlyLiked: boolean) => {
    try {
      let response;
      if (isCurrentlyLiked) {
        response = await postApi.unlikePost(postId);
      } else {
        response = await postApi.likePost(postId);
      }
      
      if (response.data) {
        setPosts(prev => prev.map(post => 
          post.id === postId ? response.data! : post
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
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

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
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
        
        <div className="flex justify-center">
          <div className="w-full max-w-7xl mx-auto px-2 py-4 flex gap-4">
            <div className="w-64 hidden lg:block flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading posts...</p>
                </div>
              </div>
            </div>

            <div className="w-72 hidden xl:block flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
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
        
        <div className="max-w-3xl mx-auto px-4 py-6">
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
      
      <div className="flex justify-center">
        <div className="w-full max-w-7xl mx-auto px-2 py-4 flex gap-4">
          <div className="w-64 hidden lg:block flex-shrink-0">
            <LeftSidebar currentUser={currentUser} />
          </div>

          <div className="flex-1 max-w-3xl mx-auto">
            {/* Create Post Section - Updated với onClick */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {currentUser?.firstName?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <button 
                    onClick={() => setIsCreatePostModalOpen(true)}
                    className="w-full text-left bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-6 py-4 text-gray-600 text-lg"
                  >
                    What's on your mind, {currentUser?.firstName || 'there'}?
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-around mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="flex items-center space-x-3 px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">📸</span>
                  <span className="font-medium">Photo/Video</span>
                </button>
                <button 
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="flex items-center space-x-3 px-6 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
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
                  <p className="text-gray-500 text-lg mb-6">Be the first to share something amazing!</p>
                  <button
                    onClick={() => setIsCreatePostModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Create Your First Post
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="w-72 hidden xl:block flex-shrink-0">
            <RightSidebar />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreated={handlePostCreated}
        currentUser={currentUser}
      />
    </div>
  );
};

export default HomePage;