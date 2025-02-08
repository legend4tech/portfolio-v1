import { About } from "@/components/root/About";
import { Contact } from "@/components/root/Contact";
import { Footer } from "@/components/root/Footer";
import { Hero } from "@/components/root/Hero";
import { Navbar } from "@/components/root/Navbar";
import { Portfolio } from "@/components/root/Portfolio";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main className="min-h-screen">
        <section id="home">
          <Hero />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="portfolio">
          <Portfolio />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
}
