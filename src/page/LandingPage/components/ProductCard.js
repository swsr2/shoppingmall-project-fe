import React from "react";
import { useNavigate } from "react-router-dom";
import { currencyFormat, applyDiscount } from "../../../utils/number";

const ProductCard = ({ item }) => {
  const navigate = useNavigate();
  const showProduct = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <div className="card" onClick={() => showProduct(item._id)}>
      <img src={item?.image} alt={item?.image} />
      <div>{item?.name}</div>
      {item?.mainCategory === "sale" ? (
        <div>
          <span style={{ textDecoration: "line-through" }}>
            ₩ {currencyFormat(item?.price)}
          </span>
          <br />
          <span style={{ color: "red" }}>
            ₩ {currencyFormat(applyDiscount(item?.price, item?.mainCategory))}
          </span>
        </div>
      ) : (
        <div>₩ {currencyFormat(item?.price)}</div>
      )}
    </div>
  );
};

export default ProductCard;
