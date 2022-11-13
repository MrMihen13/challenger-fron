import { ToastContainer } from "react-toastify";
import { Router } from "./sections";
import "./styles/index.css";
import "./styles/themes.css";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Router />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
    </>
  );
}
