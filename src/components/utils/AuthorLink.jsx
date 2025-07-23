import { Link } from "react-router-dom";

const AuthorLink = ({ id, children }) => {
  const isValid =
    id &&
    String(id).toLowerCase() !== "undefined" &&
    !isNaN(Number(id));

  if (!isValid) {
    console.warn("🚨 Invalid authorId passed to AuthorLink:", id);
    return <span>{children}</span>;
  }

  return <Link to={`/author/${id}`}>{children}</Link>;
};

export default AuthorLink;

