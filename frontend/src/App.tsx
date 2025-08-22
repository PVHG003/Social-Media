import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfilePage from "./pages/UserProfilePage";
import { ChatPage } from "./pages/chat/ChatPage";
import { ChatContext, ChatProvider } from "./context/chat/chatContext";

function App() {
  return (
    <Router>
      <Routes>
        {/* User Profile Routes */}
        <Route path="/profile/:userId" element={<UserProfilePage />} />

        {/* Other routes */}
        {/* ... */}
        <Routes>
          {/* User Profile Routes */}
          <Route path="/profile/:userId" element={<UserProfilePage />} />

          {/* Other routes */}
          {/* ... */}
        </Routes>
      </Routes>
    </Router>
  );
}

export default App;
