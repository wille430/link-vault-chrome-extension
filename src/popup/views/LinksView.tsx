import { useQuery } from "@tanstack/react-query";
import { CreateLinkButton } from "../components/CreateLinkButton";
import { LinkList } from "../components/LinkList";
import { customFetcher } from "../../helpers/customFetcher";
import { useParams } from "react-router";
import { ILink } from "../../types/ILink";
import { BackButton } from "../components/BackButton";

export const LinksView = () => {
  const params = useParams();

  const fetchLinks = async () =>
    customFetcher(`/links?collectionId=${params.colId}`);

  const { data, isLoading, error } = useQuery<ILink[]>(["links"], fetchLinks);

  return (
    <section className="d-flex flex-column gap-2 overflow-hidden flex-grow-1">
      <BackButton backTo="/" />

      {error ? (
        <span className="text-white center flex-grow-1">An error occurred</span>
      ) : !data || isLoading ? (
        <span className="text-white center flex-grow-1">Loading...</span>
      ) : data.length ? (
        <div className="overflow-auto flex-grow-1">
          {<LinkList links={data} />}
        </div>
      ) : (
        <span className="center flex-grow-1">Empty</span>
      )}

      <CreateLinkButton />
    </section>
  );
};
