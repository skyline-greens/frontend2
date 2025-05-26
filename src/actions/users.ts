'use server';
import { cookies } from "next/headers";
const base_url = 'http://localhost:8000';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  // Add other fields as needed
};

export type UpdateUserDto = {
  name: string;
  email: string;
  phone: string;
};

export type UpdatePasswordDto = {
  password: string;
  new_password: string;
};

export async function getUsers(page = 1, limit = 10): Promise<User[]> {
  'use server';
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/users?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
      },
      credentials: "include",
    });
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response?.detail || "Failed to fetch users");
    }
    return response;
  } catch (err) {
    throw new Error("Failed in fetching users");
  }
}

export async function getUserById(id: string): Promise<User> {
  'use server';
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
      },
      credentials: "include",
    });
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response?.detail || "Failed to fetch user");
    }
    return response;
  } catch (err) {
    throw new Error("Failed in fetching user with id");
  }
}

export async function updateUser(id: string, data: UpdateUserDto) {
  'use server';
  try {
    const cookie = await cookies();

    const res = await fetch(`${base_url}/users/${id}/update-user`, {
      method:'POST',
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response?.detail || "Failed to update user");
    }
    return response;
  } catch (err) {
    throw new Error("Failed in updating user");
  }
}

export async function resetUserPassword(id: string, data: UpdatePasswordDto) {
  'use server';
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/users/${id}/reset-password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response?.detail || "Failed to reset password");
    }
    return response;
  } catch (err) {
    throw new Error("Failed in resetting user password");
  }
}

export async function deleteUser(id: string) {
  'use server';
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
        'Content-Type': 'application/json',
      },
      credentials: "include",
    });
    if (res.status !== 200 && res.status !== 204) {
      const response = await res.json();
      throw new Error(response?.detail || "Failed when deleting user");
    }
    return;
  } catch (err) {
    throw new Error("Failed when deleting user");
  }
}
