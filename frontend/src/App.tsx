import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserProfilePage from "./pages/UserProfilePage";
import { ChatPage } from "./pages/chat/ChatPage";
import { ChatProvider } from "./context/chat/chatContext";
import ChatLayout from "./components/chat/ChatLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* User Profile Routes */}
        <Route path="/profile/:userId" element={<UserProfilePage />} />

        {/* Other routes */}
        {/* ... */}
        <ChatProvider>
          <Routes>
            <Route path="/chat" element={<ChatLayout />}>
              <Route path=":chatId" element={<ChatPage />} />
            </Route>
          </Routes>
        </ChatProvider>
      </Routes>
    </Router>
  );
}

export default App;
