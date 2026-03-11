import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <>
      <Hero />
      <About showPhoto={false} />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}

export default HomePage;
