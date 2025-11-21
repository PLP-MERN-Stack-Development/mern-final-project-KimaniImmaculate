import { Routes, Route } from "react-router-dom";
// Assuming you've renamed components to match the code provided earlier:
import LandingPage from "./pages/LandingPage"; // Used to be Home
import AuthForm from "./pages/AuthForm";       // Consolidated Login and Signup
import CreateWishlist from "./pages/CreateWishlist";
import WishlistDetail from "./pages/WishlistDetail"; // Used to be ViewWishlist


function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* CONSOLIDATED AUTH ROUTE: 
        This single route handles both login and signup states internally.
      */}
      <Route path="/auth" element={<AuthForm />} /> 
      
      <Route path="/create-wishlist" element={<CreateWishlist />} />
      
      {/* DYNAMIC ROUTE: 
        The :wishlistId parameter is crucial for sharing and viewing.
      */}
      <Route path="/wishlist/:wishlistId" element={<WishlistDetail />} />
    </Routes>
  );
}

export default App;




