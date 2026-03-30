const ContactPage = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Contact Us</h2>
      </div>

      {/* About the Organization */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-6 border border-slate-100">
        <h2 className="text-xl font-bold text-blue-700 mb-4">About Us</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          Pure Bhakti Base is operated by <span className="font-semibold">Gokul Bhavan Gaudiya Matha</span> (also known as Gokul Bhajan &amp; Vedic Studies), an independent registered 501(c)(3) non-profit religious organization. Our programs are designed for the whole family, helping individuals engage in a blissful devotional life with Lord Krishna at the center.
        </p>
        <p className="text-slate-700 leading-relaxed mb-4">
          We follow the teachings of Śrī Caitanya Mahāprabhu in the line of the Six Goswamis under the Śrī Brahma-Madhva-Gaudiya Sampradāya. We are not affiliated with or controlled by any other organization.
        </p>
        <p className="text-slate-700 leading-relaxed">
          Our organization also conducts impactful community initiatives, including a prison ministry program that has transformed many lives. Currently, our programs reach over <span className="font-semibold">750 prisons</span>, with nearly <span className="font-semibold">1,700 inmates</span> actively participating. We are also recognized as an agency supporting <span className="font-semibold">Presidential Volunteer Service Awards</span> for community service.
        </p>
      </div>

      {/* Website & App Inquiries */}
      <div className="bg-white rounded-2xl shadow-md p-8 mb-6 border border-slate-100">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Website &amp; Mobile App Inquiries</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          For questions related to the Pure Bhakti Base website or mobile applications, please contact:
        </p>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">Email:</span>
          <a
            href="mailto:bkdasa@gmail.com"
            className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
          >
            bkdasa@gmail.com
          </a>
        </div>
      </div>

      {/* Content Licensing */}
      <div className="bg-white rounded-2xl shadow-md p-8 border border-slate-100">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Content Licensing</h2>
        <p className="text-slate-700 leading-relaxed mb-4">
          Some of the content provided through this website and mobile app is owned by{' '}
          <span className="font-semibold">Gaudiya Vedanta Publications</span> and is licensed under{' '}
          <span className="font-semibold">CC BY-ND 3.0</span>.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-slate-500 font-medium mt-0.5 shrink-0">License details:</span>
            <a
              href="https://purebhakti.com/pluslicense"
              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              purebhakti.com/pluslicense
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium shrink-0">Email:</span>
            <a
              href="mailto:gvp.contactus@gmail.com"
              className="text-blue-600 hover:text-blue-800 underline font-medium transition-colors"
            >
              gvp.contactus@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
