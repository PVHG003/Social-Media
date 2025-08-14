import {Route, Routes} from "react-router-dom";
import LoginPage from "@/pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import UserListPage from "@/pages/UserListPage.tsx";

const App = () => {
    return (
        <Routes>
            <Route path={"/login"} element={<LoginPage/>}/>
            <Route path={"/register"} element={<RegisterPage/>}/>
            <Route path={"/user-list"} element={<UserListPage/>}/>
            <Route path={"/chat/:chatId"} element={<ChatPage/>}/>
        </Routes>
    )
}

export default App;