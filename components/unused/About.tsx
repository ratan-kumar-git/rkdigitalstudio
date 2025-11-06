import Image from 'next/image'

function About() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative w-full h-[420px] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/wedding1.jpg"
            alt="Wedding Photography Sample"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#fff7ed]/60 via-transparent to-transparent"></div>
        </div>

        <div>
          <h2 className="text-3xl font-serif font-bold text-[#1e293b] mb-4">
            Storytelling Through Every Frame
          </h2>
          <p className="text-[#64748b] text-lg leading-relaxed mb-4">
            At{" "}
            <span className="text-[#d97706] font-semibold">
              RK Digital Studio
            </span>
            , we believe your wedding is more than an event — it’s an emotion.
            Our team of skilled photographers and filmmakers are dedicated to
            capturing those fleeting, heartfelt moments and turning them into
            everlasting memories.
          </p>
          <p className="text-[#64748b] text-lg leading-relaxed">
            From candid laughter to emotional vows, from timeless portraits to
            breathtaking cinematic shots — we create a visual story that
            reflects your love, personality, and celebration.
          </p>
        </div>
      </section>
  )
}

export default About