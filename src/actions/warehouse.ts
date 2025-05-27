'use server'
import { BACKEND_URL } from "@/constants/api";
import { cookies } from "next/headers";
const base_url = BACKEND_URL;

export type Warehouse = {
  id: string;
  name: string;
  capacity: number;
  mac?: string | null;
  farmId?: string | null;
  managerId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getWarehouses(): Promise<Warehouse[]> {
  'use server'
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/warehouses`, {
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`
      },
      credentials: "include"
    });
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response?.detail || "Failed to fetch warehouses");
    }
    return response;
  } catch (err) {
    throw new Error("Failed in fetching warehouses");
  }
}


export async function getWarehousesStats(): Promise<any> {
    'use server'
    try {
      const cookie = await cookies();
      const res = await fetch(`${base_url}/warehouses/stats`, {
        headers: {
          Authorization: `Bearer ${cookie.get('accessToken')?.value}`
        },
        credentials: "include"
      });
      const response = await res.json();
      if (!res.ok) {
        throw new Error(response?.detail || "Failed to fetch warehouses");
      }
      return response;
    } catch (err) {
     console.error(err);
    }
  }

export async function getWarehouseById(id: string): Promise<Warehouse> {
  'use server'
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/warehouses/${id}`, {
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`
      },
      credentials: "include"
    });
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response?.detail || "Failed to fetch warehouse");
    }
    return response;
  } catch (err) {
    throw new Error("Failed in fetching warehouse with id");
  }
}

export async function addWarehouse(data: Omit<Warehouse, "id" | "createdAt" | "updatedAt">) {
  'use server'
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/warehouses`, {
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
      throw new Error(response?.detail || "Failed to create warehouse");
    }
    return response;
  } catch (err) {
    throw new Error('Failed to create new warehouse');
  }
}

export async function updateWarehouse(id: string, data: Partial<Warehouse>) {
  'use server'
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/warehouses/${id}`, {
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
    throw new Error("Failed in updating warehouse");
  }
}

export async function deleteWarehouse(id: string) {
  'use server'
  try {
    const cookie = await cookies();
    const res = await fetch(`${base_url}/warehouses/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${cookie.get('accessToken')?.value}`,
        'Content-Type': 'application/json'
      },
      credentials: "include"
    });
    if(res.status !== 200) {
      throw new Error("Failed when deleting warehouse");
    }
    return;
  } catch (err) {
    throw new Error("Failed when deleting warehouse");
  }
}