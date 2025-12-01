const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const normalizedBaseUrl = SUPABASE_URL?.replace(/\/$/, "");

type HeadersInit = Record<string, string>;

type SupabaseInsertOptions = {
  table: string;
  payload: Record<string, unknown>;
  preferReturn?: "minimal" | "representation";
  jwt?: string;
};

type SupabaseFetchOptions = {
  path: string;
  method?: string;
  body?: Record<string, unknown> | null;
  headers?: HeadersInit;
  auth?: "anon" | "service";
  jwt?: string;
  signal?: AbortSignal;
  cache?: RequestCache;
};

function ensureEnv() {
  if (!SUPABASE_URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  if (!SUPABASE_ANON_KEY) throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
}

function authHeaders(auth: "anon" | "service" = "anon", jwt?: string): HeadersInit {
  const token = jwt || (auth === "service" ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_ANON_KEY);

  if (!token) throw new Error("Supabase token is missing");

  return {
    apikey: token,
    Authorization: `Bearer ${token}`,
  } as HeadersInit;
}

async function supabaseAuth(path: string, body: Record<string, unknown>) {
  ensureEnv();
  const headers: HeadersInit = {
    ...authHeaders("service"),
    "Content-Type": "application/json",
  };

  const response = await fetch(`${normalizedBaseUrl}/auth/v1/${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Auth error ${response.status}`);
  }

  return response.json();
}

export async function supabaseFetch(options: SupabaseFetchOptions) {
  ensureEnv();

  const { path, method = "GET", body, headers = {}, auth = "anon", jwt, signal, cache } = options;
  const url = new URL(path.replace(/^\//, ""), `${normalizedBaseUrl}/`).toString();

  const mergedHeaders: HeadersInit = {
    ...authHeaders(auth, jwt),
    ...headers,
  };

  const init: RequestInit = {
    method,
    headers: mergedHeaders,
    signal,
    cache,
  };

  if (body) {
    mergedHeaders["Content-Type"] = mergedHeaders["Content-Type"] || "application/json";
    init.body = JSON.stringify(body);
  }

  const response = await fetch(url, init);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Supabase error ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function insertRecord({ table, payload, preferReturn = "representation", jwt }: SupabaseInsertOptions) {
  return supabaseFetch({
    path: `/rest/v1/${table}`,
    method: "POST",
    headers: {
      Prefer: `return=${preferReturn}`,
    },
    body: payload,
    auth: "service",
    jwt,
    cache: "no-store",
  });
}

export async function upsertRecord({ table, payload, preferReturn = "representation", jwt }: SupabaseInsertOptions) {
  return supabaseFetch({
    path: `/rest/v1/${table}`,
    method: "POST",
    headers: {
      Prefer: `return=${preferReturn},resolution=merge-duplicates`,
    },
    body: payload,
    auth: "service",
    jwt,
    cache: "no-store",
  });
}

export async function logEvent(table: string, payload: Record<string, unknown>) {
  return insertRecord({ table, payload, preferReturn: "minimal" });
}

export function supabaseHeaders(jwt?: string) {
  return authHeaders(jwt ? "anon" : "service", jwt);
}

export async function registerUser(email: string, password: string, data?: Record<string, unknown>) {
  return supabaseAuth("signup", { email, password, data });
}

export async function loginUser(email: string, password: string) {
  return supabaseAuth("token?grant_type=password", { email, password });
}
