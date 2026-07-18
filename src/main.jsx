import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("Saral crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#14213D",
            color: "#EDE6D6",
            fontFamily: "IBM Plex Sans, sans-serif",
            padding: 24,
            textAlign: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: 22, marginBottom: 8 }}>Something went wrong.</h1>
            <p style={{ color: "#B9AF95", fontSize: 14 }}>
              Refresh the page. If this keeps happening, check the browser console for details.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
