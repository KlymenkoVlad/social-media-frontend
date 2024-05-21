export const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3001"
    : "https://chatapp-backend-nhw7.onrender.com";

export const frontendUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://chatapp-backend-nhw7.onrender.com";
