import { Route, Routes } from "react-router";
import { BrowserRouter, Navigate } from "react-router-dom";
import Document from "../pages/document";
import Todo from "../pages/home";
import { enablePatches } from "immer";
import "./App.css";

enablePatches();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Todo />} />
        <Route path="/document/:pageId" element={<Document />} />
        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
