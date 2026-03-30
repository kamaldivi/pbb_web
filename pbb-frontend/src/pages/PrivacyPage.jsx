const policies = [
  {
    title: 'No Personal Data Collection',
    body: 'We do not collect or store any personal information such as your name, email address, or location.',
  },
  {
    title: 'No Accounts Required',
    body: 'You can use the website and mobile app without signing up or logging in.',
  },
  {
    title: 'Local Storage Only',
    body: 'Bookmarks and downloaded content are stored only on your device and are never transmitted to our servers.',
  },
  {
    title: 'No Tracking or Advertising',
    body: 'We do not use tracking technologies, profiling analytics, or advertisements of any kind.',
  },
  {
    title: 'Optional Technical Diagnostics',
    body: 'We may use anonymous crash reporting in the future to improve app performance. This data does not identify individual users.',
  },
  {
    title: 'Non-Commercial Platform',
    body: 'Pure Bhakti Base does not sell products or services and does not monetize user data in any way.',
  },
  {
    title: 'Safe for All Ages',
    body: 'Content is carefully curated and suitable for a general audience, focused solely on spiritual learning.',
  },
];

const PrivacyPage = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 border border-slate-200">
      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Privacy Policy</h2>
        <p className="text-sm text-slate-500 mt-1">Last Updated: March 2026</p>
      </div>

      {/* Introduction */}
      <p className="text-slate-700 leading-relaxed mb-6">
        Pure Bhakti Base is designed to provide a simple, private, and distraction-free spiritual experience.
        This Privacy Policy applies to both the website (<span className="font-medium">purebhaktibase.com</span>) and
        the Pure Bhakti Base mobile applications. We are committed to protecting your privacy and have built
        this platform with that principle at its core.
      </p>

      {/* Policy Sections */}
      <div className="space-y-5">
        {policies.map((item, index) => (
          <div key={index}>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {index + 1}.&nbsp; {item.title}
            </h3>
            <p className="text-slate-700 leading-relaxed pl-5">{item.body}</p>
          </div>
        ))}
      </div>

      {/* Contact for Privacy Questions */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-2">Questions About This Policy</h3>
        <p className="text-slate-700 leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a
            href="mailto:bkdasa@gmail.com"
            className="text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            bkdasa@gmail.com
          </a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
