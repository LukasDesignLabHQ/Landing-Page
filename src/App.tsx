import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import Policy from "./pages/Policy/Policy";
import AICarpenterChat from "./components/Body/AICarpenterChat";
import WaitlistDashboard from "./components/Admin/waitlist-dashboard";
import NotFound from "./components/Admin/NotFound";
import WaitlistPage from "./pages/WaitlistPage/WaitlistPage";

function App() {
  return (
    <HelmetProvider>
      <div style={{}}>
        <Navbar />
        <AICarpenterChat />
        <main className="pt-24 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/admin" element={<WaitlistDashboard />} />

            <Route path="/waitlist" element={<WaitlistPage />} />
    
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </HelmetProvider>
  );
}

export default App;
