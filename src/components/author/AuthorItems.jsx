import React, { useEffect, useState } from "react";
import AuthorLink from "../utils/AuthorLink";

import { Link } from "react-router-dom";
import axios from "axios";

// Optional helper
const isValidAuthorId = (id) =>
  id && String(id).toLowerCase() !== "undefined" && !isNaN(Number(id));

const AuthorItems = ({ authorId }) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isValidAuthorId(authorId)) {
      console.warn("🚫 Invalid authorId passed to AuthorItems:", authorId);
      setError(true);
      return;
    }

    const fetchAuthorItems = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
        );
        const filtered = res.data.filter(
          (item) => String(item.authorId) === String(authorId)
        );
        setItems(filtered);
      } catch (err) {
        console.error("❌ Failed to fetch author items:", err);
        setError(true);
      }
    };

    fetchAuthorItems();
  }, [authorId]);

  if (error)
    return (
      <div className="text-center py-4">
        🚫 Unable to load NFTs for this author.{" "}
        <Link to="/explore" className="text-primary underline">
          Browse creators
        </Link>
      </div>
    );

  if (!items.length)
    return (
      <div className="text-center py-4 text-muted">
        No NFTs found for this author.
      </div>
    );

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.map((item) => (
            <div
              key={item.nftId}
              className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
            >
              <div className="nft__item">
                {/* Avatar with trapped link */}
                <div className="author_list_pp">
                  <AuthorLink id={item.authorId}>
                    <img
                      className="lazy"
                      src={item.authorImage}
                      alt={item.authorName}
                    />
                    <i className="fa fa-check" />
                  </AuthorLink>
                </div>

                {/* Optional countdown? */}
                {item.expiryDate && (
                  <div className="de_countdown">{item.expiryDate}</div>
                )}

                {/* Preview */}
                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="#">
                          <i className="fa fa-facebook fa-lg" />
                        </a>
                        <a href="#">
                          <i className="fa fa-twitter fa-lg" />
                        </a>
                        <a href="#">
                          <i className="fa fa-envelope fa-lg" />
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to={`/item-details/${item.nftId}`}>
                    <img
                      src={item.nftImage}
                      className="lazy nft__item_preview"
                      alt={item.title}
                    />
                  </Link>
                </div>

                {/* Info */}
                <div className="nft__item_info">
                  <Link to={`/item-details/${item.nftId}`}>
                    <h4>{item.title}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart" />
                    <span>{item.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;
