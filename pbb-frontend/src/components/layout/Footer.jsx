import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 mt-16">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/images/gokulbhavan_logo.png"
              alt="Gokul Bhavan Logo"
              className="w-32 h-32 object-contain"
            />
          </div>

          {/* Vision and Mission */}
          <div className="grid md:grid-cols-2 gap-8 flex-1">
            {/* Vision Section */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Pure Bhakti Base Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To preserve, organize, and make accessible the divine teachings of Yugācārya Śrīla Bhaktivedānta Nārāyaṇa Gosvāmī Mahārāja to inspire and uplift seekers on the path of pure bhakti.
              </p>
            </div>

            {/* Mission Section */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-yellow-400">Pure Bhakti Base Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To serve as a spiritual companion to devotees by offering intelligent access to Śrīla Gurudev's books and insights, enabling personalized, immersive, and multilingual learning experiences rooted in Gaudiya Vaishnava tradition.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center space-y-2">
          <p className="text-gray-400">
            © Gokul Bhavan Gaudiya Matha – Software rights reserved. © Gaudiya Vedanta Publications – Some content rights reserved.
          </p>
          <p className="text-gray-400">
            <Link to="/privacy" className="text-yellow-400 hover:text-yellow-300 underline">Privacy Policy</Link>
            {' | '}
            <Link to="/contact" className="text-yellow-400 hover:text-yellow-300 underline">Contact Us</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
