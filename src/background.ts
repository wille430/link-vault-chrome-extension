import { API_URL } from "./constants";
import { createHeaders } from "./helpers/createHeaders";
import { createMessageHandler } from "./MessageHandler";
import { LinkAction } from "./types/Actions";

createMessageHandler({
  builder: (builder) => {
    builder
      .addCase(LinkAction.GET_LISTINGS, async (msg, sender, sendResponse) => {
        const result = await fetch("http://localhost:8080/links", {
          method: "GET",
          headers: createHeaders(),
        });
        sendResponse(await result.json());
      })
      .addCase(LinkAction.CREATE_LISTING, async (msg, sender, sendResponse) => {
        const result = await fetch(new URL("/links", API_URL), {
          method: "POST",
          body: JSON.stringify(msg.payload),
          headers: createHeaders(),
        });
        sendResponse(await result.json());
      });
  },
});
