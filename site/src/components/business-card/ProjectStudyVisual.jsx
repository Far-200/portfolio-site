import { useState } from "react";

const STEPS = ["Decode the problem", "Explain your reasoning", "Receive a hint", "Implement"];

export default function ProjectStudyVisual({ project }) {
  const [step, setStep] = useState(0);
  if (project.media) return <figure className="study-media"><img src={project.media.src} alt={project.media.alt} width="1600" height="1000" decoding="async" /><figcaption>ASCII tree → project scaffold</figcaption></figure>;
  if (project.id === "flowtrace") return (
    <figure className="pipeline-figure">
      <figcaption className="micro">Execution pipeline / illustrative trace</figcaption>
      <div className="trace-grid"><div><span className="micro">01 / Source</span><pre>int x = 2;{"\n"}<span className={step ? "trace-active" : ""}>x = x + 3;</span></pre></div><span className="pipeline-arrow" aria-hidden="true">→</span><div><span className="micro">02 / Parse</span><pre>Assignment{"\n"}  Identifier: x{"\n"}  BinaryExpression</pre></div><span className="pipeline-arrow" aria-hidden="true">→</span><div><span className="micro">03 / State</span><p className="trace-value" aria-live="polite">x = <span>{step ? "5" : "2"}</span></p></div></div>
      <div className="trace-bottom"><p>{step ? "Assignment executed. x is now 5." : "x starts at 2. Execute the next assignment."}</p><button className="ink-link" onClick={() => setStep((value) => 1 - value)}>{step ? "Reset trace" : "Step through"}<span className="arrow" aria-hidden="true">→</span></button></div>
    </figure>
  );
  if (project.id === "think-before-code") return (
    <figure className="socratic-figure"><figcaption className="micro">The Socratic loop</figcaption><ol>{STEPS.map((label, i) => <li key={label}><span className="micro">0{i + 1}</span><span>{label}</span></li>)}</ol><p>Answer withheld until needed.</p></figure>
  );
  return null;
}
