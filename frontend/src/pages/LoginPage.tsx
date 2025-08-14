import axios from "axios";
import * as React from "react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);

        try {
            const loginResponse = await axios.post("http://localhost:8080/api/v1/auth/login", formData);

            const {success, data: responseData} = loginResponse.data;

            if (success) {
                console.log("Login successful:", responseData);

                const {token, user: authenticatedUser} = responseData;

                localStorage.setItem("authToken", token);
                localStorage.setItem("userData", JSON.stringify(authenticatedUser));

                navigate("/user-list");
            }
        } catch (error) {
            console.log(error);
        }
    };

    function handleFormChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={submitForm}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" onChange={(e) => handleFormChange(e)}/>
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" onChange={(e) => handleFormChange(e)}/>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;