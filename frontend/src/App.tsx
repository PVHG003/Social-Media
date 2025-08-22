import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfilePage from "./pages/user/UserProfilePage";
import { ChatPage } from "./pages/chat/ChatPage";
import { ChatProvider } from "./context/chat/ChatContext";
import ChatLayout from "./components/chat/ChatLayout";
import { AuthProvider } from "./context/test/AuthContext";
import LoginPage from "./pages/chat/test/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile/:userId" element={<UserProfilePage />} />

        {/* Other routes */}
        {/* ... */}

        {/* Login Page for testing, can be deleted */}
        <Route path="/login" element={<LoginPage />} />

        {/* Chat Provider for testing, can be deleted */}
        <AuthProvider>
          <ChatProvider>
            <Routes>
              <Route path="/chat" element={<ChatLayout />}>
                <Route path=":chatId" element={<ChatPage />} />
              </Route>
            </Routes>
          </ChatProvider>
        </AuthProvider>
      </Routes>
    </Router>
  );
}

export default App;
