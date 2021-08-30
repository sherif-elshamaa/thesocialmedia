const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://thesocialmediaa.web.app";

module.exports = baseUrl;
