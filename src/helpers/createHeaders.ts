import { JWT_TOKEN } from "../constants";

export const createHeaders = () => new Headers({
  Authorization: "Bearer " + JWT_TOKEN,
  "Content-Type": "application/json",
});
