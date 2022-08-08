import { useNavigate } from "react-router";

export const BackButton = ({ backTo }: { backTo: string }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(backTo);
  };

  return (
    <span role="button" className="text-primary" onClick={handleClick}>
      Back
    </span>
  );
};
