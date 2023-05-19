import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { PostApp } from "./PostApp";
import { store } from "./state/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PostApp />
    </Provider>
    <ToastContainer position="bottom-center" />
  </React.StrictMode>
);
