import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
// import './index.css'

ReactDOM.createRoot(document.getElementById("__next")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ReactDOM.hydrateRoot(
//   document.getElementById("__next")!,
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );
