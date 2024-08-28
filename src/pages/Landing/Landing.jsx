import React from "react";
import Header from "../../components/Landing/Header";
import Hero from "../../components/Landing/Hero";
import About from "../../components/Landing/About";
import Footer from "../../components/Landing/Footer";
import "./Landing.css";

const Landing = () => {
  return (
    <div className='select-none custom-scrollbar m-0 w-full'>
      <Header />
      <Hero />
      <About />
      <Footer />
    </div>
  );
};

export default Landing;
