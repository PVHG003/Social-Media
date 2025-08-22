import { HiHome } from "react-icons/hi";
import { GoBell } from "react-icons/go";
import { MdAccountCircle } from "react-icons/md";
import { FaAngleDown, FaPowerOff } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


interface TopHeaderProps {
  username?: string;
  userAvatar?: string;
  userId?: string;
}

function TopHeader({
  username,
  userAvatar,
  userId = "user1"
}: TopHeaderProps) {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [scroll, setScroll] = useState<boolean>(false);
  const navigate = useNavigate();

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

  const handleProfileNavigation = () => {
    navigate(`/users/profile/${userId}`);
    setShowMenu(false);
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    setShowMenu(false);
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
      <span className="w-auto lg:w-2/6 flex items-center justify-center relative">
        <span
          className="lg:w-10 lg:h-8 w-7 h-7 bg-white rounded-2xl shadow-md mx-1 lg:mx-3 cursor-pointer flex items-center justify-center hover:scale-110 transition-transform"
          onClick={() => navigate("/")}
        >
          <span
            className="lg:w-4 lg:h-4 w-3 h-3 bg-black cursor-pointer rounded-sm"
            onClick={() => navigate("/")}
          ></span>
        </span>
        <span className="lg:mx-3 lg:flex hidden w-full">
          <input
            type="text"
            className="bg-gray-700 hidden lg:flex w-11/12 sm:w-full md:w-1/2 h-8 outline-none border-2 text-gray-300 px-3 text-sm border-gray-700 shadow-lg rounded-md focus:border-blue-500 transition-colors"
            placeholder="#Explore"
          />
        </span>
        <span
          className="absolute left-7 top-0 lg:block hidden w-1 h-6 bg-black -rotate-45 cursor-pointer"
          onClick={() => navigate("/")}
        ></span>
      </span>

      {/* menu buttons */}
      <span className="w-auto lg:w-2/6 flex items-center justify-center">
        <HiHome
          className="text-white cursor-pointer text-lg lg:text-xl mx-2 lg:mx-4 hover:text-blue-400 hover:scale-110 transition-all"
          onClick={() => navigate("/")}
        />
        <AiOutlineMessage className="text-white cursor-pointer text-lg lg:text-xl mx-2 lg:mx-4 hover:text-blue-400 hover:scale-110 transition-all" />
        <GoBell className="text-white cursor-pointer text-lg lg:text-xl mx-2 lg:mx-4 hover:text-blue-400 hover:scale-110 transition-all" />
      </span>

      {/* user menu */}
      <span className="w-auto md:w-2/6 flex items-center justify-start md:justify-end cursor-pointer p-1 relative z-50">
        {/* User Avatar and Name */}
        <div
          className="flex items-center mr-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => setShowMenu(!showMenu)}
        >
          <img
            src={userAvatar}
            alt={username}
            className="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-cover border-2 border-white shadow-md mr-1 lg:mr-2"
          />
          <span className="text-white font-medium text-xs lg:text-sm hidden md:block">
            {username}
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
                alt={username}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-500 mr-2"
              />
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold">{username}</span>
                <span className="text-gray-400 text-xs">@{userId}</span>
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
      </span>
    </div>
  );
}

export default TopHeader;