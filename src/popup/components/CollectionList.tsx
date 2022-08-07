import { ICollection } from "../../types/ICollection";
import { useNavigate } from "react-router";

export type CollectionListProps = {
  collections: ICollection[];
  onItemClick: (index: number) => any;
};

export const CollectionList = ({
  collections,
  onItemClick,
}: CollectionListProps) => {
  const sortByRecent = (a: ICollection, b: ICollection) =>
    new Date(a.createdAt).getTime() > new Date(b.createdAt).getTime() ? -1 : 1;

  return (
    <table className="table table-dark table-striped">
      <tbody>
        {collections.sort(sortByRecent).map((collection, i) => (
          <tr key={collection.id} role="button" onClick={(e) => onItemClick(i)}>
            <td>{collection.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
