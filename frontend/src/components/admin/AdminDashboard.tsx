import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiFileText, FiBarChart } from "react-icons/fi";
import { adminService } from "../../services/admin/adminService";
import postApi from "../../services/post/apiPost";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalPosts, setTotalPosts] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch total users
        const usersResponse = await adminService.getAllUsers(0, 1);
        setTotalUsers(usersResponse.totalElements);

        // Fetch total posts
        const postsResponse = await postApi.getAllPosts(0, 1);
        setTotalPosts(postsResponse.totalElements || 0);
        
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome to the admin panel. Manage users and posts from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Management Card */}
        <Link
          to="/admin/users"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">User Management</h2>
              <p className="text-sm text-gray-500">
                View and manage user accounts. Delete users if necessary.
              </p>
            </div>
          </div>
        </Link>

        {/* Post Management Card */}
        <Link
          to="/admin/posts"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">Post Management</h2>
              <p className="text-sm text-gray-500">
                Manage posts and comments. Remove inappropriate content.
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <FiUsers className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "Loading..." : totalUsers?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <FiFileText className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Posts</p>
              <p className="text-lg font-semibold text-gray-900">
                {loading ? "Loading..." : totalPosts?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <FiBarChart className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Activity Today</p>
              <p className="text-lg font-semibold text-gray-900">N/A</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
