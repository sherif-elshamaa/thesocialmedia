const baseUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : "https://thesocialmedia-g259pt3wr-thesocialmedia.vercel.app";

export default baseUrl;
