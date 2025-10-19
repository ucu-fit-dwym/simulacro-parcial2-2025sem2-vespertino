import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Country from "./Country";
import End from "./End";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:cca3" element={<Country />} />
      <Route path="/end" element={<End />} />
    </Routes>
  );
}
