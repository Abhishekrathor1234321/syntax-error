import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import PracticePage from "./components/Page/PracticePage";
import AuthPage from "./components/Page/AuthPage";
import PrivateRoute from "./components/PrivateRoute";
import DashboardPage from "./components/Page/DashboardPage";
import AptitudeCoursePage from "./components/Page/AptitudeCoursePage";
import AdminDashboard from "./components/Page/AdminDashboard";
import DSACourseDetail from "./components/Page/DSACourseDetail";
import AptitudeCourseDetail from "./components/Page/AptitudeCourseDetail";
import DSACoursePage from "./components/Page/DSACoursePage";

import ChallengePage from "./components/Page/ChallengePage";
import ChallengeSchedule from "./components/Page/ChallengeSchedule";
import ChallengeDay from "./components/Page/ChallengeDay";

import TCSCourseDetail from "./components/Page/TCSCourseDetail";
import "./App.css";



// ✅ Admin Route — sirf tumhara email personallyy
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const ADMIN_EMAIL = "abhishekrathor7447@gmail.com"; //  apna email daalo

  if (!token) return <Navigate to="/login" />;
  if (email !== ADMIN_EMAIL) return <Navigate to="/" />;
  return children;
};

function App() {
  const [showJobsPopup, setShowJobsPopup] = useState(false);

  return (
    <div className="app">
      <Navbar showJobsPopup={showJobsPopup} setShowJobsPopup={setShowJobsPopup} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <HeroSection />
            <OfferSection setShowJobsPopup={setShowJobsPopup} />
            <CommunitySection />
          </>
        } />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/support" element={<SupportPage />} />

        <Route path="/course-detail/dsa" element={<DSACourseDetail />} />
       <Route path="/course-detail/aptitude" element={<AptitudeCourseDetail />} />
         <Route path="/course-detail/tcs2026" element={<TCSCourseDetail />} />

       <Route path="/challenge" element={<ChallengePage />} />
<Route path="/challenge/schedule" element={<ChallengeSchedule />} />
<Route path="/challenge/day/:day" element={<ChallengeDay />} />

        {/* Protected Routes — Login required */}
        <Route path="/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
        <Route path="/roadmap" element={<PrivateRoute><RoadmapPage /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
        <Route path="/practice" element={<PrivateRoute><PracticePage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/course/:courseTitle" element={ <PrivateRoute><AptitudeCoursePage /></PrivateRoute> } />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
       
        <Route path="/dsa-course/:courseTitle" element={<PrivateRoute><DSACoursePage /></PrivateRoute>} />
        </Routes>
      <Footer />
    </div>
  );
}

export default App;