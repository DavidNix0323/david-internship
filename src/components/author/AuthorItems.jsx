import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AuthorItems = ({ authorId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!authorId) return; // 🔐 Prevent fetch if authorId is missing

    const fetchAuthorItems = async () => {
      try {
        const res = await fetch("/topSellers"); // ✅ Use proxy (no CORS error)
        const authors = await res.json();
        const author = authors.find((a) => a.authorId === Number(authorId));

        if (author?.nftCollection) {
          setItems(author.nftCollection);
        } else {
          console.warn("❌ No matching author found for ID:", authorId);
        }
      } catch (err) {
        console.error("Failed to fetch author items:", err);
      }
    };

    fetchAuthorItems();
  }, [authorId]);

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.map((item) => (
            <div
              className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
              key={item.nftId}
            >
              <div className="nft__item">
                {/* ✅ Safe Author Link */}
                <div className="author_list_pp">
                  {authorId ? (
                    <Link to={`/author/${authorId}`}>
                      <img
                        className="lazy"
                        src={item.authorImage}
                        alt={item.authorName}
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  ) : (
                    <div className="text-warning text-sm">Missing author</div>
                  )}
                </div>

                {/* 🔻 NFT Wrap */}
                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="#"><i className="fa fa-facebook fa-lg" /></a>
                        <a href="#"><i className="fa fa-twitter fa-lg" /></a>
                        <a href="#"><i className="fa fa-envelope fa-lg" /></a>
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

                {/* 🔻 Info Section */}
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
