const YouTubeEmbed = ({ videoId }: { videoId: string }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden bg-black">
      <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="w-full h-full absolute top-0 left-0"
        ></iframe>
    </div>
  );
};

export default YouTubeEmbed;