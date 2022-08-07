import { customFetcher } from "./helpers/customFetcher";
import { createMessageHandler } from "./MessageHandler";
import { LinkAction } from "./types/Actions";

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
