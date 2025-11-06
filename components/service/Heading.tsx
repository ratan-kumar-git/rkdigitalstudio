interface HeroSectionProps {
  title: string;
  description?: string;
  imgUrl?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, description, imgUrl }) => {
  return (
    <section
      className={`relative flex items-center justify-center text-center py-16 px-6 ${
        imgUrl ? "bg-cover bg-center text-white" : "bg-[#fffefc] text-[#1e293b]"
      }`}
      style={imgUrl ? { backgroundImage: `url(${imgUrl})` } : {}}
    >
      <div className="absolute inset-0 bg-black/40 " aria-hidden="true"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 drop-shadow-md">
          {title}
        </h1>
        {description && (
          <p className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto opacity-90">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
