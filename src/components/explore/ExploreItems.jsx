import React, { useEffect, useState } from "react";
import AuthorLink from "../utils/AuthorLink"; // adjust path if needed
import { Link } from "react-router-dom";
import axios from "axios";

const isValidAuthorId = (id) =>
  id && String(id).toLowerCase() !== "undefined" && !isNaN(Number(id));

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
        );
        setItems(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch explore items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const getSortedItems = () => {
    if (filter === "price_low_to_high") {
      return [...items].sort((a, b) => a.price - b.price);
    }
    if (filter === "price_high_to_low") {
      return [...items].sort((a, b) => b.price - a.price);
    }
    if (filter === "likes_high_to_low") {
      return [...items].sort((a, b) => b.likes - a.likes);
    }
    return items;
  };

  const skeletons = Array(8).fill(null);

  return (
    <>
      <div className="mb-3">
        <select id="filter-items" value={filter} onChange={handleFilterChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>

      <div className="row">
        {loading
          ? skeletons.map((_, i) => (
              <div
                key={i}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 animate-pulse"
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <div className="skeleton-box" style={{ width: 50, height: 50, borderRadius: "50%" }} />
                  </div>
                  <div className="nft__item_wrap">
                    <div className="skeleton-box" style={{ width: "100%", height: 200 }} />
                  </div>
                  <div className="nft__item_info">
                    <div className="skeleton-box" style={{ width: "60%", height: 20, marginBottom: 10 }} />
                    <div className="skeleton-box" style={{ width: "30%", height: 16 }} />
                  </div>
                </div>
              </div>
            ))
          : getSortedItems().map((item) => (
              <div
                key={item.nftId}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    {isValidAuthorId(item.authorId) ? (
                      <AuthorLink id={item.authorId}>
                        <img
                          className="lazy"
                          src={item.authorImage}
                          alt={item.authorName}
                        />
                        <i className="fa fa-check"></i>
                      </AuthorLink>
                    ) : (
                      <span className="text-muted">Unknown Author</span>
                    )}
                  </div>

                  {item.expiryDate && (
                    <div className="de_countdown">{item.expiryDate}</div>
                  )}

                  <div className="nft__item_wrap">
                    <div className="nft__item_extra">
                      <div className="nft__item_buttons">
                        <button>Buy Now</button>
                        <div className="nft__item_share">
                          <h4>Share</h4>
                          <a href="#"><i className="fa fa-facebook fa-lg"></i></a>
                          <a href="#"><i className="fa fa-twitter fa-lg"></i></a>
                          <a href="#"><i className="fa fa-envelope fa-lg"></i></a>
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

                  <div className="nft__item_info">
                    <Link to={`/item-details/${item.nftId}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <div className="nft__item_price">{item.price} ETH</div>
                    <div className="nft__item_like">
                      <i className="fa fa-heart"></i>
                      <span>{item.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      <div className="col-md-12 text-center">
        <Link to="#" id="loadmore" className="btn-main lead">
          Load more
        </Link>
      </div>
    </>
  );
};

export default ExploreItems;


