const API_BASE = typeof window === "undefined"
  ? (process.env.API_URL || "http://localhost:8080/api")
  : "/backend-api";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Attach token from localStorage if available in browser
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  };

  // Enable fast Next.js ISR server caching for public GET queries while mutations remain fresh
  if (typeof window === "undefined" && !options.method && !options.body) {
    (fetchOptions as any).next = { revalidate: 30 };
  }

  const response = await fetch(url, fetchOptions);

  const data = await response.json();

  if (!response.ok || data.status === false) {
    throw new Error(data.message || "An unexpected error occurred");
  }

  return data;
}