const host = "http://localhost:3000";

type Method = "GET" | "POST" | "";

export async function sendRequest<T = null>(
  path: string,
  method: Method = "GET",
  init?: RequestInit
) {
  return fetch(`${host}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  }).then(async (res) => {
    const { headers, status } = res;
    console.log("tanmiao", "res", res);
    const contentType = headers.get("Content-Type");
    const content = await (contentType?.includes("application/json")
      ? res.json()
      : res.text());
    if (status > 299 || status < 200) {
      return {
        error: true,
        errorMessage: (content.message ? content.message : content) as string,
      } as const;
    }
    return content as T;
  });
}

export function jsonPost<T = null>(path: string, body?: any) {
  return sendRequest<T>(
    path,
    "POST",
    body ? { body: JSON.stringify(body) } : {}
  );
}
