import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import SelectedWork from "../components/SelectedWork";
import Contact from "../components/Contact";

function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <About showPhoto={false} />
      <Skills />
      <Contact />
    </>
  );
}

export default HomePage;
