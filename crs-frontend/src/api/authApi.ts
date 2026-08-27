const API_GATEWAY = "http://localhost:8080";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role?: string;
  username?: string;
}

export async function login(
  data: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_GATEWAY}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Đăng nhập thất bại");
  }

  return response.json();
}