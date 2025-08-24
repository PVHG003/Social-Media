import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineSearch } from 'react-icons/ai';
import { FiTrendingUp, FiUsers, FiCalendar, FiMapPin } from 'react-icons/fi';
import {  BiTime } from 'react-icons/bi';

const RightSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'friends' | 'suggestions' | 'events'>('friends');

  // Mock data cho bạn bè online
  const onlineFriends = [
    {
      id: 1,
      name: 'Alice Johnson',
      avatar: '👩‍💻',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 2,
      name: 'Bob Smith',
      avatar: '👨‍🎨',
      status: 'online',
      lastSeen: 'Active 2m ago'
    },
    {
      id: 3,
      name: 'Carol Wilson',
      avatar: '👩‍🎓',
      status: 'away',
      lastSeen: 'Active 10m ago'
    },
    {
      id: 4,
      name: 'David Brown',
      avatar: '👨‍💼',
      status: 'online',
      lastSeen: 'Active now'
    },
    {
      id: 5,
      name: 'Emma Davis',
      avatar: '👩‍🏫',
      status: 'offline',
      lastSeen: 'Active 1h ago'
    }
  ];

  // Mock data cho gợi ý kết bạn
  const friendSuggestions = [
    {
      id: 1,
      name: 'Michael Chang',
      avatar: '👨‍💻',
      mutualFriends: 5,
      workplace: 'Tech Corp'
    },
    {
      id: 2,
      name: 'Sarah Miller',
      avatar: '👩‍🔬',
      mutualFriends: 3,
      workplace: 'University Lab'
    },
    {
      id: 3,
      name: 'James Wilson',
      avatar: '👨‍🎨',
      mutualFriends: 8,
      workplace: 'Design Studio'
    },
    {
      id: 4,
      name: 'Lisa Anderson',
      avatar: '👩‍🚀',
      mutualFriends: 2,
      workplace: 'Space Agency'
    }
  ];

  // Mock data cho trending topics
  const trendingTopics = [
    {
      tag: '#TechTrends2024',
      posts: '12.5k posts',
      growth: '+25%'
    },
    {
      tag: '#SustainableLiving',
      posts: '8.9k posts',
      growth: '+18%'
    },
    {
      tag: '#RemoteWork',
      posts: '15.2k posts',
      growth: '+32%'
    },
    {
      tag: '#ArtificialIntelligence',
      posts: '22.1k posts',
      growth: '+45%'
    },
    {
      tag: '#DigitalHealth',
      posts: '6.7k posts',
      growth: '+12%'
    }
  ];

  // Mock data cho events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Tech Meetup 2024',
      date: 'Mar 15',
      time: '6:00 PM',
      location: 'Downtown Convention Center',
      attendees: 245,
      image: '🎪'
    },
    {
      id: 2,
      title: 'Photography Workshop',
      date: 'Mar 18',
      time: '2:00 PM',
      location: 'Central Park',
      attendees: 89,
      image: '📸'
    },
    {
      id: 3,
      title: 'Startup Pitch Night',
      date: 'Mar 22',
      time: '7:00 PM',
      location: 'Business Hub',
      attendees: 156,
      image: '🚀'
    }
  ];

  return (
    <div className="sticky top-20 space-y-4">
      {/* Trending Topics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900 flex items-center">
            <FiTrendingUp className="w-5 h-5 mr-2 text-orange-500" />
            Trending
          </h4>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            See all
          </button>
        </div>
        <div className="space-y-3">
          {trendingTopics.slice(0, 5).map((topic, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer text-sm">
                  {topic.tag}
                </div>
                <div className="text-xs text-gray-500">
                  {topic.posts}
                </div>
              </div>
              <div className="text-xs text-green-600 font-medium">
                {topic.growth}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Friends & Suggestions Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiUsers className="w-4 h-4 inline mr-2" />
            Online
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <AiOutlinePlus className="w-4 h-4 inline mr-2" />
            Suggestions
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'friends' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {onlineFriends.filter(f => f.status === 'online').length} friends online
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <AiOutlineSearch className="w-4 h-4" />
                </button>
              </div>
              {onlineFriends.map((friend) => (
                <div key={friend.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                      {friend.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      friend.status === 'online' ? 'bg-green-500' : 
                      friend.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {friend.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {friend.lastSeen}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-3">
              <div className="text-sm text-gray-600 mb-3">
                People you may know
              </div>
              {friendSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                      {suggestion.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {suggestion.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {suggestion.mutualFriends} mutual friends
                      </div>
                      <div className="text-xs text-gray-500">
                        Works at {suggestion.workplace}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      Add Friend
                    </button>
                    <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900 flex items-center">
            <FiCalendar className="w-5 h-5 mr-2 text-purple-500" />
            Upcoming Events
          </h4>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            See all
          </button>
        </div>
        <div className="space-y-3">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border border-gray-100 rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-lg">
                  {event.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {event.title}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <BiTime className="w-3 h-3 mr-1" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <FiMapPin className="w-3 h-3 mr-1" />
                    {event.location}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {event.attendees} people interested
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h4 className="font-bold text-gray-900 mb-4">Your Activity</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">24</div>
            <div className="text-xs text-gray-500">Posts this week</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-xs text-gray-500">Total likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">89</div>
            <div className="text-xs text-gray-500">Comments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-xs text-gray-500">Shares</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;