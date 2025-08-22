import UserProfile from '../components/ui/UserProfile/UserProfile';

const UserProfilePage = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1">
        <UserProfile />
      </main>
    </div>
  );
};

export default UserProfilePage;