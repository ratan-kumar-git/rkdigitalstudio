import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "RK Digital Studio",
  description: "Manage your website with ease using RK Digital Studio",
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
