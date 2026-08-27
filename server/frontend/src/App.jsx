import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealer/Dealer";
import PostReview from "./components/PostReview/PostReview";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dealers />} />
          <Route path="/dealers/state/:state" element={<Dealers />} />
          <Route path="/dealer/:id" element={<Dealer />} />
          <Route path="/postreview/:id" element={<PostReview />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
