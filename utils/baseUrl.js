const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "thesocialmediaa.netlify.app";

export default baseUrl;
