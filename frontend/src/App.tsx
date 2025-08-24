import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChatLayout from "./components/chat/ChatLayout";
import UserProfilePage from "./pages/user/UserProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profile/:userId" element={<UserProfilePage />} />

        {/* Other routes */}
        {/* ... */}

        {/* Login Page and AuthProvider are for testing, can be deleted */}
        <Route path="/chat" element={<ChatLayout />}>
          {/* <Route path=":chatId" element={<ChatPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
