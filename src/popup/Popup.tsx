import { CreateLinkButton } from "./components/CreateLinkButton";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ILink } from "../types/ILink";
import { Message } from "../MessageHandler";
import { createRoot } from "react-dom/client";
import "./Popup.scss";
import { List } from "./components/List";
import { LinkAction } from "../types/Actions";

const Popup = () => {
  const fetchLinks = async () => {
    return new Promise<ILink[]>((resolve, reject) => {
      chrome.runtime.sendMessage<Message>(
        {
          action: LinkAction.GET_LISTINGS,
          payload: null,
        },
        (res) => {
          const lastError = chrome.runtime.lastError;

          if (lastError) {
            reject(lastError);
          } else {
            resolve(res);
          }
        }
      );
    });
  };

  const { data, isLoading, error } = useQuery(["links"], fetchLinks);

  return (
    <main className="p-2 d-flex flex-column gap-2 overflow-hidden bg-dark">
      <CreateLinkButton />
      {error ? (
        <span className="text-white center flex-grow-1">An error occurred</span>
      ) : !data || isLoading ? (
        <span className="text-white center flex-grow-1">Loading...</span>
      ) : (
        <div className="overflow-auto">{data && <List links={data} />}</div>
      )}
    </main>
  );
};

const root = createRoot(document.getElementById("root") as Element);
root.render(
  <QueryClientProvider client={new QueryClient()}>
    <Popup />
  </QueryClientProvider>
);
