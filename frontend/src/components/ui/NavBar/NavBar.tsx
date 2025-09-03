/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HiHome } from "react-icons/hi";
import { GoBell } from "react-icons/go";
import { MdAccountCircle, MdAdminPanelSettings } from "react-icons/md";
import { FaAngleDown, FaPowerOff } from "react-icons/fa";
import { AiOutlineMessage, AiOutlineSearch, AiOutlineLogin } from "react-icons/ai";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authentication/AuthContext";
import userApi from "../../../services/user/apiUser";
import { userProfileEvents } from "../../../utils/userEvents";

function TopHeader() {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [userDataLoading, setUserDataLoading] = useState<boolean>(false);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const authContext = useAuth();

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!authContext?.token && !isLoggingOut;
  
  // Listen for profile update events
  useEffect(() => {
    const unsubscribe = userProfileEvents.subscribe(() => {
      if (isAuthenticated && !isLoggingOut) {
        setForceRefresh(prev => prev + 1);
        setCurrentUserData(null);
      }
    });
    return unsubscribe;
  }, [isAuthenticated, isLoggingOut]);

  // Get user data from context or fetch
  const getUserData = () => {
    if (authContext?.user && isAuthenticated && !isLoggingOut) {
      return {
        fullName: `${authContext.user.firstName || ''} ${authContext.user.lastName || ''}`.trim(),
        username: authContext.user.username || '',
        userAvatar: authContext.user.profileImagePath || '',
        userId: authContext.user.id || ''
      };
    } else if (currentUserData && isAuthenticated && !isLoggingOut) {
      return {
        fullName: `${currentUserData.firstName || ''} ${currentUserData.lastName || ''}`.trim(),
        username: currentUserData.username || '',
        userAvatar: currentUserData.profileImagePath || '',
        userId: currentUserData.id || ''
      };
    } else {
      return { fullName: '', username: '', userAvatar: '', userId: '' };
    }
  };

  const { fullName, username, userAvatar, userId } = getUserData();

  // Memoize handleLogout to prevent recreation
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    setShowMenu(false);
    
    try {
      // Clear local component state immediately
      setCurrentUserData(null);
      setUserDataLoading(false);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
      setForceRefresh(0);
      
      // Call AuthContext logout (this will clear localStorage and context state)
      if (authContext?.logout) {
        await authContext.logout();
      }
      
      // Navigate to home page
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, ensure we clear everything
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate('/', { replace: true });
    } finally {
      // Reset logout flag
      setIsLoggingOut(false);
    }
  }, [isLoggingOut, authContext, navigate]);

  // Fetch current user data - FIXED dependency array
  useEffect(() => {
    let isMounted = true; // Track if component is still mounted
    
    const fetchCurrentUser = async () => {
      // Only fetch if we need to and not already loading
      if (
        !authContext?.token || 
        isLoggingOut ||
        userDataLoading ||
        (authContext?.user && currentUserData && forceRefresh === 0)
      ) {
        return;
      }

      setUserDataLoading(true);
      try {
        const response = await userApi.getCurrentUser();
        if (isMounted && !isLoggingOut) {
          setCurrentUserData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
        if (isMounted && !isLoggingOut && error && typeof error === 'object' && 'message' in error) {
          const errorMessage = (error as any).message;
          if (errorMessage?.includes('401') || errorMessage?.includes('Unauthorized')) {
            // Token is invalid, logout
            handleLogout();
          }
        }
      } finally {
        if (isMounted && !isLoggingOut) {
          setUserDataLoading(false);
        }
      }
    };

    fetchCurrentUser();

    return () => {
      isMounted = false; // Cleanup flag
    };
  }, [authContext?.token, forceRefresh, isLoggingOut, handleLogout]); // Removed problematic dependencies

  // Clear data when not authenticated
  useEffect(() => {
    if (!authContext?.token) {
      setCurrentUserData(null);
      setUserDataLoading(false);
      setSearchQuery("");
      setSearchResults([]);
      setShowSearchResults(false);
      setShowMenu(false);
      setForceRefresh(0);
      setIsLoggingOut(false); // Reset logout state when not authenticated
    }
  }, [authContext?.token]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScroll(offset > 45);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!isAuthenticated || isLoggingOut) return;
    
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        handleSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, isAuthenticated, isLoggingOut]);

  const handleSearch = async (query: string) => {
    if (!query.trim() || !isAuthenticated || isLoggingOut) return;
    setSearchLoading(true);
    try {
      const response = await userApi.searchUsers(query, { page: 0, size: 5 });
      if (!isLoggingOut) {
        setSearchResults(response.data || []);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      if (!isLoggingOut) {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } finally {
      if (!isLoggingOut) {
        setSearchLoading(false);
      }
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggingOut) {
      setSearchQuery(e.target.value);
    }
  };

  const handleUserSelect = (selectedUserId: string) => {
    if (!isLoggingOut) {
      navigate(`/profile/${selectedUserId}`);
      setSearchQuery("");
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleProfileNavigation = () => {
    if (isLoggingOut) return;
    
    if (authContext?.user?.id) {
      navigate(`/profile/${authContext.user.id}`);
    } else if (currentUserData?.id) {
      navigate(`/profile/${currentUserData.id}`);
    } else {
      navigate(`/profile/me`);
    }
    setShowMenu(false);
  };

  const handleLogin = () => {
    if (!isLoggingOut) {
      navigate("/login");
    }
  };

  const handleRegister = () => {
    if (!isLoggingOut) {
      navigate("/register");
    }
  };

  const getProfileImageSrc = (profileImagePath?: string | null): string => {
    if (!profileImagePath || profileImagePath.trim() === '') {
      return 'http://localhost:8080/uploads/images/default-avatar.png';
    }
    return profileImagePath.startsWith('http') ? profileImagePath : `http://localhost:8080${profileImagePath}`;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'http://localhost:8080/uploads/images/default-avatar.png';
  };

  const showUserDataLoading = isAuthenticated && !fullName && userDataLoading && !isLoggingOut;

  return (
    <div
      className={`${
        scroll
          ? "max-w-3xl mx-auto w-full flex items-center justify-around py-2 px-3 sticky top-2 z-50 bg-black rounded-xl shadow-xl transition-all duration-300"
          : "mx-auto w-full flex items-center justify-around py-3 px-4 sticky top-0 z-50 bg-black transition-all duration-300"
      }`}
    >
      {/* Logo and Search */}
      <span className="w-auto lg:w-1/3 flex items-center justify-left relative">
        <span
          className="lg:w-10 lg:h-8 w-7 h-7 bg-white rounded-2xl shadow-md mx-1 lg:mx-3 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform"
          onClick={() => !isLoggingOut && navigate("/")}
        >
          <span
            className="lg:w-4 lg:h-4 w-3 h-3 bg-black cursor-pointer rounded-sm"
            onClick={() => !isLoggingOut && navigate("/")}
          ></span>
        </span>
        
        {isAuthenticated && !isLoggingOut && (
          <span className="lg:mx-3 lg:flex hidden w-full relative">
            <div className="relative w-full" ref={searchContainerRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="bg-gray-700 hidden lg:flex w-full h-8 outline-none border-2 text-gray-300 px-10 text-sm border-gray-700 shadow-lg rounded-md focus:border-blue-500 transition-colors"
                placeholder="Search users..."
                disabled={isLoggingOut}
              />
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              
              {/* Search Results */}
              {showSearchResults && !isLoggingOut && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-80 overflow-y-auto z-50">
                  {searchLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Searching...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user.id)}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <img
                            src={getProfileImageSrc(user.profileImagePath)}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-10 h-10 rounded-full object-cover mr-3 bg-white"
                            onError={handleImageError}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {user.firstName} {user.lastName}
                            </h4>
                            <p className="text-gray-500 text-xs">@{user.username}</p>
                          </div>
                          {user.isFollowing && (
                            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              Following
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No users found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </span>
        )}
      </span>

      {/* Navigation */}
      <span className="w-auto lg:w-1/3 flex items-center justify-center">
        <HiHome
          className="text-white cursor-pointer text-lg lg:text-xl mx-2 lg:mx-4 hover:text-blue-400 hover:scale-110 transition-all"
          onClick={() => !isLoggingOut && navigate("/")}
        />
        {isAuthenticated && !isLoggingOut && (
          <>
            <AiOutlineMessage 
              className="text-white cursor-pointer text-lg lg:text-xl mx-2 lg:mx-4 hover:text-blue-400 hover:scale-110 transition-all" 
              onClick={() => navigate("/chat")}
            />
            <GoBell 
              className="text-white cursor-pointer text-lg lg:text-xl mx-2 lg:mx-4 hover:text-blue-400 hover:scale-110 transition-all"
              onClick={() => navigate("/notifications")}
            />
          </>
        )}
      </span>

      {/* User Menu */}
      <span className="w-auto lg:w-1/3 flex items-center justify-start md:justify-end cursor-pointer p-1 relative z-50">
        {isAuthenticated && !isLoggingOut ? (
          <div ref={userMenuRef} className="flex items-center">
            {showUserDataLoading ? (
              <div className="flex items-center">
                <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-gray-300 animate-pulse mr-2"></div>
                <span className="text-white text-xs lg:text-sm">Loading...</span>
              </div>
            ) : (
              <>
                <div
                  className="flex items-center mr-2 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => !isLoggingOut && setShowMenu(!showMenu)}
                >
                  <img
                    src={getProfileImageSrc(userAvatar)}
                    alt={fullName || 'User'}
                    className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-white shadow-md mr-1 lg:mr-2 bg-white"
                    onError={handleImageError}
                  />
                  <span className="text-white font-medium text-xs lg:text-sm hidden md:block truncate max-w-24 lg:max-w-32">
                    {fullName || 'User'}
                  </span>
                </div>

                <span
                  className="w-6 lg:w-8 h-6 lg:h-8 shadow-md bg-black/70 flex items-center justify-center rounded-md hover:bg-black/80 transition-colors"
                  onClick={() => !isLoggingOut && setShowMenu(!showMenu)}
                >
                  <FaAngleDown
                    className={`text-white text-xs lg:text-sm transition-transform ${
                      showMenu ? "rotate-180" : ""
                    }`}
                  />
                </span>

                {/* Dropdown */}
                {showMenu && !isLoggingOut && (
                  <div className="absolute w-full md:w-40 shadow-xl top-10 right-0 flex items-center justify-center flex-col rounded-lg overflow-hidden">
                    <div className="w-40 h-12 bg-black/95 shadow flex items-center justify-start px-3 border-b border-gray-700">
                      <img
                        src={getProfileImageSrc(userAvatar)}
                        alt={fullName || 'User'}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-500 mr-2"
                        onError={handleImageError}
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-white text-xs font-bold truncate">{fullName || 'User'}</span>
                        <span className="text-gray-400 text-xs truncate">@{username || 'username'}</span>
                      </div>
                    </div>

                    <div
                      className="w-40 h-10 bg-black/90 shadow flex items-center justify-start list-none px-3 text-white text-xs font-bold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                      onClick={handleProfileNavigation}
                    >
                      <MdAccountCircle fontSize={14} className="mr-2" />
                      View Profile
                    </div>
                    {authContext?.authUser?.role === 'admin' && (
                      <div
                        className="w-40 h-10 bg-black/90 shadow flex items-center justify-start list-none px-3 text-white text-xs font-bold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                        onClick={() => {
                          navigate('/admin');
                          setShowMenu(false);
                        }}
                      >
                        <MdAdminPanelSettings fontSize={14} className="mr-2" />
                        Admin Panel
                      </div>
                    )}
                    <div
                      className="w-40 h-10 bg-black/90 shadow flex items-center justify-start list-none px-3 text-white text-xs font-bold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <FaPowerOff fontSize={14} className="mr-2" />
                      {isLoggingOut ? 'Logging out...' : 'Log Out'}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          !isLoggingOut && (
            <>
              <button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors mr-2 flex items-center"
              >
                <AiOutlineLogin className="mr-1 lg:mr-2" />
                Login
              </button>
              
              <button
                onClick={handleRegister}
                className="bg-transparent hover:bg-white/10 text-white border border-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center"
              >
                Sign Up
              </button>
            </>
          )
        )}
      </span>
    </div>
  );
}

export default TopHeader;