export const CELL_ID =
  typeof window !== "undefined"
    ? localStorage.getItem("CELL_ID")
    : process.env.CELL_ID || null;