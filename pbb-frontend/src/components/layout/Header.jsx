const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/60">
      <div className="px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <div className="w-20 h-20 flex items-center justify-center">
              <img
                src="/images/gokul_bhajan_logo.png"
                alt="Gokul Bhajan Logo"
                className="w-full h-full object-contain"
              />
            </div> */}
            <div className="w-20 h-20 flex items-center justify-center">
              <img
                src="/images/bhakti_base_logo.webp"
                alt="Bhakti Base Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Pure Bhakti Base
              </h1>
              <p className="text-sm text-slate-600 font-medium">Unlocking the Eternal Teachings of Yugācārya Śrīla Bhaktivedānta Nārāyaṇa Gosvāmī Mahārāja</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg">
              <img
                src="/images/gurudev.jpg"
                alt="Gurudev"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-30 h-30 rounded-full overflow-hidden border-2 border-yellow-400 shadow-lg">
              <img
                src="/images/radha_krishna_sevakunj.png"
                alt="Radha Krishna"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
