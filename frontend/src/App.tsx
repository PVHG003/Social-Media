import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatLayout from "./components/chat/ChatLayout";
import UserProfilePage from "./pages/user/UserProfilePage";
import ChatPage from "./pages/chat/ChatPage";
import { ChatProvider } from "./context/chat/ChatContext";
import HomePage from "./pages/post/HomePage";

function App() {
  return (
    // <AuthProvider>
      <Router>
        <Routes>
          <Route path="/profile/:userId" element={<UserProfilePage />} />
        <Route path="/" element={<HomePage />} />


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
  );
}

export default App;
