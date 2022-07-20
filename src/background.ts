import { API_URL } from "./constants";
import { customFetcher } from "./helpers/customFetcher";
import { createMessageHandler } from "./MessageHandler";
import { LinkAction } from "./types/Actions";

(async () => {
  const res = await fetch(new URL("/auth/login", API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "guadalupe.feil",
      password: "q5oua5vy2l47KL1",
    }),
  }).then((res) => res.json());
  chrome.storage.sync.set({
    ...res,
  });
})();

createMessageHandler({
  builder: (builder) => {
    builder
      .addCase(LinkAction.GET_LISTINGS, async (msg, sender, sendResponse) => {
        const result = await customFetcher("/links", {
          method: "GET",
        });
        sendResponse(result);
      })
      .addCase(LinkAction.CREATE_LISTING, async (msg, sender, sendResponse) => {
        const result = await customFetcher("/links", {
          method: "POST",
          body: JSON.stringify(msg.payload),
        });
        sendResponse(result);
      });
  },
});
