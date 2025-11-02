import React, { useState } from 'react';
import MediaHeader from '@/components/layout/MediaHeader';
import MediaDetailsSidebar from '@/components/dashboard/MediaDetailsSidebar';
import MediaGrid from '@/components/dashboard/MediaGrid';
import MediaToolbar from '@/components/dashboard/MediaToolbar';
import { mockMediaAssets, MediaAsset } from '@/lib/mock-data';

const MediaLibrary = () => {
  const [assets, setAssets] = useState<MediaAsset[]>(mockMediaAssets);
  const selectedAsset = assets.find(asset => asset.isSelected);

  const handleAssetSelection = (id: string) => {
    setAssets(prevAssets =>
      prevAssets.map(asset =>
        asset.id === id
          ? { ...asset, isSelected: !asset.isSelected }
          : asset
      )
    );
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-text-primary-light dark:text-text-primary-dark">
      <MediaHeader />
      <div className="flex flex-1 overflow-hidden">
        <MediaDetailsSidebar selectedAsset={selectedAsset} />
        <main className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
          <MediaToolbar />
          <MediaGrid assets={assets} onAssetSelect={handleAssetSelection} />
        </main>
      </div>
    </div>
  );
};

export default MediaLibrary;
