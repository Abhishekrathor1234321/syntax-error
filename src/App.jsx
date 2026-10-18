import { useState } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
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
import TCSCoursePage from "./components/Page/TCSCoursePage";
import TCSCoursePracticePage from "./components/Page/TCSCoursePracticePage";

import TCSPYQCourseDetail from "./components/Page/TCSCourseDetailPractice";
import "./App.css";


import TcsLayout from "./components/Page/TcsPrep/TcsLayout";
import TcsLanding from "./components/Page/TcsPrep/TcsLanding";

import TcsStart from "./components/Page/TcsPrep/TcsStart";

import TcsQuiz from "./components/Page/TcsPrep/TcsQuiz";

import TcsLeaderboard from "./components/Page/TcsPrep/TcsLeaderboard";
import CodingListPage from "./components/Page/Coding/CodingListPage";
import CodingSolvePage from "./components/Page/Coding/CodingSolvePage";


import DataAnalyticsCourseDetail from "./components/Page/Dataanalyticscoursedetail";
import DataAnalyticsCoursePage from "./components/Page/Dataanalyticscoursepage";

import CSGenAICourseDetail from "./components/Page/Csgenaicoursedetail";
import CSGenAICoursePage from "./components/Page/Csgenaicoursepage";

// ✅ Admin Route — sirf tumhara email personally
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const ADMIN_EMAIL = "abhishekrathor7447@gmail.com";

  if (!token) return <Navigate to="/login" />;
  if (email !== ADMIN_EMAIL) return <Navigate to="/" />;
  return children;
};

// ✅ /course/:courseTitle — course title ke hisaab se sahi player page kholta hai
// Naya course add karna ho to bas yahan ek aur `if` add karo
const CoursePageSwitcher = () => {
  const { courseTitle } = useParams();
  const title = decodeURIComponent(courseTitle);

  if (title === "Data Analytics Placement Ready Course With Projects")
    return <DataAnalyticsCoursePage />;

  if (title === "CS Fundamentals + GenAI Placement Ready Course")
    return <CSGenAICoursePage />;

  // Default — purana Aptitude course (pehle jaisa hi)
  return <AptitudeCoursePage />;
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

        {/* <Route path="/tcs-prep" element={<TcsLayout />}>
         <Route index element={<TcsLanding />} />
          <Route path="start" element={<TcsStart />} />
        </Route>
         <Route path="/tcs-prep" element={<TcsLayout />}>
 <Route index element={<TcsLanding />} />
 <Route path="start" element={<TcsStart />} />
 <Route path="aptitude" element={<TcsQuiz type="aptitude" />} />
 <Route path="cshr" element={<TcsQuiz type="cshr" />} />
</Route>
         */}
        <Route path="/tcs-prep" element={<TcsLayout />}>
 <Route index element={<TcsLanding />} />
 <Route path="start" element={<TcsStart />} />
 <Route path="aptitude" element={<TcsQuiz type="aptitude" />} />
 <Route path="cshr" element={<TcsQuiz type="cshr" />} />
 <Route path="leaderboard" element={<TcsLeaderboard />} />
</Route>

{/* =====================================================
    CODING PAGES WITH TCS LAYOUT
   ===================================================== */}

<Route element={<TcsLayout />}>
  <Route
    path="/coding"
    element={
      <PrivateRoute>
        <CodingListPage />
      </PrivateRoute>
    }
  />

  <Route
  path="/tcs-prep/coding"
  element={
    <PrivateRoute>
      <CodingListPage />
    </PrivateRoute>
  }
/>

  <Route
    path="/coding/:slug"
    element={
      <PrivateRoute>
        <CodingSolvePage />
      </PrivateRoute>
    }
  />

  
</Route>


        <Route path="/login" element={<AuthPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/support" element={<SupportPage />} />

        <Route path="/course-detail/dsa" element={<DSACourseDetail />} />
        <Route path="/course-detail/aptitude" element={<AptitudeCourseDetail />} />
        <Route path="/course-detail/tcs2026" element={<TCSCourseDetail />} />
        {/* <Route path="/course-detail/tcs-pyq-2026" element={<TCSPYQCourseDetail />} /> */}

        {/* ✅ NEW — Data Analytics & CS Fundamentals + GenAI course detail pages */}
        <Route path="/course-detail/data-analytics" element={<DataAnalyticsCourseDetail />} />
        <Route path="/course-detail/cs-genai" element={<CSGenAICourseDetail />} />

        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/challenge/schedule" element={<ChallengeSchedule />} />
        <Route path="/challenge/day/:day" element={<ChallengeDay />} />

      
        {/* <Route path="/coding/:slug" element={<PrivateRoute><CodingSolvePage /></PrivateRoute>} /> */}




        {/* Protected Routes — Login required */}
        <Route path="/notes" element={<PrivateRoute><NotesPage /></PrivateRoute>} />
        <Route path="/roadmap" element={<PrivateRoute><RoadmapPage /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><CoursesPage /></PrivateRoute>} />
        <Route path="/practice" element={<PrivateRoute><PracticePage /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

        {/* ✅ Aptitude + Data Analytics + CS/GenAI — ek hi route, title ke hisaab se page */}
        <Route path="/course/:courseTitle" element={<PrivateRoute><CoursePageSwitcher /></PrivateRoute>} />

        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

        <Route path="/dsa-course/:courseTitle" element={<PrivateRoute><DSACoursePage /></PrivateRoute>} />

        {/* ✅ TCS Complete Course */}
        <Route path="/tcs-course/:courseTitle" element={<PrivateRoute><TCSCoursePage /></PrivateRoute>} />

        {/* ✅ TCS PYQ Practice Course */}
        {/* <Route path="/tcs-practice/:courseTitle" element={<PrivateRoute><TCSCoursePracticePage /></PrivateRoute>} /> */}

      </Routes>
      <Footer />
    </div>
  );
}

export default App;