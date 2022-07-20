import { API_URL, JWT_TOKEN } from "../constants";
import { createHeaders } from "./createHeaders";

export const customFetcher = async (
  url: string,
  options: Parameters<typeof fetch>[1] & { _retry?: boolean }
): Promise<any> => {
  if (!options) options = {};

  options.headers = {
    ...options.headers,
    ...(await createHeaders()),
  };

  return fetch(new URL(url, API_URL), options).then(async (res) => {
    if (res.ok) {
      return res.json();
    } else {
      if (!options._retry && res.status === 401) {
        options._retry = true;
        await refreshToken();
        return customFetcher(url, options);
      } else {
        throw res.json();
      }
    }
  });
};

const refreshToken = async () => {
  chrome.storage.sync.get(
    ["accessToken", "refreshToken"],
    async ({ AccessToken, RefreshToken }) => {
      const res = await fetch(new URL("/auth/refresh", API_URL), {
        method: "POST",
        body: JSON.stringify({
          AccessToken,
          RefreshToken,
        }),
        headers: await createHeaders(),
      }).then((res) => res.json());

      chrome.storage.sync.set(res);
    }
  );
};
