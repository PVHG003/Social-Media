import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatLayout from "./components/chat/ChatLayout";
import UserProfilePage from "./pages/user/UserProfilePage";
import ChatPage from "./pages/chat/ChatPage";
import { ChatProvider } from "./context/chat/ChatContext";
import HomePage from "./pages/post/HomePage";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import { AuthProvider } from "./context/authentication/AuthContext";
import VerifyPage from "./pages/authentication/VerifyPage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage";
import ChangePasswordForm from "./components/authentication/ChangePasswordForm";

function App() {
  return (
    // <AuthProvider>
      <Router>
        <Routes>
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />}/>
          <Route path="/forget" element={<ForgotPasswordPage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordForm />} />
          
          {/* Other routes */}
          {/* ... */}

          {/* Login Page and AuthProvider are for testing, can be deleted */}
          <Route
            path="/chat"
            element={
              <ChatProvider>
                <ChatLayout />
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
