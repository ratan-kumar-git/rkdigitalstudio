'use client';

const videos = [
  {
    title: "Cinematic Wedding Highlights",
    url: "https://www.youtube.com/embed/tHckmMuhVAs",
  },
  {
    title: "Pre-Wedding Teaser",
    url: "https://www.youtube.com/embed/tHckmMuhVAs",
  },
  {
    title: "Engagement Story Film",
    url: "https://www.youtube.com/embed/tHckmMuhVAs",
  },
];

export default function VideoSamples() {
  return (
    <section className="bg-[#fffefc] py-20" id="videos">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b]">
            Our <span className="text-[#d97706]">Cinematic Works</span>
          </h2>
          <p className="text-[#64748b] mt-3 text-lg max-w-2xl mx-auto">
            Experience our storytelling through cinematic films — blending emotion, music, and art.
          </p>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div
              key={index}
              className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 bg-white"
            >
              <div className="aspect-video w-full overflow-hidden">
                <iframe
                  src={video.url}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="text-[#1e293b] font-semibold text-lg font-serif">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
