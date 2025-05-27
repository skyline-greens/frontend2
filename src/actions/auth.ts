"use server";
import { TPayload } from "@/types";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { TRegisterSchema } from "@/features/auth/components/sign-up-view";
import { TAuthSchema } from "@/features/auth/components/sign-in-view";
import { BACKEND_URL } from "@/constants/api";
export async function login(data: TAuthSchema) {
  "use server";
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: 'include', // Important: Include cookies in request
    });

    if (!response.ok) {
      throw new Error("couldn't login");
    }

    const res = await response.json();

    // Get the refresh token cookie from the response
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      // Forward the refresh token cookie to the client
      const cookieStore = await cookies();

      // Parse the refresh_token cookie from set-cookie header
      const refreshTokenMatch = setCookieHeader.match(/refresh_token=([^;]+)/);
      if (refreshTokenMatch) {
        cookieStore.set({
          name: "refresh_token",
          value: refreshTokenMatch[1],
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
      }
    }

    // Store access token
    const cookieStore = await cookies();
    cookieStore.set({
      name: "accessToken",
      value: res.access,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 120, 
    });

    return { success: true, access: res.access };
  } catch (err) {
    throw new Error("couldn't login");
  }
}

export async function register(data: TRegisterSchema) {
  "use server";
  try {
    let { confirmPassword, ...requestData } = {
      ...data,
      role: "owner",
    };
    console.log(requestData);
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData)
    });


    // console.log(await response.json())
    if (!response.ok) {
      throw new Error("couldn't register");
    }

    return { success: true };
  } catch (err) {
    console.log(err);
    throw new Error("couldn't register");
  }
}

export async function refreshToken(): Promise<{ success: boolean; access?: string }> {
  "use server";
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return { success: false };
    }

    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Cookie": `refresh_token=${refreshToken}`,
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // Refresh token is invalid, clear cookies
      await logout();
      return { success: false };
    }

    const res = await response.json();

    // Update access token
    cookieStore.set({
      name: "accessToken",
      value: res.accessToken,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 120,
    });

    // Update refresh token if a new one was provided
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      const refreshTokenMatch = setCookieHeader.match(/refresh_token=([^;]+)/);
      if (refreshTokenMatch) {
        cookieStore.set({
          name: "refresh_token",
          value: refreshTokenMatch[1],
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === 'production',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
      }
    }

    return { success: true, access: res.accessToken };
  } catch (err) {
    await logout();
    return { success: false };
  }
}

export async function logout(): Promise<boolean> {
  "use server";
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    // Call backend logout endpoint if refresh token exists
    if (refreshToken) {
      try {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Cookie": `refresh_token=${refreshToken}`,
          },
          credentials: 'include',
        });
      } catch (err) {
        // Continue with local cleanup even if backend fails
      }
    }

    // Clear all auth-related cookies
    cookieStore.delete("accessToken");
    cookieStore.delete("refresh_token");
    cookieStore.delete("csrftoken");

    return true;
  } catch (e) {
    return false;
  }
}

export async function getAuth(): Promise<{ isAuth: boolean; payload: TPayload | null }> {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return {
        isAuth: false,
        payload: null,
      };
    }

    // Use the correct JWT secret (should match your NestJS ACCESS_JWT_SECRET)
    const jwtKey = process.env.ACCESS_JWT_SECRET ?? "verdant-secret";

    try {
      const claim = await jwtVerify<TPayload>(token, new TextEncoder().encode(jwtKey));

      return {
        isAuth: true,
        payload: claim.payload,
      };
    } catch (jwtError) {

      // Try to refresh the token
      const refreshResult = await refreshToken();

      if (refreshResult.success && refreshResult.access) {
        // Verify the new access token
        try {
          const claim = await jwtVerify<TPayload>(
            refreshResult.access, 
            new TextEncoder().encode(jwtKey)
          );

          return {
            isAuth: true,
            payload: claim.payload,
          };
        } catch (newTokenError) {
          console.error("New token verification failed:", newTokenError);
        }
      }

      return {
        isAuth: false,
        payload: null,
      };
    }
  } catch (e) {
    return {
      isAuth: false,
      payload: null,
    };
  }
}

// Utility function to check if user is authenticated (can be used in middleware)
export async function isAuthenticated(): Promise<boolean> {
  const auth = await getAuth();
  return auth.isAuth;
}

// Helper function for API calls that automatically handles token refresh
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const auth = await getAuth();

  if (!auth.isAuth) {
    throw new Error("Not authenticated");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });


  if (response.status === 401) {
    const refreshResult = await refreshToken();

    if (refreshResult.success) {
      const newToken = cookieStore.get("accessToken")?.value;
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      });
    }
  }

  return response;
}
