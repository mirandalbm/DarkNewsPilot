import React from 'react';
import { MediaAsset } from '@/lib/mock-data';
import { Checkbox } from '@/components/ui/checkbox';

interface AssetCardProps {
  asset: MediaAsset;
  onSelect: (id: string) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, onSelect }) => {
  const getIconForType = (type: MediaAsset['type']) => {
    switch (type) {
      case 'Video':
        return <span className="material-symbols-outlined text-white text-5xl opacity-50 group-hover:opacity-80 transition-opacity">play_circle</span>;
      case 'Audio':
        return <span className="material-symbols-outlined text-white text-5xl opacity-50 group-hover:opacity-80 transition-opacity">graphic_eq</span>;
      default:
        return null;
    }
  };

  const handleSelect = () => {
    onSelect(asset.id);
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm transition-all duration-300 cursor-pointer ${asset.isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lg hover:-translate-y-1'}`}
      onClick={handleSelect}
    >
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 z-10 ${asset.isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'}`}></div>
      {asset.isAiGenerated && (
        <div className="absolute top-2.5 left-2.5 z-20">
          <div className="flex items-center gap-1.5 rounded-full bg-black/50 backdrop-blur-sm px-2 py-1 text-xs font-medium text-white">
            <span className="material-symbols-outlined" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span>AI</span>
          </div>
        </div>
      )}
      <div className={`absolute top-2 right-2 z-20 ${asset.isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-300'}`}>
        <Checkbox
          checked={asset.isSelected}
          onCheckedChange={handleSelect}
          className="form-checkbox h-5 w-5 rounded-md bg-white/20 backdrop-blur-sm border-white/50 text-primary focus:ring-primary focus:ring-offset-0 border-0"
        />
      </div>
      <div className="aspect-[4/3] w-full overflow-hidden">
        {asset.imageUrl ? (
          <img className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" src={asset.imageUrl} alt={asset.name} />
        ) : (
          <div className="h-full w-full bg-subtle-dark flex items-center justify-center">
            {getIconForType(asset.type)}
          </div>
        )}
      </div>
      <div className={`absolute bottom-0 left-0 p-3 w-full z-20 ${asset.isSelected ? '' : 'translate-y-full group-hover:translate-y-0 transition-transform duration-300'}`}>
        <h4 className="text-sm font-semibold text-white truncate">{asset.name}</h4>
        <p className="text-xs text-white/80">{asset.type} • {asset.size}</p>
        <p className="text-xs text-white/60">Project: {asset.project} • Last Modified: {asset.lastModified}</p>
      </div>
    </div>
  );
};

export default AssetCard;
