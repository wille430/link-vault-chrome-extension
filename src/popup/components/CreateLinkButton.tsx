import { useQueryClient } from "@tanstack/react-query";
import { BsPlus } from "react-icons/bs";
import { LinkAction } from "../../types/Actions";
import { ILink } from "../../types/ILink";

export const CreateLinkButton = () => {
  const queryClient = useQueryClient();

  const handleClick = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.id || !tab.url) return;

    chrome.runtime.sendMessage(
      {
        action: LinkAction.CREATE_LISTING,
        payload: {
          url: tab.url,
        },
      },
      (res: ILink) => {
        queryClient.setQueryData(["links"], (state: ILink[] | undefined) => [
          ...(state ?? []),
          res,
        ]);
      }
    );
  };

  return (
    <button
      id="changeColor"
      className="btn btn-primary container"
      onClick={handleClick}
    >
      <BsPlus />
    </button>
  );
};
