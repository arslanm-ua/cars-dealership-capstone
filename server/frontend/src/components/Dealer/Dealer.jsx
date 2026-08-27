import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./Dealer.css";

const sentimentClass = (sentiment) => {
  const value = (sentiment || "").toLowerCase();
  if (value.includes("pos")) return "badge badge-positive";
  if (value.includes("neg")) return "badge badge-negative";
  return "badge badge-neutral";
};

const sentimentLabel = (sentiment) => {
  if (!sentiment) return "Neutral";
  return sentiment.charAt(0).toUpperCase() + sentiment.slice(1).toLowerCase();
};

const Dealer = () => {
  const { id } = useParams();

  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchDealer = async () => {
      setLoading(true);
      setError("");
      try {
        const [dealerRes, reviewsRes] = await Promise.all([
          axios.get(`/djangoapp/dealer/${id}/`),
          axios.get(`/djangoapp/reviews/dealer/${id}/`),
        ]);

        if (dealerRes.data && dealerRes.data.status === 200) {
          setDealer(dealerRes.data.dealer);
        } else {
          setError("Unable to load dealer information.");
        }

        if (reviewsRes.data && reviewsRes.data.status === 200) {
          setReviews(reviewsRes.data.reviews || []);
        } else {
          setReviews([]);
        }
      } catch (err) {
        setError("Unable to load dealer information.");
      } finally {
        setLoading(false);
      }
    };
    fetchDealer();
  }, [id]);

  if (loading) {
    return <p>Loading dealer...</p>;
  }

  if (error) {
    return <p className="dealer-error">{error}</p>;
  }

  return (
    <div className="dealer-page">
      {dealer && (
        <div className="dealer-info">
          <h1>{dealer.full_name}</h1>
          <p>
            {dealer.address}, {dealer.city}, {dealer.state} {dealer.zip}
          </p>
          {username && (
            <Link to={`/postreview/${id}`} className="post-review-button">
              Post Review
            </Link>
          )}
        </div>
      )}

      <h2 className="reviews-heading">Reviews</h2>

      {reviews.length === 0 && <p>No reviews yet for this dealer.</p>}

      <div className="reviews-list">
        {reviews.map((review) => (
          <div className="review-card" key={review.id}>
            <div className="review-card-header">
              <span className="reviewer-name">{review.name}</span>
              <span className={sentimentClass(review.sentiment)}>
                {sentimentLabel(review.sentiment)}
              </span>
            </div>
            <p className="review-text">{review.review}</p>
            <p className="review-car-info">
              {review.car_year} {review.car_make} {review.car_model}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dealer;
