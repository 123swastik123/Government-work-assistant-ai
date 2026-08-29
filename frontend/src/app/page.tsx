import { HeroSection } from "@/components/home/HeroSection";
import { PopularServices } from "@/components/home/PopularServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";
import { FirstVisitOnboarding } from "@/components/onboarding/FirstVisitOnboarding";

export default function HomePage() {
  return (
    <>
      <FirstVisitOnboarding />
      <div className="flex flex-col">
        <HeroSection />
        <PopularServices />
        <HowItWorks />
        <TrustSection />
      </div>
    </>
  );
}
