import supabaseClient from "@/features/auth/utils/SupabaseClient";
import { AuthResponse } from "@supabase/supabase-js";
import axios from "axios";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "/api/v1",
});

let refreshTokenPromise: Promise<AuthResponse> | null = null;
let networkErrorDisplayed = false;

api.interceptors.request.use(
  async (config) => {
    const { data } = await supabaseClient.auth.getSession();
    let session = data.session;
    const isTokenExpired =
      session && dayjs.unix(session.expires_at ?? 0).isBefore(dayjs());

    if (!session || isTokenExpired) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = supabaseClient.auth.refreshSession();
      }
      const { data: refreshData, error } = await refreshTokenPromise;
      refreshTokenPromise = null;

      if (error) {
        console.error("Token refresh failed:", error.message);
        throw error;
      }
      session = refreshData.session;
    }

    const token = session?.access_token ?? "";
    const type = session?.token_type ?? "Bearer";
    config.headers.Authorization = token ? `${type} ${token}` : "";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (!error.response && !networkErrorDisplayed) {
      networkErrorDisplayed = true;
      toast.error("The Server is Unreachable");

      setTimeout(() => {
        networkErrorDisplayed = false;
      }, 5000);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshTokenPromise) {
          refreshTokenPromise = supabaseClient.auth.refreshSession();
        }
        const { data, error: refreshError } = await refreshTokenPromise;
        refreshTokenPromise = null;
        if (refreshError) {
          throw refreshError;
        }
        const session = data.session;
        const token = session?.access_token ?? "";
        const type = session?.token_type ?? "Bearer";
        originalRequest.headers.Authorization = token ? `${type} ${token}` : "";
        return api(originalRequest);
        //eslint-disable-next-line
      } catch (refreshError: any) {
        await supabaseClient.auth.signOut();
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key !== "vite-ui-theme") {
            localStorage.removeItem(key);
          }
        }
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
