import { BASE_PATH } from "../../api/base";
import type { UserResponse } from "../../api";

class AdminService {
  async getAllUsers(page = 0, size = 10, search = ""): Promise<{ data: UserResponse[], totalPages: number, totalElements: number }> {
    const token = localStorage.getItem('token');
    let url = `${BASE_PATH}/api/users?page=${page}&size=${size}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    const result = await response.json();
    return {
      data: result.data || [],
      totalPages: result.totalPages || 0,
      totalElements: result.totalElements || 0
    };
  }

  async deleteUser(userId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_PATH}/api/users/admin/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }
  }

  async deletePost(postId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_PATH}/api/posts/admin/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete post');
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_PATH}/api/admin/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete comment');
    }
  }
}

export const adminService = new AdminService();
