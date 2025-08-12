## **API Routes**

### **Authentication**

| Method   | Route                                        | Description                     |
|----------|----------------------------------------------|---------------------------------|
| **POST** | `/api/auth/login`                            | Log in a user                   |
| **POST** | `/api/auth/register`                         | Register a new user             |
| **POST** | `/api/auth/send-code?email={email}`          | Send verification code to email |
| **POST** | `/api/auth/resend-code?email={email}`        | Resend verification code        |
| **POST** | `/api/auth/verify?email={email}&code={code}` | Verify email with code          |
| **POST** | `/api/auth/forget?email={email}`             | Initiate password reset         |
| **POST** | `/api/auth/reset`                            | Reset password using token      |
| **POST** | `/api/auth/logout`                           | Invalidate current token        |

### User

| Method     | Route                            | Description                        |
|------------|----------------------------------|------------------------------------|
| **GET**    | `/api/users/me`                  | Get current logged-in user profile |
| **PATCH**  | `/api/users/me`                  | Update logged-in user profile      |
| **GET**    | `/api/users/{userId}`            | Get another user’s public profile  |
| **GET**    | `/api/users/{userId}/followers`  | Get followers list                 |
| **GET**    | `/api/users/{userId}/following`  | Get following list                 |
| **POST**   | `/api/users/{userId}/follow`     | Follow a user                      |
| **DELETE** | `/api/users/{userId}/follow`     | Unfollow a user                    |
| **GET**    | `/api/users/search?query={name}` | Search for users                   |

### **Post**

| Method     | Route                       | Description                  |
|------------|-----------------------------|------------------------------|
| **POST**   | `/api/posts`                | Create a post                |
| **GET**    | `/api/posts/{postId}`       | Get post details             |
| **PATCH**  | `/api/posts/{postId}`       | Update a post                |
| **DELETE** | `/api/posts/{postId}`       | Delete a post                |
| **GET**    | `/api/users/{userId}/posts` | Get posts by a specific user |

### **Like**

| Method     | Route                       | Description                    |
|------------|-----------------------------|--------------------------------|
| **POST**   | `/api/posts/{postId}/likes` | Like a post                    |
| **DELETE** | `/api/posts/{postId}/likes` | Unlike a post                  |
| **GET**    | `/api/posts/{postId}/likes` | Get all users who liked a post |

### **Feed**

| Method  | Route               | Description                     |
|---------|---------------------|---------------------------------|
| **GET** | `/api/feed`         | Get posts from followed users   |
| **GET** | `/api/feed/explore` | Get trending or suggested posts |

### **Chat**

| Method     | Route                          | Description                    |
|------------|--------------------------------|--------------------------------|
| **GET**    | `/api/chats`                   | Get list of chat conversations |
| **POST**   | `/api/chats`                   | Start a new chat               |
| **GET**    | `/api/chats/{chatId}`          | Get chat details               |
| **POST**   | `/api/chats/{chatId}/messages` | Send a message                 |
| **GET**    | `/api/chats/{chatId}/messages` | Get messages in a chat         |
| **DELETE** | `/api/chats/{chatId}`          | Delete a chat                  |

maybe

### **Notifications**

| Method     | Route                          | Description               |
|------------|--------------------------------|---------------------------|
| **GET**    | `/api/notifications`           | Get user notifications    |
| **PATCH**  | `/api/notifications/{id}/read` | Mark notification as read |
| **DELETE** | `/api/notifications/{id}`      | Delete a notification     |

### **Media Upload**

| Method     | Route                  | Description           |
|------------|------------------------|-----------------------|
| **POST**   | `/api/media/upload`    | Upload images/videos  |
| **DELETE** | `/api/media/{mediaId}` | Delete uploaded media |
