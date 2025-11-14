import { Camera, ClipboardList, CheckCircle2, LogInIcon } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="max-w-7xl mx-auto text-center px-6 py-20">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1e293b]">
        How It <span className="text-[#d97706]">Works</span>
      </h1>
      <p className="text-[#64748b] mt-4 text-lg md:text-xl max-w-2xl mx-auto">
        Booking your photography or videography service is easy and seamless.
        Just follow these three simple steps.
      </p>

      {/* Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10 mt-16">
        {/* Step 1 */}
        <div className="bg-white border border-amber-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex justify-center mb-5">
            <LogInIcon className="w-12 h-12 text-[#d97706]" />
          </div>
          <h3 className="text-xl font-semibold text-[#b45309] mb-3">
             1. Login
          </h3>
          <p className="text-gray-600 text-sm">
            Create an account or sign in to continue with the booking process.
          </p>
        </div>
        {/* Step 1 */}
        <div className="bg-white border border-amber-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex justify-center mb-5">
            <Camera className="w-12 h-12 text-[#d97706]" />
          </div>
          <h3 className="text-xl font-semibold text-[#b45309] mb-3">
            2. Browse Services
          </h3>
          <p className="text-gray-600 text-sm">
            Explore all available photography and videography services with
            detailed descriptions and sample work.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-amber-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex justify-center mb-5">
            <ClipboardList className="w-12 h-12 text-[#d97706]" />
          </div>
          <h3 className="text-xl font-semibold text-[#b45309] mb-3">
            3. Choose a Package
          </h3>
          <p className="text-gray-600 text-sm">
            Select a package that fits your requirements and budget. Each
            package includes clear features and pricing.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-amber-200 p-8 rounded-2xl shadow-sm hover:shadow-md transition">
          <div className="flex justify-center mb-5">
            <CheckCircle2 className="w-12 h-12 text-[#d97706]" />
          </div>
          <h3 className="text-xl font-semibold text-[#b45309] mb-3">
            4. Book the Service
          </h3>
          <p className="text-gray-600 text-sm">
            Submit your booking request. We will confirm availability and update
            your booking status promptly.
          </p>
        </div>
      </div>

      {/* Footer small note */}
      <p className="text-gray-400 text-sm mt-10">
        Quick • Simple • Transparent
      </p>
    </div>
  );
}
