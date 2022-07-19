import { API_URL } from "./constants";
import { createHeaders } from "./helpers/createHeaders";
import { MessageHandler } from "./MessageHandler";

const handler = new MessageHandler<"Link">();
handler.addCase("LinkCreate", async (msg, sender, sendResponse) => {
  const result = await fetch(new URL("/links", API_URL), {
    method: "POST",
    body: JSON.stringify(msg.payload),
    headers: createHeaders(),
  });
  sendResponse(await result.json());
});

handler.addCase("LinkRead", async (msg, sender, sendResponse) => {
  const result = await fetch("http://localhost:8080/links", {
    method: "GET",
    headers: createHeaders(),
  });
  sendResponse(await result.json());
});
