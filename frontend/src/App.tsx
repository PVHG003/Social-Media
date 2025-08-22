import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfilePage from "./pages/user/UserProfilePage";
import { ChatPage } from "./pages/chat/ChatPage";
import { ChatProvider } from "./context/chat/chatContext";
import ChatLayout from "./components/chat/ChatLayout";

// Tạo component wrapper cho chat routes
const ChatRoutes = () => {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile/:userId" element={<UserProfilePage />} />
        
        <Route path="/chat" element={<ChatRoutes />}>
          <Route path=":chatId" element={<ChatPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
