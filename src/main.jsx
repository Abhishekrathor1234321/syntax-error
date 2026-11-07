import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ✅ Session expired detect karne ke liye (fetch wale calls)
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const res = await originalFetch(...args);
  if (res.status === 403) {
    try {
      const data = await res.clone().json();
      if (data.code === "SESSION_EXPIRED") {
        window.dispatchEvent(new Event("session-expired"));
      }
    } catch (e) {
      // JSON nahi tha, ignore
    }
  }
  return res;
};

// ✅ Session expired ka purana alert band karo (modal dikhega)
const originalAlert = window.alert;
window.alert = (msg) => {
  if (typeof msg === "string" && msg.includes("JWT token wrong or expired")) {
    return;
  }
  originalAlert(msg);
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);