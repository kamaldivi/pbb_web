const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-slate-200/60">
      <div className="px-4 md:px-6 py-4 md:py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            {/* <div className="w-16 md:w-20 h-16 md:h-20 flex items-center justify-center flex-shrink-0">
              <img
                src="/images/gokul_bhajan_logo.png"
                alt="Gokul Bhajan Logo"
                className="w-full h-full object-contain"
              />
            </div> */}
            <div className="w-14 md:w-20 h-14 md:h-20 flex items-center justify-center flex-shrink-0">
              <img
                src="/images/bhakti_base_logo.webp"
                alt="Bhakti Base Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 bg-clip-text text-transparent">
                Pure Bhakti Base
              </h1>
              <p className="text-xs md:text-sm text-slate-600 font-medium line-clamp-2 md:line-clamp-1">Unlocking the Eternal Teachings of Yugācārya Śrīla Bhaktivedānta Nārāyaṇa Gosvāmī Mahārāja</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3 md:space-x-4 flex-shrink-0">
            <div className="w-30 h-30 rounded-lg overflow-hidden border border-slate-300 shadow-lg">
              <img
                src="/images/gurudeva.JPG"
                alt="Gurudeva"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-30 h-30 rounded-lg overflow-hidden border border-slate-300 shadow-lg">
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
