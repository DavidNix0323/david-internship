import React, { useEffect, useState } from "react";
import axios from "axios";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );
        setSellers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch top sellers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const skeletons = Array(12).fill(null); // Adjust count if needed

  return (
    <section aria-label="section" className="container">
      <div className="row">
        <div className="col-md-12">
          <h2 className="text-center mb-4">Top Sellers</h2>
        </div>
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
                    <div
                      className="skeleton-box"
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        marginBottom: 10,
                      }}
                    />
                  </div>
                  <div className="nft__item_info">
                    <div
                      className="skeleton-box"
                      style={{ width: "60%", height: 20, marginBottom: 8 }}
                    />
                    <div
                      className="skeleton-box"
                      style={{ width: "40%", height: 16 }}
                    />
                  </div>
                </div>
              </div>
            ))
          : sellers.map((seller) => (
              <div
                key={seller.authorId}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <a href={`/author/${seller.authorId}`}>
                      <img
                        className="lazy"
                        src={seller.authorImage}
                        alt={seller.authorName}
                      />
                      <i className="fa fa-check" />
                    </a>
                  </div>
                  <div className="nft__item_info">
                    <h4>{seller.authorName}</h4>
                    <div className="nft__item_price">{seller.price} ETH</div>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );
};

export default TopSellers;
