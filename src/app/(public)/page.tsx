import { FinalCta } from "@/components/marketing/final-cta";
import { Hero } from "@/components/marketing/hero";
import { ModulesSection } from "@/components/marketing/modules-section";
import { PatientJourney } from "@/components/marketing/patient-journey";
import { SecuritySection } from "@/components/marketing/security-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PatientJourney />
      <ModulesSection />
      <SecuritySection />
      <FinalCta />
    </>
  );
}
