/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Certificates from './components/Certificates';
import Marquee from './components/Marquee';
import Comments from './components/Comments';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';

export default function App() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen overflow-x-hidden selection:bg-primary selection:text-white">
        <Preloader />
        <CustomCursor />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Marquee />
          <Skills />
          <Projects />
          <Certificates />
          <Comments />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
