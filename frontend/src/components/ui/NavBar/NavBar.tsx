/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HiHome } from "react-icons/hi";
import { GoBell } from "react-icons/go";
import { MdAccountCircle } from "react-icons/md";
import { FaAngleDown, FaPowerOff } from "react-icons/fa";
import { AiOutlineMessage, AiOutlineSearch, AiOutlineLogin } from "react-icons/ai";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/authentication/AuthContext";
import userApi from "../../../services/user/apiUser";

interface TopHeaderProps {
  fullName?: string;
  username?: string;
  userAvatar?: string;
  userId?: string;
  isAuthenticated?: boolean;
}

function TopHeader({
  fullName ,
  username,
  userAvatar,
  userId,
  isAuthenticated = true
}: TopHeaderProps) {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const {logout} = useAuth()!;

  // Refs for click outside detection
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 45) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle click outside for search results and user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close search results if clicking outside search container
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }

      // Close user menu if clicking outside user menu container
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search effect - only if authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        handleSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, isAuthenticated]);

  const handleSearch = async (query: string) => {
    if (!query.trim() || !isAuthenticated) return;

    setSearchLoading(true);
    try {
      const response = await userApi.searchUsers(query, { page: 0, size: 5 });
      setSearchResults(response.data || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (selectedUserId: string) => {
    navigate(`/profile/${selectedUserId}`);
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const handleProfileNavigation = () => {
    navigate(`/profile/me`);
    setShowMenu(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogout = async () => {
    // Add logout logic here
    setShowMenu(false);
    await logout();
  };

  const getProfileImageSrc = (profileImagePath?: string | null): string => {
    if (!profileImagePath || profileImagePath.trim() === '') {
      return '/default-avatar.png';
    }
    return profileImagePath;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/default-avatar.png';
  };

  return (
    <div
      className={`${
        scroll
          ? "max-w-3xl mx-auto w-full flex items-center justify-around py-2 px-3 sticky top-2 z-50 bg-black rounded-xl shadow-xl transition-all duration-300"
          : "mx-auto w-full flex items-center justify-around py-3 px-4 sticky top-0 z-50 bg-black transition-all duration-300"
      }`}
    >
      {/* logo and Search input */}
      <span className="w-auto lg:w-1/3 flex items-center justify-left relative">
        <span
          className="lg:w-10 lg:h-8 w-7 h-7 bg-white rounded-2xl shadow-md mx-1 lg:mx-3 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform"
          onClick={() => navigate("/")}
        >
          <span
            className="lg:w-4 lg:h-4 w-3 h-3 bg-black cursor-pointer rounded-sm"
            onClick={() => navigate("/")}
          ></span>
        </span>
        
        {/* Search Container - Only show if authenticated - Made smaller */}
        {isAuthenticated && (
          <span className="lg:mx-3 lg:flex hidden w-full relative">
            <div className="relative w-full" ref={searchContainerRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="bg-gray-700 hidden lg:flex w-full h-8 outline-none border-2 text-gray-300 px-10 text-sm border-gray-700 shadow-lg rounded-md focus:border-blue-500 transition-colors"
                placeholder="Search users..."
              />
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
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
                            className="w-10 h-10 rounded-full object-cover mr-3"
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

      {/* menu buttons - Some only show if authenticated */}
      <span className="w-auto lg:w-1/3 flex items-center justify-center">
        <HiHome
          className="text-white cursor-pointer text-lg lg:text-xl mx-2 lg:mx-4 hover:text-blue-400 hover:scale-110 transition-all"
          onClick={() => navigate("/")}
        />
        {isAuthenticated && (
          <>
            <AiOutlineMessage className="text-white cursor-pointer text-lg lg:text-xl mx-2 lg:mx-4 hover:text-blue-400 hover:scale-110 transition-all" />
            <GoBell className="text-white cursor-pointer text-lg lg:text-xl mx-2 lg:mx-4 hover:text-blue-400 hover:scale-110 transition-all" />
          </>
        )}
      </span>

      {/* user menu or login buttons */}
      <span className="w-auto lg:w-1/3 flex items-center justify-start md:justify-end cursor-pointer p-1 relative z-50">
        {isAuthenticated ? (
          <div ref={userMenuRef} className="flex items-center">
            {/* Authenticated User Menu */}
            <div
              className="flex items-center mr-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setShowMenu(!showMenu)}
            >
              <img
                src={userAvatar}
                alt={fullName}
                className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-white shadow-md mr-1 lg:mr-2"
              />
              <span className="text-white font-medium text-xs lg:text-sm hidden md:block truncate max-w-24 lg:max-w-32">
                {fullName}
              </span>
            </div>

            <span
              className="w-6 lg:w-8 h-6 lg:h-8 shadow-md bg-black/70 flex items-center justify-center rounded-md hover:bg-black/80 transition-colors"
              onClick={() => setShowMenu(!showMenu)}
            >
              <FaAngleDown
                className={`text-white text-xs lg:text-sm transition-transform ${
                  showMenu ? "rotate-180" : ""
                }`}
              />
            </span>

            {/* dropdown menu */}
            {showMenu && (
              <div className="absolute w-full md:w-40 shadow-xl top-10 right-0 flex items-center justify-center flex-col rounded-lg overflow-hidden">
                {/* User Info in Dropdown */}
                <div className="w-40 h-12 bg-black/95 shadow flex items-center justify-start px-3 border-b border-gray-700">
                  <img
                    src={userAvatar}
                    alt={fullName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-500 mr-2"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-white text-xs font-bold truncate">{fullName}</span>
                    <span className="text-gray-400 text-xs truncate">@{username}</span>
                  </div>
                </div>

                <li
                  className="w-40 h-10 bg-black/90 shadow flex items-center justify-start list-none px-3 text-white text-xs font-bold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                  onClick={handleProfileNavigation}
                >
                  <MdAccountCircle fontSize={14} className="mr-2" />
                  View Profile
                </li>
                <li
                  className="w-40 h-10 bg-black/90 shadow flex items-center justify-start list-none px-3 text-white text-xs font-bold hover:bg-gray-800 transition-all duration-300 cursor-pointer"
                  onClick={handleLogout}
                >
                  <FaPowerOff fontSize={14} className="mr-2" />
                  Log Out
                </li>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Login/Register Buttons for Unauthenticated Users */}
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
        )}
      </span>
    </div>
  );
}

export default TopHeader;