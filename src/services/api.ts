const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function getToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function buildUrl(path: string, params?: RequestConfig["params"]): string {
  const base = path.startsWith("http") ? path : `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  if (!params) return base;
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") search.set(k, String(v));
  });
  const q = search.toString();
  return q ? `${base}?${q}` : base;
}

export async function api<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const { params, ...init } = config;
  const url = buildUrl(path, params);
  const token = await getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? res.statusText);
  }
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export const apiClient = {
  get: <T>(path: string, params?: RequestConfig["params"]) =>
    api<T>(path, { method: "GET", params }),

  post: <T>(path: string, body?: unknown) =>
    api<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),

  patch: <T>(path: string, body?: unknown) =>
    api<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),

  delete: <T>(path: string) => api<T>(path, { method: "DELETE" }),
};
