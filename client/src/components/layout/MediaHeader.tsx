import React from 'react';

const MediaHeader = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-subtle-light dark:border-subtle-dark px-6 bg-surface-light dark:bg-surface-dark/80 backdrop-blur-sm z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>auto_awesome_mosaic</span>
          <span className="text-text-primary-light dark:text-text-primary-dark">Content Platform</span>
        </div>
        <nav className="hidden md:flex items-center gap-1 bg-subtle-light dark:bg-subtle-dark p-1 rounded-lg ml-6">
          <a className="px-3 py-1.5 text-sm font-medium rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors" href="#">Projects</a>
          <a className="px-3 py-1.5 text-sm font-medium rounded-md bg-surface-light dark:bg-surface-dark shadow-sm text-primary" href="#">Media Library</a>
          <a className="px-3 py-1.5 text-sm font-medium rounded-md text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors" href="#">Analytics</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center size-10 rounded-full hover:bg-subtle-light dark:hover:bg-subtle-dark transition-colors">
          <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">notifications</span>
        </button>
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9" data-alt="User avatar image" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDck7zCf9XMZqZEhXakgc2AEPIDYTu5PRz8O-PIavLH04EXXHxB1OEBoYkJobTPrOh1BAKBRLph-rMmb1p6q4rvIeRILni6JyYSdXlQVIXYUP5UaHTl7cEx-6jvAKHy9k_kVnfY2qX2dIcKRgOfmhpd0ktErdA2k3BMwigehz7Vvb3-4ZmH1fOwbrYHz4DN1DzzO5OD1YWiu3Iri8rcOZNRcdTUY6zeTcvZIZy-nwv7cQErf6c8LWB0F0TGzWPJng9exuw-2K6lgYs")' }}></div>
      </div>
    </header>
  );
};

export default MediaHeader;
