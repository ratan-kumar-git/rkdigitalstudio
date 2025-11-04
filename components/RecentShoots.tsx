import YouTubeEmbed from "./YouTubeEmbed";

export default function RecentShoots() {
  const shoots = [
    {
      title: "Beautiful Wedding Shoot – Jaipur Palace",
      videoUrl: "tHckmMuhVAs",
    },
    {
      title: "Romantic Pre-Wedding – Goa Beach",
      videoUrl: "tHckmMuhVAs",
    },
    {
      title: "Outdoor Portfolio Shoot – Studio RK",
      videoUrl: "tHckmMuhVAs",
    },
  ];

  return (
    <section className="w-full py-16 bg-white" id="recent-shoots">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Recent Shoots
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Explore some of our latest photography and wedding shoots. Each moment
          captured with love, passion, and precision.
        </p>

        {/* YouTube Video Grid */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
          {shoots.map((shoot, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden hover:scale-105"
            >
              <div className="aspect-video p-4">
                <YouTubeEmbed videoId={shoot.videoUrl} />
              </div>
              <div className="p-4 pt-0 text-left">
                <h3 className=" text-gray-800">
                  {shoot.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
