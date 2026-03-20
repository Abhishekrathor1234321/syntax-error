import { motion } from "framer-motion";
import { GraduationCap, Star, Clock, ExternalLink, Tag, Users, Globe } from "lucide-react";
import PageLayout from "../PageLayout";

const courses = [
  { title: "The Complete Data Structure & Algorithm Course 2026", instructor: "Abhishek Rathor [Founder/DSA-Mentor]", rating: 5.0, students: "10k+", duration: "70 hours+", price: "₹499*", language: "English", tags: ["Array", "String", "Two Pointer", "Sliding Window", "Linked-List", "Tree", "Recursion", "Graph", "Dynamic Programming", "100+ LeetCode Qs"], badge: "⚡ Most Popular", enrollLink: "https://topmate.io/syntaxerrorr/2010540", btnLabel: "Enroll Now" },
  { title: "Complete Aptitude Course 2026", instructor: "Karina Sharma [Infosys-DSE]", rating: 4.9, students: "5k+", duration: "40 hours+", price: "₹99", language: "English", tags: ["Quantitative", "Verbal", "Reasoning", "Data Interpretation", "Puzzles", "Speed Math"],  badge: "🚀 Top Selling", enrollLink: "https://forms.gle/MJPb9Mr72jMUqc8s9", btnLabel: "Enroll Now" },
 
//   { title: "Core Java Complete Course", instructor: "Teacher:Reveal Soon", rating: 4.9, students: "20K+", duration: "40+ Hours", price: "₹399", language: "English", tags: ["Java Basics", "OOP", "Arrays", "Strings", "Collections", "Exception Handling", "Multithreading", "JDBC", "File I/O"], badge: "💎 Most Demanded", enrollLink: " ", btnLabel: "Coming Soon" },
//    { title: "Blind 75 — DSA Sheet", instructor: "", rating: 4.9, students: "100k+", duration: "Best 75 DSA Questions", price: "Free", language: "", tags: ["DSA", "LeetCode", "Patterns"], badge: " 🔥Hot & Trending", enrollLink: "https://leetcode.com/", btnLabel: "Start Practice Free" },
// 
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

const CoursesPage = () => (
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
            <p className="text-xs text-muted-foreground mb-3"> {course.instructor}</p>

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
            <div className="mt-auto pt-3">
          {course.enrollLink && (
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
)}
</div>


          </motion.div>
        ))}
      </motion.div>
    </PageLayout>
  </section>
);

export default CoursesPage;