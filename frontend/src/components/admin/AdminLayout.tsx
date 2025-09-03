import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authentication/AuthContext";
import { FiUsers, FiFileText, FiLogOut } from "react-icons/fi";
import { Button } from "../ui/button";

export default function AdminLayout() {
  const { user, authUser, logout } = useAuth();
  const navigate = useNavigate();

  // Kiểm tra quyền admin
  if (!user || !authUser || authUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.username}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <FiLogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen border-r">
          <div className="p-4">
            <div className="space-y-2">
              <Link
                to="/admin"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiFileText className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiUsers className="w-5 h-5 mr-3" />
                User Management
              </Link>
              <Link
                to="/admin/posts"
                className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiFileText className="w-5 h-5 mr-3" />
                Post Management
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
