import HeroSection from "@/components/HeroSection";
import Notification from "@/components/Notification";
import RecentShoots from "@/components/RecentShoots";
import ServicesSection from "@/components/ServicesSection";
import Testimonials from "@/components/Testimonials";

export default function HomePage() {
  return (
    <>
      <Notification />
      <HeroSection />
      <ServicesSection />
      <RecentShoots />
      <Testimonials />
    </>
  );
}
