import { Camera, Heart, Sparkles, Users } from "lucide-react";

const Highlights = () => {
  return (
    <section className="bg-[#fff7ed] py-16">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-serif font-bold text-[#1e293b] mb-10">
          Why Choose Our{" "}
          <span className="text-[#d97706]">Wedding Photography?</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Camera,
              title: "Candid & Traditional Shots",
              desc: "Balanced blend of documentary-style and classic poses.",
            },
            {
              icon: Heart,
              title: "Emotional Storytelling",
              desc: "Every photo is crafted to reflect love and connection.",
            },
            {
              icon: Users,
              title: "Creative Team",
              desc: "Experienced photographers and editors with artistic vision.",
            },
            {
              icon: Sparkles,
              title: "Premium Quality",
              desc: "Edited to perfection with professional color grading.",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 flex items-center justify-center mx-auto bg-[#fff1d6] rounded-full mb-5">
                  <Icon className="w-7 h-7 text-[#d97706]" />
                </div>
                <h4 className="text-xl font-semibold text-[#1e293b] mb-2 font-serif">
                  {item.title}
                </h4>
                <p className="text-[#64748b] text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
