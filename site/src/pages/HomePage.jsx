import Hero from "../components/Hero";
import About from "../components/About";
import CurrentlyBuilding from "../components/CurrentlyBuilding";
import Journey from "../components/Journey";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Contact from "../components/Contact";

function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <CurrentlyBuilding />
      <Journey />
      <Skills />
      <Projects />
      <Contact />
    </>
  );
}

export default HomePage;
