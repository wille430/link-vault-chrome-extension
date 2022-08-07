import { API_URL } from "../constants";
import { createHeaders } from "./createHeaders";

export const customFetcher = async (
  url: string,
  options: Parameters<typeof fetch>[1] & { _retry?: boolean } = {}
): Promise<any> => {
  if (!options) options = {};

  options.headers = {
    ...options.headers,
    ...(await createHeaders()),
  };

  return fetch(new URL(url, API_URL), options).then(async (res) => res.json());
};
