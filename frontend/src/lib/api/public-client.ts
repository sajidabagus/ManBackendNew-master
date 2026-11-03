import axios from "axios";
import { getBrowserApiBaseUrl } from "@/lib/api/public-base";

export const publicApiClient = axios.create({
  baseURL: getBrowserApiBaseUrl(),
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
  timeout: 30000,
});
