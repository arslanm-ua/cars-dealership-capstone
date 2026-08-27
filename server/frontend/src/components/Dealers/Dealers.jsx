import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Dealers.css";

const Dealers = () => {
  const { state } = useParams();
  const navigate = useNavigate();

  const [dealers, setDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username");

  // Fetch the full, unfiltered dealer list once so the state dropdown
  // always offers every state, regardless of the current filter.
  useEffect(() => {
    const fetchAllForStates = async () => {
      try {
        const res = await axios.get("/djangoapp/get_dealers/");
        const data = res.data;
        if (data && data.status === 200 && Array.isArray(data.dealers)) {
          const uniqueStates = Array.from(
            new Set(data.dealers.map((d) => d.state).filter(Boolean))
          ).sort();
          setStates(uniqueStates);
        }
      } catch (err) {
        // Non-fatal for the page; the dropdown will just be empty.
        console.error("Failed to load state list", err);
      }
    };
    fetchAllForStates();
  }, []);

  // Fetch the dealer list to display, filtered by state when present.
  useEffect(() => {
    const fetchDealers = async () => {
      setLoading(true);
      setError("");
      try {
        const url = state
          ? `/djangoapp/get_dealers/${state}/`
          : "/djangoapp/get_dealers/";
        const res = await axios.get(url);
        const data = res.data;
        if (data && data.status === 200 && Array.isArray(data.dealers)) {
          setDealers(data.dealers);
        } else {
          setDealers([]);
          setError("Unable to load dealers.");
        }
      } catch (err) {
        setDealers([]);
        setError("Unable to load dealers.");
      } finally {
        setLoading(false);
      }
    };
    fetchDealers();
  }, [state]);

  const handleStateChange = (e) => {
    const selected = e.target.value;
    if (selected === "ALL") {
      navigate("/");
    } else {
      navigate(`/dealers/state/${selected}`);
    }
  };

  return (
    <div className="dealers-page">
      <div className="dealers-header">
        <h1>Our Dealers</h1>
        <div className="state-filter">
          <label htmlFor="state-select">Filter by State:</label>
          <select
            id="state-select"
            value={state || "ALL"}
            onChange={handleStateChange}
          >
            <option value="ALL">All States</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading dealers...</p>}
      {error && <p className="dealers-error">{error}</p>}

      {!loading && !error && dealers.length === 0 && (
        <p>No dealers found{state ? ` in ${state}` : ""}.</p>
      )}

      {!loading && dealers.length > 0 && (
        <table className="dealers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Address</th>
              <th>State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((dealer) => (
              <tr key={dealer.id}>
                <td>
                  <Link to={`/dealer/${dealer.id}`} className="dealer-link">
                    {dealer.full_name}
                  </Link>
                </td>
                <td>{dealer.city}</td>
                <td>{dealer.address}</td>
                <td>{dealer.state}</td>
                <td>
                  {username && (
                    <Link
                      to={`/postreview/${dealer.id}`}
                      className="review-button"
                    >
                      Review Dealer
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dealers;
