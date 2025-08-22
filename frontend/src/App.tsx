import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfilePage from "./pages/user/UserProfilePage";
import { ChatPage } from "./pages/chat/ChatPage";
import { ChatProvider } from "./context/chat/ChatContext";
import ChatLayout from "./components/chat/ChatLayout";
import { AuthProvider } from "./context/chat/test/AuthContext";
import LoginPage from "./pages/chat/test/LoginPage";
import { ModalProvider } from "./context/chat/userListModal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile/:userId" element={<UserProfilePage />} />

        {/* Other routes */}
        {/* ... */}

        {/* Login Page and AuthProvider are for testing, can be deleted */}
        <AuthProvider>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/chat"
            element={
              <ChatProvider>
                <ModalProvider>
                  <ChatLayout />
                </ModalProvider>
              </ChatProvider>
            }
          >
            <Route path=":chatId" element={<ChatPage />} />
          </Route>
        </AuthProvider>
      </Routes>
    </Router>
  );
}

export default App;
