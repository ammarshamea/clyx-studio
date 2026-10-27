import type { RefObject } from "react";
import { SiteHeader } from "./SiteHeader";
import { About } from "./sections/About";
import { Approach } from "./sections/Approach";
import { Clients } from "./sections/Clients";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Process } from "./sections/Process";
import { Services } from "./sections/Services";
import { Vision } from "./sections/Vision";
import { Work } from "./sections/Work";

type Props = {
  heroMarkRef: RefObject<HTMLDivElement | null>;
  live: boolean;
  markVisible: boolean;
  inert: boolean;
};

export function Landing({ heroMarkRef, live, markVisible, inert }: Props) {
  return (
    <div inert={inert}>
      <SiteHeader />
      <main>
        <Hero markRef={heroMarkRef} live={live} markVisible={markVisible} />
        <About />
        <Vision />
        <Services />
        <Work />
        <Process />
        <Approach />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
