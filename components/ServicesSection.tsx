import Image from "next/image";
import Link from "next/link";

export default function ServicesSection() {
  const services = [
    {
      title: "Cinematic Videography",
      img: "/wedding1.jpg",
      desc: "Professional cinematic films crafted to capture the emotions and grandeur of your special day with a cinematic touch.",
    },
    {
      title: "Candid Photography",
      img: "/wedding2.jpg",
      desc: "Authentic, spontaneous moments captured naturally — perfect for couples and families who love genuine expressions.",
    },
    {
      title: "Traditional Videography",
      img: "/wedding3.jpg",
      desc: "Classic style videography that beautifully documents every ritual and celebration with clarity and tradition.",
    },
    {
      title: "Traditional Photography",
      img: "/wedding1.jpg",
      desc: "Timeless portraits and event captures following traditional styles, ensuring no important moment is missed.",
    },
    {
      title: "Pre-Wedding Shoot",
      img: "/wedding2.jpg",
      desc: "Stylish pre-wedding sessions filled with creativity, storytelling, and emotion — capturing your love before the big day.",
    },
    {
      title: "Post-Wedding",
      img: "/wedding1.jpg",
      desc: "Beautifully captured post-wedding sessions that celebrate your journey together after the grand ceremony.",
    },
    {
      title: "Live Set-Up",
      img: "/wedding1.jpg",
      desc: "Complete live event setups with multi-camera coverage and instant streaming for weddings and functions.",
    },
    {
      title: "Drone Videography",
      img: "/wedding2.jpg",
      desc: "Aerial drone coverage that provides breathtaking views and cinematic perspectives for your shoots.",
    },
    {
      title: "Other Events Photography",
      img: "/wedding3.jpg",
      desc: "From birthdays to corporate events, we offer professional photography for all occasions and celebrations.",
    },
  ];

  return (
    <section className="w-full py-16 bg-gray-50" id="services">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Our Photography Services
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Whether it’s your wedding, pre-wedding, or an event — we ensure every
          moment is captured beautifully.
        </p>

        {/* Service Cards */}
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden hover:scale-105"
            >
              <div className="relative w-full h-56">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={50}
                />
              </div>
              <div className="p-6  text-justify">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <Link
                  href={`/services/${service.title.toLowerCase().replace(
                    /\s+/g,
                    "-"
                  )}`}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  View Sample →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
