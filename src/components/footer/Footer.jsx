import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="flex flex-wrap justify-center -mx-4 mb-8">
          {/* Company Links */}
          <div className="w-1/2 sm:w-1/4 md:w-1/6 px-4 mb-6">
            <h3 className="text-xs font-semibold uppercase mb-4 text-gray-400">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/" className="hover:text-white transition">Press</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="w-1/2 sm:w-1/4 md:w-1/6 px-4 mb-6">
            <h3 className="text-xs font-semibold uppercase mb-4 text-gray-400">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Help Center</Link></li>
              <li><Link to="/" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-white transition">FAQs</Link></li>
              <li><Link to="/" className="hover:text-white transition">Community</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="w-1/2 sm:w-1/4 md:w-1/6 px-4 mb-6">
            <h3 className="text-xs font-semibold uppercase mb-4 text-gray-400">Legals</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link to="/" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-white transition">Licensing</Link></li>
              <li><Link to="/" className="hover:text-white transition">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-gray-500 text-sm">
          &copy; 2025 Jay. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
