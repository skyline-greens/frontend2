"use client";

import { io } from "socket.io-client";
function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`));
    return match ? decodeURIComponent(match[2]) : null;
}
let accessToken = null;
if (typeof window !== "undefined") {
  accessToken = getCookie("accessToken");
}

export const socket = io(`/cells`, {
  extraHeaders: {
    Authorization: `Bearer ${accessToken}`
  }
});
