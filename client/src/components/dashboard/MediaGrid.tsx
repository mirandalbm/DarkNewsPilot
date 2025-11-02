import React from 'react';
import { MediaAsset } from '@/lib/mock-data';
import AssetCard from './AssetCard';

interface MediaGridProps {
  assets: MediaAsset[];
  onAssetSelect: (id: string) => void;
}

const MediaGrid: React.FC<MediaGridProps> = ({ assets, onAssetSelect }) => {
  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {assets.map(asset => (
          <AssetCard key={asset.id} asset={asset} onSelect={onAssetSelect} />
        ))}
      </div>
    </div>
  );
};

export default MediaGrid;
