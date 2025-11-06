import HeroSection from "@/components/Home/HeroSection";
import Packages from "@/components/Home/Packages";
import Portfolio from "@/components/Home/Portfolio";
import ServicesSection from "@/components/Home/ServicesSection";
import Testimonials from "@/components/Home/Testimonials";
import VideoSamples from "@/components/Home/VideoSamples";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <Portfolio />
      <Packages />
      <VideoSamples />
      <Testimonials />
    </>
  );
}
