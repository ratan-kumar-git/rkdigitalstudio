import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  // Basic Meta Tags
  title: {
    default: "RK Digital Studio - Professional Photography Services",
    template: "%s | RK Digital Studio"
  },
  description: "Capture your precious moments with RK Digital Studio. Professional photography services including wedding photography, portrait photography, event coverage, and commercial photography. Creating timeless memories through stunning visuals.",
  
  // Keywords for SEO (Photography-focused)
  keywords: [
    "RK Digital Studio",
    "professional photography",
    "wedding photography",
    "portrait photography",
    "event photography",
    "commercial photography",
    "photography services",
    "photographer near me",
    "photo studio",
    "product photography",
    "family photography",
    "engagement photography",
    "photography studio",
    "professional photographer"
  ],
  
  // Author and Creator
  authors: [{ name: "RK Digital Studio" }],
  creator: "RK Digital Studio",
  publisher: "RK Digital Studio",
  
  // Robots and Crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Open Graph Meta Tags (for social media sharing)
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rkdigitalstudio.vercel.app",
    siteName: "RK Digital Studio",
    title: "RK Digital Studio - Professional Photography Services",
    description: "Capture your precious moments with RK Digital Studio. Professional wedding, portrait, event, and commercial photography services. Creating timeless memories through stunning visuals.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RK Digital Studio - Professional Photography",
      },
    ],
  },
  
  // // Twitter Card Meta Tags
  // twitter: {
  //   card: "summary_large_image",
  //   title: "RK Digital Studio - Professional Photography Services",
  //   description: "Capture your precious moments with professional photography services. Weddings, portraits, events, and commercial photography.",
  //   creator: "@rkdigitalstudio", // Replace with your actual Twitter handle
  //   images: ["/twitter-image.jpg"], // Add your photography showcase image here
  // },
  
  // Additional Meta Tags
  metadataBase: new URL("https://rkdigitalstudio.vercel.app"),
  alternates: {
    canonical: "/",
  },
  
  // Verification (add your verification codes when available)
  // verification: {
  //   google: "your-google-verification-code", // Replace with actual code from Google Search Console
  //   // yandex: "your-yandex-verification-code",
  //   // bing: "your-bing-verification-code",
  // },
  
  // App-specific
  applicationName: "RK Digital Studio",
  
  // Format Detection
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  
  // Category
  category: "photography",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <Toaster
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1e293b",
              border: "1px solid #fcd34d",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              borderRadius: "10px",
            },
            success: {
              iconTheme: {
                primary: "#d97706",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#dc2626",
                secondary: "#fff",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
