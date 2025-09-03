import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { FiTrash2, FiSearch, FiMessageCircle } from "react-icons/fi";
import { adminService } from "../../../services/admin/adminService";
import postApi from "../../../services/post/apiPost";
import commentApi from "../../../services/post/apiComment";
import type { PostResponse, CommentResponseDto } from "../../../api";

export default function PostManagement() {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostResponse | null>(null);
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const fetchPosts = async (page = 0, search = "") => {
    try {
      setLoading(true);
      const response = await postApi.getAllPosts(page, 10);
      
      if (response.data) {
        let filteredPosts = response.data;
        if (search) {
          filteredPosts = response.data.filter(post =>
            post.content?.toLowerCase().includes(search.toLowerCase()) ||
            post.author?.username?.toLowerCase().includes(search.toLowerCase())
          );
        }
        setPosts(filteredPosts);
        setTotalPages(response.totalPages || 0);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      setCommentsLoading(true);
      const response = await commentApi.getCommentsByPost(postId, 0, 100);
      
      if (response.data) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(0);
    fetchPosts(0, searchQuery);
  };

  const handleDeletePost = async (postId: string, authorUsername: string) => {
    if (!confirm(`Are you sure you want to delete this post by "${authorUsername}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(postId);
      await adminService.deletePost(postId);
      
      // Refresh the posts list
      await fetchPosts(currentPage, searchQuery);
      
      alert(`Post has been deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete post:", error);
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment? This action cannot be undone.")) {
      return;
    }

    try {
      await adminService.deleteComment(commentId);
      
      // Refresh comments
      if (selectedPost?.id) {
        await fetchComments(selectedPost.id);
      }
      
      alert("Comment has been deleted successfully.");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const handleShowComments = async (post: PostResponse) => {
    setSelectedPost(post);
    if (post.id) {
      await fetchComments(post.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Post Management</h1>
        <div className="text-sm text-gray-500">
          Total Posts: {posts.length}
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search posts by content or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Posts List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Posts</h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No posts found</div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="p-4 border-b border-gray-200 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          @{post.author?.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{post.likeCount || 0} likes</span>
                        <span>{post.commentCount || 0} comments</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShowComments(post)}
                      >
                        <FiMessageCircle className="w-4 h-4 mr-1" />
                        Comments
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (post.id && post.author?.username) {
                            handleDeletePost(post.id, post.author.username);
                          }
                        }}
                        disabled={deleteLoading === post.id}
                      >
                        {deleteLoading === post.id ? (
                          "Deleting..."
                        ) : (
                          <>
                            <FiTrash2 className="w-4 h-4 mr-1" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Comments Panel */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Comments {selectedPost && `for @${selectedPost.author?.username}'s post`}
            </h2>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {!selectedPost ? (
              <div className="p-4 text-center text-gray-500">
                Select a post to view its comments
              </div>
            ) : commentsLoading ? (
              <div className="p-4 text-center text-gray-500">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No comments found</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          @{comment.author?.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        {comment.content}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteComment(comment.id!)}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              variant="outline"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing page <span className="font-medium">{currentPage + 1}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
