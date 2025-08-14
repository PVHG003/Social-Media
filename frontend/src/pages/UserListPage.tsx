import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

interface User {
    id: string;
    username: string;
    profileImage: string | null;
}

const UserListPage = () => {
    const [userList, setUserList] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fetchedRef = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8080/api/v1/users");
                const data = response.data;

                if (data.success) {
                    setUserList(data.data);
                    console.log(`API returned ${data.data.length} users`);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                setError("Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);
    useEffect(() => {
        console.log(`Current userList has ${userList.length} entries`);
    }, [userList]);


    if (loading) return <div>Loading users...</div>;
    if (error) return <div>Error: {error}</div>;

    const createChat = async (userId: string) => {
        const formData = new FormData();
        formData.append("request", new Blob([JSON.stringify({
            name: `Private Chat ${getUserData().id}-${userId}`,
            type: "PRIVATE",
            ownerId: getUserData().id,
            memberIds: [getUserData().id, userId]
        })], {type: "application/json"}));

        try {
            const response = await axios.post(
                "http://localhost:8080/api/v1/chats",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        "Content-Type": "multipart/form-data",
                        withCredentials: true
                    }
                }
            );
            if (response.data.success) {
                console.log("Chat created successfully:", response.data.data);
                // navigate(`/chat/${response.data.data.id}`);
            } else {
                console.error("Failed to create chat:", response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUserData = () => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            return JSON.parse(userData);
        }
    };

    return (
        <div>
            <h1>User List</h1>
            <h2>Welcome, {getUserData().username}</h2>
            {userList.map((user) => (
                <div key={user.id}>
                    <p>{user.username}</p>
                    {user.profileImage && (
                        <img src={user.profileImage} alt={user.username}/>
                    )}
                    <button onClick={() => createChat(user.id)}>Create Chat</button>
                </div>
            ))}
        </div>
    );
};

export default UserListPage;