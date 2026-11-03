import { apiClient } from "./client";
import type { ApiUser, CaptchaResponse, LoginResponse } from "@/types/api";

export async function fetchCaptchaApi() {
  const { data } = await apiClient.get<CaptchaResponse>("/auth/captcha");
  return data;
}

export async function loginApi(
  email: string,
  password: string,
  captchaId: string,
  captchaAnswer: string,
) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
    captcha_id: captchaId,
    captcha_answer: captchaAnswer,
  });
  return data;
}

export async function logoutApi() {
  const { data } = await apiClient.post<{ message: string }>("/auth/logout");
  return data;
}

export async function meApi() {
  const { data } = await apiClient.get<{ user: ApiUser }>("/auth/me");
  return data.user;
}
