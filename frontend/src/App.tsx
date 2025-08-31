import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import UserProfilePage from "./pages/user/UserProfilePage";
import HomePage from "./pages/post/HomePage";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import { AuthProvider } from "./context/authentication/AuthContext";
import VerifyPage from "./pages/authentication/VerifyPage";
import ForgotPasswordPage from "./pages/authentication/ForgotPasswordPage";
import ResetPasswordPage from "./pages/authentication/ResetPasswordPage";
import ChangePasswordForm from "./components/authentication/ChangePasswordForm";
import ChatsPage from "./pages/chat/ChatsPage";
import { ChatProvider } from "./hooks/chat/useChat";
import { MessageProvider } from "./hooks/chat/useMessage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/profile/:userId" element={<UserProfilePage />} />
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/forget" element={<ForgotPasswordPage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordForm />} />

          <Route
            path="/chats"
            element={
              <ChatProvider>
                <MessageProvider>
                  <Outlet />
                </MessageProvider>
              </ChatProvider>
            }
          >
            <Route index element={<ChatsPage />} />
            <Route path=":chatId" element={<ChatsPage />} />
          </Route>

          {/* Other routes */}
          {/* <Route path="/forbidden" element={<ForbiddenPage />} /> */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
          {/* ... */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
