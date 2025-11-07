import HeroSection from "@/components/Home/HeroSection";
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
      <VideoSamples />
      <Testimonials />
    </>
  );
}
