const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://thesocialmedia-kzu9.vercel.app/";

module.exports = baseUrl;
