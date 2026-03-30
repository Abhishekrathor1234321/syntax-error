import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, Star, Clock, ExternalLink, Tag, Users, Globe } from "lucide-react";
import PageLayout from "../PageLayout";

const courses = [
  { 
    title: "The Complete Data Structure & Algorithm Course 2026", 
    instructor: "Abhishek Rathor [Founder/DSA-Mentor]", 
    rating: 5.0, 
    students: "10k+", 
    duration: "70 hours+", 
    price: "₹299*", 
    amount: 299,
    language: "English", 
    tags: ["Array", "String", "Two Pointer", "Sliding Window", "Linked-List", "Tree", "Recursion", "Graph", "Dynamic Programming", "100+ LeetCode Qs"], 
    badge: "⚡ Most Popular", 
    enrollLink: "https://topmate.io/syntaxerrorr/2010540", 
    btnLabel: "Enroll Now",
    detailLink: "/course-detail/dsa",
    useRazorpay: false
  },
  { 
    title: "Complete Aptitude Course 2026", 
    instructor: "Karina Sharma [Infosys-DSE]", 
    rating: 4.9, 
    students: "5k+", 
    duration: "40 hours+", 
    price: "₹99", 
    amount: 99,
    language: "English", 
    tags: ["Quantitative", "Verbal", "Reasoning", "Data Interpretation", "Puzzles", "Speed Math"],  
    badge: "🚀 Top Selling", 
    btnLabel: "Enroll Now",
    detailLink: "/course-detail/aptitude",
    useRazorpay: true  // ← Razorpay use karega
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const CoursesPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRazorpayPayment = async (course) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Pehle login karo!");
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      // Step 1 — Order create karo
      const res = await fetch("https://syntax-error-1xds.vercel.app/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount: course.amount, courseTitle: course.title })
      });

      const data = await res.json();
      if (!data.success) {
        alert("Order create karne mein error!");
        return;
      }

      // Step 2 — Razorpay checkout open karo
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        name: "Syntax Error",
        description: course.title,
        order_id: data.order.id,
        handler: async function (response) {
          // Step 3 — Payment verify karo
          const verifyRes = await fetch("https://syntax-error-1xds.vercel.app/payment/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseTitle: course.title
            })
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("🎉 Payment successful! Course enrolled!");
            window.location.href = "/dashboard";
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: localStorage.getItem("user") || "",
        },
        theme: {
          color: "#3b82f6"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment mein error aaya!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="courses">
      <PageLayout title="Courses" subtitle="Hand-picked free and paid courses from top platforms to fast-track your programming career.">
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <motion.div
              key={course.title}
              variants={item}
              className={`bg-card border rounded-lg p-5 hover:border-primary/30 transition-colors cursor-pointer group flex flex-col justify-between ${
                course.featured ? "border-secondary/20" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div className="flex items-center gap-2">
                  {course.badge ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-400 font-semibold animate-pulse">
                      {course.badge}
                    </span>
                  ) : course.featured ? (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-secondary/10 text-secondary font-semibold">
                      FEATURED
                    </span>
                  ) : null}
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <h3 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {course.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mb-3 font-mono">
                <span className="flex items-center gap-1"><Star className="w-3 h-3 text-secondary" />{course.rating}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{course.language}</span>
                <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{course.price}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {course.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-accent text-muted-foreground">{t}</span>
                ))}
              </div>
              {course.detailLink && (
  <button
    className="course-detail-btn"
    onClick={() => navigate(course.detailLink)}
  >
    View Details
  </button>
)}


              <div className="mt-auto pt-3">
                {course.useRazorpay ? (
                  // Razorpay Button
                  <button
                    onClick={() => handleRazorpayPayment(course)}
                    disabled={loading}
                    className="mt-4 w-fit block mx-auto text-center text-xs font-semibold px-6 py-2 rounded-md transition-all duration-200 bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white"
                  >
                    {loading ? "Processing..." : course.btnLabel}
                  </button>
                ) : (
                  // Normal Link Button
                  course.enrollLink && (
                    <a
                      href={course.enrollLink}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-4 w-fit block mx-auto text-center text-xs font-semibold px-6 py-2 rounded-md transition-all duration-200 ${
                        course.price === "Free"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-black"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white"
                      }`}
                    >
                      {course.btnLabel}
                    </a>
                  )
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </PageLayout>
    </section>
  );
};

export default CoursesPage;
