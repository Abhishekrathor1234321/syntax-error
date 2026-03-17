import React, { useState, useEffect, useRef } from "react";
import cppImg from "../assets/cpp-placeholder.jpg";
import javaImg from "../assets/java-placeholder.jpg";
import pyImg from "../assets/python-placeholder.jpg";
import comingImg from "../assets/coming-placeholder.jpg";

const slidesData = [
  { id: 1, img: cppImg, alt: "C++ with DSA", btnText: "JOIN", btnLink: "/c++-insider", btnClass: "bg-emerald-500" , caption: "Start Your Placement Journey Today!" },
  { id: 2, img: javaImg, alt: "Java with DSA", btnText: "JOIN", btnLink: "/java-insider", btnClass: "bg-blue-600", caption: "Code Smarter. Get Hired Faster." },
  { id: 3, img: pyImg, alt: "Python with DSA", btnText: "JOIN", btnLink: "/python-insider", btnClass: "bg-red-600", caption: "Your Roadmap to Success Starts Here!" },
  { id: 4, img: comingImg, alt: "Coming Soon", btnText: "Coming Soon...", btnLink: "#", btnClass: "bg-gray-400 pointer-events-none", caption: "Stay Tuned for More!" },
];

export default function CarouselSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const total = slidesData.length;
  const trackRef = useRef(null);

  useEffect(() => {
    // Auto slide every 5s
    const t = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % total);
    }, 5000);
    return () => clearInterval(t);
  }, [total]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  function prev() {
    setCurrentSlide((s) => (s - 1 + total) % total);
  }
  function next() {
    setCurrentSlide((s) => (s + 1) % total);
  }

  return (
    <div className="relative carousel-section mx-auto max-w-4xl">
      <div className="overflow-hidden rounded">
        <div ref={trackRef} className="carousel-track">
          {slidesData.map((slide) => (
            <div className="slide" key={slide.id}>
              <div className="text-center">
                <img src={slide.img} alt={slide.alt} className="mx-auto" />
                <div className="mt-4">
                  <a href={slide.btnLink} className={`inline-block px-6 py-3 text-white font-semibold rounded-lg ${slide.btnClass} text-lg`}>
                    {slide.btnText}
                  </a>
                  <p className="text-gray-500 italic mt-2">{slide.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button aria-label="Previous" onClick={prev} className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-3 rounded-full">
        ‹
      </button>
      <button aria-label="Next" onClick={next} className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-3 rounded-full">
        ›
      </button>
    </div>
  );
}
