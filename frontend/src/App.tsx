import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatLayout from "./components/chat/ChatLayout";
import { ChatProvider } from "./context/chat/ChatContext";
import { AuthProvider } from "./context/chat/test/AuthContext";
import { ModalProvider } from "./context/chat/userListModal";
import { ChatPage } from "./pages/chat/ChatPage";
import LoginPage from "./pages/chat/test/LoginPage";
import UserProfilePage from "./pages/user/UserProfilePage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/profile/:userId" element={<UserProfilePage />} />

          {/* Other routes */}
          {/* ... */}

          {/* Login Page and AuthProvider are for testing, can be deleted */}
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
