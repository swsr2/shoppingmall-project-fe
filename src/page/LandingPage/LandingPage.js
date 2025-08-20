import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Pagination, Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";

const LandingPage = () => {
  const dispatch = useDispatch();
  const { productList, totalPageNum, loading } = useSelector((state) => state.product);
  const [query] = useSearchParams();
  const name = query.get("name");
  const mainCategory = query.get("mainCategory");
  const status = query.get("status");

  const [currentPage, setCurrentPage] = useState(1);

  const filteredList = mainCategory
    ? productList.filter((item) => item.mainCategory === mainCategory)
    : productList;

  useEffect(() => {
    setCurrentPage(1);
  }, [name, mainCategory, status]);
  useEffect(() => {
    dispatch(
      getProductList({
        page: currentPage,
        name,
        mainCategory,
        status,
      })
    );
  }, [query, dispatch, name, mainCategory, status, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container>
      <Row>
        {loading ? (
          <div className="spinner-box">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : filteredList.length > 0 ? (
          filteredList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {!name ? (
              <h2>등록된 상품이 없습니다!</h2>
            ) : (
              <h2>'{name}'와 일치한 상품이 없습니다!</h2>
            )}
          </div>
        )}
      </Row>
      {totalPageNum > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPageNum)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPageNum}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default LandingPage;
