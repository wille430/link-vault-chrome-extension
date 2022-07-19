import { BsPlus } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import { ILink } from "../types/ILink";
import { Message } from "../MessageHandler";

export const Popup = () => {
  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.id || !tab.url) return;

    chrome.runtime.sendMessage(
      {
        action: "LinkCreate",
        payload: {
          url: tab.url,
        },
      },
      (res) => {
        console.log(res);
      }
    );
  };

  const fetchLinks = async () => {
    return new Promise<ILink[]>((resolve) => {
      chrome.runtime.sendMessage<Message<"Link">, ILink[]>(
        {
          action: "LinkRead",
          payload: null,
        },
        (res) => {
          resolve(res);
        }
      );
    });
  };

  const { data } = useQuery(["links"], fetchLinks);

  return (
    <div className="p-3">
      <button
        id="changeColor"
        className="btn btn-primary"
        onClick={handleClick}
      >
        <BsPlus width="6rem" height="6rem" />
      </button>
      {data?.map((x) => (
        <h1>{x.url}</h1>
      ))}
    </div>
  );
};
