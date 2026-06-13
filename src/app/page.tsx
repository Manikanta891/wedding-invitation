"use client";

import Hero from "./components/Hero";
import Story from "./components/Story";
import Events from "./components/Events";
import Gallery from "./components/Gallery";
import Wishes from "./components/Wishes";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Story />
      <Events />
      <Gallery />
      <Wishes />
      <Footer />
    </main>
  );
}
