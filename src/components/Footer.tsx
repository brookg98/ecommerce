export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">About Us</h3>
            <p className="text-sm">
              Your trusted online store for quality products and exceptional service.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition">
                  Products
                </a>
              </li>
              <li>
                <a href="/orders" className="hover:text-white transition">
                  Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/" className="hover:text-white transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  FAQ
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Shipping
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="text-sm space-y-2">
              <li>
                <a href="/" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition">
                  Returns
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-sm">
            &copy; {currentYear} E-commerce Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
