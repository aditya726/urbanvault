import { Building2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t">
      {/* --- FIX: Added responsive padding --- */}
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <Building2 />
          <p className="text-center text-sm leading-loose md:text-left">
          Urban Vault
          </p>
        </div>
        <p className="text-center text-sm md:text-left">
          © {new Date().getFullYear()} Urban Vault, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}