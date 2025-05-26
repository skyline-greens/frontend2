'use server'
import { BACKEND_URL } from "@/constants/api";
import { cookies } from "next/headers";
const base_url = BACKEND_URL;

// Adjust this type to match your backend's Cell entity
export type Cell = {
  id: string;
  name: string;
  warehouseId: string;
  rowNumber: number;
  columnNumber: number;
  // ...add other fields as needed
};

export async function getCells(): Promise<Cell[]> {
  'use server'
  try {
     const cookie = await cookies();
    const res = await fetch(`${base_url}/cells`, {
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`
      },
      credentials: "include"
    });
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response?.detail || "Failed to fetch cells");
    }

    return response;
  } catch (err) {
    throw new Error("Failed in fetching cells");
  }
}

export async function getCellById(id: string): Promise<Cell> {
  'use server'
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/cells/${id}`, {
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`
      },
      credentials: "include"
    });
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response?.detail || "Failed to fetch cell");
    }
    return response;
  } catch (err) {
    throw new Error("Failed in fetching cell with id");
  }
}

export async function addCell(data: Omit<Cell, "id">) {
  'use server'
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/cells`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(data)
    });
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response?.detail || "Failed to create cell");
    }
    return response;
  } catch (err) {
    throw new Error('Failed to create new cell');
  }
}

export async function updateCell(id: string, data: Partial<Cell>) {
  'use server'
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/cells/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
        'Content-Type': 'application/json'
      },
      credentials: "include",
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    return;
  } catch (err) {
    throw new Error("Failed in updating cell");
  }
}

export async function deleteCell(id: string) {
  'use server'
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/cells/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
        'Content-Type': 'application/json'
      },
      credentials: "include"
    });
    if(res.status !== 204) {
      throw new Error("Failed when deleting cell");
    }
    return;
  } catch (err) {
    throw new Error("Failed when deleting cell");
  }
}
