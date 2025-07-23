import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EthImage from "../images/ethereum.svg";

const ItemDetails = () => {
  const { nftId } = useParams();
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchItem = async () => {
      try {
        const res = await fetch(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
        );
        const data = await res.json();
        setItemData(data);
      } catch (err) {
        console.error("Error fetching item details:", err);
      }
    };

    if (nftId) {
      fetchItem();
    }
  }, [nftId]);

  if (!itemData) return null;

  // 🚨 Trap for undefined authorId rendering
  if (!itemData.authorId || itemData.authorId === "undefined") {
    console.error("🚨 ItemDetails → authorId missing!", itemData);
  }

  const getAuthorRoute = (id) => (id ? `/author/${id}` : "#");

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              {/* NFT Image */}
              <div className="col-md-6 text-center">
                <img
                  src={itemData.nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={itemData.title}
                />
              </div>

              {/* Item Details */}
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{itemData.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {itemData.views || 100}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {itemData.likes}
                    </div>
                  </div>

                  <p>{itemData.description || "No description provided."}</p>

                  {/* Owner */}
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={getAuthorRoute(itemData.authorId)}>
                            <img
                              className="lazy"
                              src={itemData.authorImage}
                              alt={itemData.authorName}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={getAuthorRoute(itemData.authorId)}>
                            {itemData.authorName}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Creator + Price */}
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={getAuthorRoute(itemData.authorId)}>
                            <img
                              className="lazy"
                              src={itemData.authorImage}
                              alt={itemData.authorName}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={getAuthorRoute(itemData.authorId)}>
                            {itemData.authorName}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="spacer-40"></div>

                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="ETH" />
                      <span>{itemData.price} ETH</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
