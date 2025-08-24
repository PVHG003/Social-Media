import React from 'react';
import { 
  AiOutlineUser, 
  AiOutlineTeam, 
  AiOutlineShop, 
  AiOutlineCalendar,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { FiBookmark, FiMapPin } from 'react-icons/fi';
import { BiGroup, BiGame, BiVideo } from 'react-icons/bi';

interface LeftSidebarProps {
  currentUser: any;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ currentUser }) => {
  const menuItems = [
    {
      icon: <AiOutlineUser className="w-6 h-6" />,
      label: 'Profile',
      link: '#',
      active: false
    },
    {
      icon: <AiOutlineTeam className="w-6 h-6" />,
      label: 'Friends',
      link: '#',
      active: false,
      badge: '12'
    },
    {
      icon: <BiGroup className="w-6 h-6" />,
      label: 'Groups',
      link: '#',
      active: false,
      badge: '3'
    },
    {
      icon: <AiOutlineShop className="w-6 h-6" />,
      label: 'Marketplace',
      link: '#',
      active: false
    },
    {
      icon: <FiBookmark className="w-6 h-6" />,
      label: 'Saved',
      link: '#',
      active: false
    },
    {
      icon: <AiOutlineCalendar className="w-6 h-6" />,
      label: 'Events',
      link: '#',
      active: false,
      badge: '2'
    },
    {
      icon: <AiOutlineClockCircle className="w-6 h-6" />,
      label: 'Memories',
      link: '#',
      active: false
    },
    {
      icon: <BiGame className="w-6 h-6" />,
      label: 'Gaming',
      link: '#',
      active: false
    },
    {
      icon: <BiVideo className="w-6 h-6" />,
      label: 'Watch',
      link: '#',
      active: false
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      label: 'Check-ins',
      link: '#',
      active: false
    }
  ];

  const shortcuts = [
    {
      name: 'JavaScript Developers',
      image: '🚀',
      members: '12.5k members',
      type: 'group'
    },
    {
      name: 'Photography Club',
      image: '📸',
      members: '8.2k members', 
      type: 'group'
    },
    {
      name: 'Travel Enthusiasts',
      image: '✈️',
      members: '15.8k members',
      type: 'group'
    },
    {
      name: 'Fitness & Health',
      image: '💪',
      members: '9.3k members',
      type: 'group'
    }
  ];

  return (
    <div className="sticky top-20">
      {/* User Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {currentUser?.firstName?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
            </h3>
            <p className="text-gray-600 text-sm">@{currentUser?.username || 'username'}</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="font-bold text-gray-900">142</div>
            <div className="text-xs text-gray-500">Posts</div>
          </div>
          <div>
            <div className="font-bold text-gray-900">1.2k</div>
            <div className="text-xs text-gray-500">Friends</div>
          </div>
          <div>
            <div className="font-bold text-gray-900">89</div>
            <div className="text-xs text-gray-500">Photos</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <h4 className="font-bold text-gray-900 text-lg mb-4">Menu</h4>
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                item.active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>

      {/* Your Shortcuts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">Your Shortcuts</h4>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Edit
          </button>
        </div>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                {shortcut.image}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">
                  {shortcut.name}
                </div>
                <div className="text-sm text-gray-500">
                  {shortcut.members}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;