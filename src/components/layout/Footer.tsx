import Link from "next/link";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-navy-900 text-gray-300">
      <div className="container-max px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <span className="text-lg font-bold text-white">IC</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">ICRACE 2026</p>
                <p className="text-xs text-gray-400">International Conference on Research and Advanced Computing</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-md">
              ICRACE 2026 is a premier academic conference bringing together researchers, academicians, and industry professionals to discuss advances in computing and research.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="badge bg-amber-500/20 text-amber-300">PROTOTYPE DEMO</span>
              <span className="text-gray-500">Sample data — not a live conference</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-teal-400 transition">About</Link></li>
              <li><Link href="/tracks" className="hover:text-teal-400 transition">Research Tracks</Link></li>
              <li><Link href="/registration" className="hover:text-teal-400 transition">Registration</Link></li>
              <li><Link href="/call-for-papers" className="hover:text-teal-400 transition">Call for Papers</Link></li>
              <li><Link href="/programme" className="hover:text-teal-400 transition">Programme</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition">Contact & FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-teal-400 flex-shrink-0" />
                <span>National Institute of Technology<br />Rourkela, Odisha, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>icrace2026@example.edu</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>+91 000 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-teal-400 flex-shrink-0" />
                <span>icrace2026.example.edu</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          <p>© 2026 ICRACE Conference Portal. Prototype for demonstration purposes only.</p>
          <p className="mt-1">All conference details, dates, fees, and data shown are sample/placeholder content.</p>
        </div>
      </div>
    </footer>
  );
}
