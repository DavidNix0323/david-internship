import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthorItems from "../components/author/AuthorItems";

const isValidAuthorId = (id) =>
  id && String(id).toLowerCase() !== "undefined" && !isNaN(Number(id));

const Author = () => {
  const { authorId } = useParams();
  const navigate = useNavigate();
  const [authorData, setAuthorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isValidAuthorId(authorId)) {
      console.warn("🚫 Invalid authorId trap fired:", authorId);
      navigate("/explore"); // Redirect user cleanly
      return;
    }

    const fetchTopSellers = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );
        const sellers = res.data;
        const matchedAuthor = sellers.find(
          (author) => String(author.authorId) === String(authorId)
        );

        if (!matchedAuthor) {
          console.warn("❌ Author not found in topSellers:", authorId);
          navigate("/explore"); // Redirect again if not found
          return;
        }

        setAuthorData(matchedAuthor);
      } catch (err) {
        console.error("❌ Failed to fetch topSellers:", err);
        navigate("/explore");
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellers();
  }, [authorId, navigate]);

  if (loading || !authorData)
    return <div className="text-center py-5 animate-pulse">Loading author...</div>;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{
            backgroundImage: `url(${authorData.authorBanner || "/images/default-banner.jpg"})`,
            backgroundPosition: "top",
            backgroundSize: "cover",
          }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img
                        src={authorData.authorImage}
                        alt={authorData.authorName}
                      />
                      <i className="fa fa-check" />
                      <div className="profile_name">
                        <h4>
                          {authorData.authorName}
                          <span className="profile_username">
                            {authorData.tag || "@unknown"}
                          </span>
                        </h4>
                        <span>{authorData.address || "0x000...000"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="de-flex-col">
                    <div className="profile_follower">
                      <h6>Followers</h6>
                      <span>{authorData.followers || "1,723"}</span>
                    </div>
                    <button className="btn-main">Follow</button>
                  </div>
                </div>
              </div>

              <AuthorItems authorId={authorId} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
