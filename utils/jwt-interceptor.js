import axios from "axios";

function jwtInterceptor() {
  axios.interceptors.request.use(
    (req) => {
      const token =
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token");

      if (token) {
        req.headers = {
          ...req.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      return req;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        window.localStorage.removeItem("token") ||
          window.sessionStorage.removeItem("token");

        window.location.replace("/login");
      }

      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;
