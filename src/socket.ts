"use client";

import { io } from "socket.io-client";
import { BACKEND_URL } from "./constants/api";
export const socket = io(`${BACKEND_URL}/cells`);
