// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import Footer from "./components/Shared/Footer";
import Navbar from "./components/Shared/NavBar";
import AboutPage from "./Pages/AboutPage";

export default function App() {

  return (
    <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Footer />
    </Router>
  );
}
