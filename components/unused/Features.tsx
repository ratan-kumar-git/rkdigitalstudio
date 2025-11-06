import { CheckCircle2 } from "lucide-react";

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features: string[];
}

const Features: React.FC<FeaturesProps> = ({ title, subtitle, features }) => {
  return (
    <section className="max-w-6xl mx-auto px-6 text-center">
      <h3 className="text-3xl font-serif font-bold text-[#1e293b] mb-8">
        {title} 
        <span className="text-[#d97706]">
            {subtitle}
        </span>
      </h3>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left max-w-4xl mx-auto">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-[#334155]">
            <CheckCircle2 className="w-5 h-5 text-[#d97706] mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Features;
