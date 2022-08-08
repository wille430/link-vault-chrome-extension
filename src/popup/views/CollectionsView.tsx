import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { BsPlus } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router";
import { customFetcher } from "../../helpers/customFetcher";
import { ICollection } from "../../types/ICollection";
import { CollectionList } from "../components/CollectionList";

export type CollectionsViewState = {
  //   When undefined, clicking on collections will open them
  mode?: "select";
};

export const CollectionsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as CollectionsViewState) ?? {};

  const { data, error, isLoading } = useQuery(["collections"], () =>
    customFetcher("/collections")
  );
  const results = data?.results as ICollection[];

  useEffect(() => {
    const handleClick = () => {
      navigate(location.pathname, {
        state: {},
      });
    };

    window.addEventListener("contextmenu", handleClick);

    return () => {
      window.removeEventListener("contextmenu", handleClick);
    };
  }, []);

  const handleItemClick = async (i: number) => {
    if (!results) return;

    const col = results[i];
    if (state.mode === "select") {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.id || !tab.url) return;

      navigate(`/${col.id}/new`, {
        state: {
          url: tab.url,
          title: tab.title,
        },
      });
    } else {
      navigate(`/${col.id}`);
    }
  };

  return (
    <section className="d-flex flex-column flex-grow-1 overflow-auto">
      <h4 className="mt-2">My Collections</h4>

      {error ? (
        <span className="text-white center flex-grow-1">An error occurred</span>
      ) : !results || isLoading ? (
        <span className="text-white center flex-grow-1">Loading...</span>
      ) : (
        results && (
          <div className="flex-grow-1">
            <CollectionList
              onItemClick={handleItemClick}
              collections={results}
            />
          </div>
        )
      )}

      <div className="d-flex gap-2">
        <button
          onClick={() =>
            navigate(location.pathname, {
              state: { mode: "select" } as CollectionsViewState,
            })
          }
          className="btn btn-primary flex-grow-1 btn-sm"
        >
          <BsPlus /> Add from Tab
        </button>

        <button
          onClick={() => navigate("/new")}
          className="btn btn-secondary btn-sm"
        >
          <BsPlus /> Collection
        </button>
      </div>

      {state.mode === "select" && (
        <span className="text-center pt-2 text-muted">
          <small>
            Select the collection to add the link to. Return with right mouse
            button.
          </small>
        </span>
      )}
    </section>
  );
};
