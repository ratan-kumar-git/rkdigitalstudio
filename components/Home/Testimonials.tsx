'use client';

import Image from "next/image";

const testimonials = [
  {
    name: "Aarav & Priya",
    role: "Wedding Couple",
    message:
      "RK Digital Studio captured our wedding so beautifully! Every photo tells a story — the colors, emotions, and details were beyond what we imagined. Highly recommended!",
    image: "/user1.jpg",
  },
  {
    name: "Rahul Verma",
    role: "Birthday Event",
    message:
      "Amazing experience! The team was so professional and creative. The cinematic video they made for my birthday looks like a movie trailer — absolutely loved it!",
    image: "/user2.jpg",
  },
  {
    name: "Sneha Patel",
    role: "Pre Wedding Shoot",
    message:
      "We loved every moment working with RK Digital Studio. The pre-wedding photoshoot was relaxed and full of laughter. The results were breathtaking!",
    image: "/user3.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-linear-to-t bg-[#fffefc] py-20" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b]">
            What Our <span className="text-[#d97706]">Clients Say</span>
          </h2>
          <p className="text-[#64748b] mt-3 text-lg max-w-2xl mx-auto">
            Real stories from real people — our clients share their experiences working with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl p-8 transition-all duration-300 border border-gray-100 hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-[#1e293b] font-semibold text-lg">
                    {t.name}
                  </h4>
                  <p className="text-[#d97706] text-sm">{t.role}</p>
                </div>
              </div>

              <p className="text-[#64748b] leading-relaxed text-sm">
                “{t.message}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
