import React from 'react';
import { MediaAsset } from '@/lib/mock-data';

interface MediaDetailsSidebarProps {
    selectedAsset: MediaAsset | undefined;
}

const MediaDetailsSidebar: React.FC<MediaDetailsSidebarProps> = ({ selectedAsset }) => {
    if (!selectedAsset) {
        return (
            <aside className="w-[340px] shrink-0 border-r border-subtle-light dark:border-subtle-dark bg-surface-light dark:bg-surface-dark overflow-y-auto hidden @[1024px]:block p-6">
                <h2 className="text-xl font-bold">Media Details</h2>
                <p className="text-text-secondary-dark mt-4">Select an asset to see details.</p>
            </aside>
        );
    }

    return (
        <aside className="w-[340px] shrink-0 border-r border-subtle-light dark:border-subtle-dark bg-surface-light dark:bg-surface-dark overflow-y-auto hidden @[1024px]:block">
            <div className="p-6 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Media Details</h2>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="rounded-lg overflow-hidden border border-subtle-dark">
                        <div className="aspect-video bg-cover bg-center" style={{ backgroundImage: `url('${selectedAsset.imageUrl}')` }}></div>
                        <div className="p-4 border-t border-subtle-dark bg-subtle-dark/30">
                            <h3 className="font-bold">{selectedAsset.name}</h3>
                            <p className="text-sm text-text-secondary-dark">{selectedAsset.size} • {selectedAsset.dimensions}</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark px-1">Version Control</h3>
                        <div className="flex flex-col gap-1">
                            {/* Mock Version Data */}
                            <div className="flex items-center justify-between p-3 rounded-lg bg-subtle-dark">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>history</span>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Version 3 (Current)</span>
                                        <span className="text-xs text-text-secondary-dark">Uploaded 2 days ago</span>
                                    </div>
                                </div>
                                <button className="text-sm text-primary font-semibold hover:underline">Revert</button>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-subtle-dark">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-text-secondary-dark" style={{ fontSize: '20px' }}>history</span>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">Version 2</span>
                                        <span className="text-xs text-text-secondary-dark">Uploaded 5 days ago</span>
                                    </div>
                                </div>
                                <button className="text-sm text-primary font-semibold hover:underline">Revert</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark px-1">Cloud Storage</h3>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-subtle-dark">
                            <img alt="Google Drive logo" className="w-6 h-6" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBMO36r5La4dzrfl_MrNFPHTzGi578dmYt5Rj6MBVkc91rqNr0-9DwSNsxxDHQcbDHpYJDZRj6li81XSkboluXvS_994IRnT3xtant_7cKnFXtnJghujULxc2rjLPrAYsE0xfLE9SUcHqamSDCASii-ymHihTmeyMxemwleuEhjAb3AoKQWHYWZeb7-H7bHSWygidrzaiWMgZDUivbgY4Sh-dg9n0jbULRQ2n6yCpph7ffuOcZSf2DT8WM3QGpEOTRSQM5hoXzrQQ" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">Synced with Google Drive</span>
                                <span className="text-xs text-text-secondary-dark">Last sync: 1 hour ago</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark px-1">Audit Log</h3>
                        <div className="flex flex-col gap-2">
                            {/* Mock Audit Log Data */}
                            <div className="flex items-start gap-3 p-3 text-sm rounded-lg hover:bg-subtle-dark">
                                <span className="material-symbols-outlined text-text-secondary-dark mt-0.5" style={{ fontSize: '18px' }}>history_toggle_off</span>
                                <p><span className="font-semibold">User One</span> viewed asset. <span className="text-text-secondary-dark text-xs">Just now</span></p>
                            </div>
                            <div className="flex items-start gap-3 p-3 text-sm rounded-lg hover:bg-subtle-dark">
                                <span className="material-symbols-outlined text-text-secondary-dark mt-0.5" style={{ fontSize: '18px' }}>cloud_upload</span>
                                <p><span className="font-semibold">User Two</span> uploaded new version. <span className="text-text-secondary-dark text-xs">2 days ago</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default MediaDetailsSidebar;
