"use client";

interface VideoSamplesProps {
  videos: string[];
}

export default function ServiceVideos({ videos }: VideoSamplesProps) {
  return (
    <section className="bg-[#fffefc] pb-10" id="videos">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1e293b]">
            Our <span className="text-[#d97706]">Videos</span>
          </h2>
          <p className="text-[#64748b] mt-3 text-lg max-w-2xl mx-auto">
            Experience our storytelling through cinematic films — blending
            emotion, music, and art.
          </p>
        </div>

        {/* Video Grid */}
        {videos.length === 0 ? (
          <div className="text-center text-[#94a3b8] italic py-12">
            No videos added yet. Start by adding one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {videos.map((videoId, idx) => (
              <div
                key={idx}
                className="relative group rounded-xl overflow-hidden border border-amber-100 shadow-sm hover:shadow-md transition-all bg-white"
              >
                {/* Video Frame */}
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={`YouTube Video ${idx + 1}`}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
