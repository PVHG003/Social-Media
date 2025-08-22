import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfilePage from './pages/UserProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* User Profile Routes */}
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/profile/:username" element={<UserProfilePage />} />
        
        {/* Other routes */}
        {/* ... */}
      </Routes>
    </Router>
  );
}

export default App;
