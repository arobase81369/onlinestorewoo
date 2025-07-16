import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 mt-10">
        
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-6 text-sm text-gray-700">
        {/* Our Collections */}
        <div>
          <h4 className="md:text-lg font-bold mb-3">Our Collections</h4>
          <ul className="space-y-2">
            <li><Link href="#">Traditional Wear</Link></li>
            <li><Link href="#">Western</Link></li>
            <li><Link href="#">Ethnic Wear</Link></li>
            <li><Link href="#">Trending Designs</Link></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className="md:text-lg font-bold mb-3">Useful Links</h4>
          <ul className="space-y-2">
            <li><Link href="#">Contact Us</Link></li>
            <li><Link href="#">Terms & Conditions</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">FAQs</Link></li>
            <li><Link href="#">Support</Link></li>
            <li><Link href="#">Testimonials</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="md:text-lg font-bold mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link href="#">Blogs</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Returns</Link></li>
            <li><Link href="#">Cancellation</Link></li>
            <li><Link href="#">Support</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="md:text-lg font-bold mb-3">Socials Media</h4>
          <div className="flex gap-4 text-xl">
            <Link href="#"><Twitter /></Link>
            <Link href="#"><Instagram /></Link>
            <Link href="#"><Facebook /></Link>
            <Link href="#"><Youtube /></Link>
          </div>
        </div>

        {/* Mobile App */}
        <div>
          <h4 className="md:text-lg font-bold mb-3">Download Our Mobile Apps</h4>
          <p className="text-xs text-gray-500">Coming soon on iOS and Android</p>
          {/* You can add buttons for App Store / Play Store here */}
        </div>
      </div>
    </footer>
  );
}
