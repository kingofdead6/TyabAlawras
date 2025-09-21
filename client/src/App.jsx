import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import Footer from "./components/Shared/Footer";
import Navbar from "./components/Shared/NavBar";
import AboutPage from "./Pages/AboutPage";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminAnnouncements from "./components/Admin/AdminAnnoucements";
import AdminGallery from "./components/Admin/AdminGallery";
import AdminMenu from "./components/Admin/AdminMenu";
import AdminContact from "./components/Admin/AdminContact";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import AdminUsers from "./components/Admin/AdminUser";
import AdminNewsletter from "./components/Admin/AdminNewsletter";
import NotFound from "./components/Shared/NotFound";
import ScrollToTop from "./components/Shared/ScrollTop";
import AdminWorkingTimes from "./components/Admin/AdminWorkingTimes";
import AdminOrders from "./components/Admin/AdminOrders";
import Cart from "./components/Home/Cart";
import Checkout from "./components/Home/Checkout";
import AdminDeliveryAreas from "./components/Admin/AdminDeliveryAreas";
import OrderConfirmation from "./components/Home/OrderConfirmation";
import AdminVideos from "./components/Admin/AdminVideos";
import LinkTree from "./Pages/LinkTree";
import FoodRating from "./components/Home/FoodRating";
import AdminRating from "./components/Admin/AdminRating";

export default function App() {

  return (
    <Router>
       <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart /> }/>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/rating" element={<FoodRating />} />
          <Route path="/order-confirmation" element={<OrderConfirmation /> }/>
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/announcements" element={<AdminAnnouncements />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/menu" element={<AdminMenu />} />
              <Route path="/admin/contact" element={<AdminContact />} />
              <Route path="/admin/rating" element={<AdminRating />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/newsletter" element={<AdminNewsletter />} />
              <Route path="/admin/working-times" element={<AdminWorkingTimes />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/delivery-areas" element={<AdminDeliveryAreas />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
            </Route>
          <Route path="/linktree" element={<LinkTree />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
    </Router>
  );
}
