import React from "react";
import { NavBar } from "./NavBar";
import { Toaster } from "@/components/ui/toaster";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50" data-id="zvzmt36si" data-path="src/components/Layout.tsx">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-6" data-id="m5fvct457" data-path="src/components/Layout.tsx">
        {children}
      </main>
      <footer className="py-6 border-t bg-white" data-id="xdt91ahc4" data-path="src/components/Layout.tsx">
        <div className="container mx-auto px-4 text-center text-gray-500" data-id="0j9x2cygs" data-path="src/components/Layout.tsx">
          <p data-id="3g66ape33" data-path="src/components/Layout.tsx">© {new Date().getFullYear()} EventPulse. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>);

};