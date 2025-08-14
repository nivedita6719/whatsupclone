
// import axios from 'axios';

// // Use API URL from .env file, fallback to localhost:8080
// const api = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080'
// });

// export default api;
import axios from 'axios';

// ✅ Pick from .env file if set, otherwise default to localhost:8080
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL?.trim() || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
