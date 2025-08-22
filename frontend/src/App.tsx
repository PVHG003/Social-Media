import { Route, Routes } from "react-router-dom";
import { ChatPage } from "./pages/chat/ChatPage";
import { ChatContext, ChatProvider } from "./context/chat/chatContext";

function App() {
  return (
    <Routes>
      <ChatProvider>
        <Routes>
          <Route path="/chat" element={<ChatLayout />}>
            <Route path=":chatId" element={<ChatPage />} />
          </Route>
        </Routes>
      </ChatProvider>
    </Routes>
  );
}

export default App;
