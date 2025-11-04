import { Quote, UserCircle2Icon } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rahul & Priya Sharma",
      feedback:
        "Absolutely loved our wedding photos! Every shot was so natural and emotional — the team truly made our day unforgettable.",
      location: "Jaipur, Rajasthan",
    },
    {
      name: "Neha & Arjun Mehta",
      feedback:
        "From pre-wedding to the big day, they captured every precious moment beautifully. The cinematic video left us speechless!",
      location: "Delhi, India",
    },
    {
      name: "Sneha Patel",
      feedback:
        "Their professionalism and creativity are unmatched. They made my sister’s engagement shoot look like a movie!",
      location: "Ahmedabad, Gujarat",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Real stories from couples and clients who trusted us to capture their
          most beautiful moments.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Quote className="text-blue-600 w-8 h-8 mx-auto mb-4" />
              <p className="text-gray-700 italic mb-6">“{t.feedback}”</p>
              <div className="flex items-center justify-center gap-3">
                <UserCircle2Icon className="w-10 h-10 text-gray-400" />
                <div className="text-start">
                  <h1 className="font-semibold text-gray-900">{t.name}</h1>
                  <p className="text-sm text-gray-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
