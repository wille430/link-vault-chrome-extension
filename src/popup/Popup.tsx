import { CreateLinkButton } from "./components/CreateLinkButton";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ILink } from "../types/ILink";
import { Message } from "../MessageHandler";
import { render } from "react-dom";
import "./Popup.scss";
import { List } from "./components/List";
import { LinkAction } from "../types/Actions";

const Popup = () => {
  const fetchLinks = async () => {
    return new Promise<ILink[]>((resolve) => {
      chrome.runtime.sendMessage<Message>(
        {
          action: LinkAction.GET_LISTINGS,
          payload: null,
        },
        (res) => {
          resolve(res);
        }
      );
    });
  };

  const { data, isLoading, error } = useQuery(["links"], fetchLinks);

  return (
    <main className="p-2 d-flex flex-column gap-2 overflow-hidden bg-dark">
      <CreateLinkButton />
      {isLoading ? (
        <span className="text-white center flex-grow-1">Loading...</span>
      ) : error ? (
        <span className="text-white center flex-grow-1">An error occurred</span>
      ) : (
        <div className="overflow-auto">{data && <List links={data} />}</div>
      )}
    </main>
  );
};

render(
  <QueryClientProvider client={new QueryClient()}>
    <Popup />
  </QueryClientProvider>,
  document.getElementById("root")
);
