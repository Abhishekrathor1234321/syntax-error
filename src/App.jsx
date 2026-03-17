import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import OfferSection from "./components/OfferSection";
import CommunitySection from "./components/CommunitySection";
import NotesPage from "./components/NotesPage";
import RoadmapPage from "./components/Page/RoadmapPage";
import CoursesPage from "./components/Page/CoursesPage";
import PrivacyPolicy from "./components/Page/PrivacyPolicy";
import TermsConditions from "./components/Page/TermsConditions";
import SupportPage from "./components/Page/SupportPage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <OfferSection />
            <CommunitySection />
          </>
        } />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;