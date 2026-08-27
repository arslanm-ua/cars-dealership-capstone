import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PostReview.css";

const PostReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const username = localStorage.getItem("username");

  const [review, setReview] = useState("");
  const [purchase, setPurchase] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) {
      navigate("/login");
    }
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!review || !purchaseDate || !carMake || !carModel || !carYear) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("/djangoapp/add_review", {
        name: username,
        dealership: id,
        review,
        purchase,
        purchase_date: purchaseDate,
        car_make: carMake,
        car_model: carModel,
        car_year: carYear,
      });

      const data = res.data;

      if (data && (data.status === 200 || data.status === "200")) {
        navigate(`/dealer/${id}`);
        return;
      }

      if (data && data.error) {
        setError(data.error);
        return;
      }

      // Some backends simply return the created review without a status
      // field; treat any non-error response as success.
      navigate(`/dealer/${id}`);
    } catch (err) {
      const serverMessage =
        err.response && err.response.data
          ? err.response.data.message || err.response.data.error
          : null;
      setError(serverMessage || "Unable to submit review. Please try again.");
    }
  };

  if (!username) {
    return null;
  }

  return (
    <div className="post-review-container">
      <form className="post-review-form" onSubmit={handleSubmit} noValidate>
        <h2>Post a Review</h2>

        {error && <div className="post-review-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="review">Review</label>
          <textarea
            id="review"
            rows="5"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </div>

        <div className="form-group form-group-checkbox">
          <label htmlFor="purchase">
            <input
              id="purchase"
              type="checkbox"
              checked={purchase}
              onChange={(e) => setPurchase(e.target.checked)}
            />
            I purchased a vehicle from this dealer
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="purchaseDate">Purchase Date</label>
          <input
            id="purchaseDate"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="carMake">Car Make</label>
          <input
            id="carMake"
            type="text"
            value={carMake}
            onChange={(e) => setCarMake(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="carModel">Car Model</label>
          <input
            id="carModel"
            type="text"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="carYear">Car Year</label>
          <input
            id="carYear"
            type="number"
            min="1900"
            max="2100"
            value={carYear}
            onChange={(e) => setCarYear(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="post-review-button">
          Post Review
        </button>
      </form>
    </div>
  );
};

export default PostReview;
