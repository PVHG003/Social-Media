import ChatLayout from "@/components/chat/ChatLayout";
import { ChatProvider } from "@/context/chatContext";
import { ModalProvider } from "@/context/userModalContext";
import ChatPage from "@/pages/ChatPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import type { FunctionComponent } from "react";
import { Route, Routes } from "react-router-dom";

interface AppRouteProps {}

const AppRoute: FunctionComponent<AppRouteProps> = () => {
  return (
    <Routes>
      {/* Auth route */}

      <Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* chat route */}

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
  );
};

export default AppRoute;
