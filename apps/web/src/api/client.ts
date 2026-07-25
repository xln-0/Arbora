const API_URL = import.meta.env.VITE_API_URL ?? "/api";

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
    credentials: "include",
    headers,
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
