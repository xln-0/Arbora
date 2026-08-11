const API_URL = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, code?: string) {
    super(`API error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      code?: string;
      message?: string;
    } | null;
    const error = new ApiError(response.status, payload?.code);

    if (payload?.message) {
      error.message = payload.message;
    }

    throw error;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
