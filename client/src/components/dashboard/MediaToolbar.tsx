import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const MediaToolbar = () => {
    return (
        <div className="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-6 md:p-8 border-b border-subtle-dark">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute top-1/2 left-5 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark pointer-events-none" style={{ fontSize: '24px' }}>search</span>
                        <Input className="form-input w-full rounded-full border-transparent bg-surface-light dark:bg-surface-dark h-14 text-text-primary-light dark:text-text-primary-dark focus:ring-2 focus:ring-primary focus:ring-inset placeholder:text-text-secondary-dark pl-14 pr-4 text-base shadow-sm" placeholder="Search by name or original prompt..." type="text" />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-subtle-light dark:bg-subtle-dark text-text-primary-light dark:text-text-primary-dark text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors hover:bg-subtle-light/80 dark:hover:bg-subtle-dark/80">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>upload</span>
                            <span className="truncate">Upload</span>
                        </Button>
                        <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2 transition-colors hover:bg-primary/90">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span>
                            <span className="truncate">Generate</span>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium bg-subtle-dark text-text-secondary-dark hover:bg-surface-dark">Type: All <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_more</span></Button>
                        <Button variant="outline" className="flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium bg-subtle-dark text-text-secondary-dark hover:bg-surface-dark">Creation Date <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_more</span></Button>
                        <Button variant="outline" className="flex items-center gap-2 px-3 h-9 rounded-lg text-sm font-medium bg-subtle-dark text-text-secondary-dark hover:bg-surface-dark">File Size <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_more</span></Button>
                        <label className="flex items-center gap-2 pr-3 pl-2 h-9 rounded-lg text-sm font-medium bg-subtle-dark text-text-secondary-dark hover:bg-surface-dark cursor-pointer">
                            <Checkbox className="form-checkbox h-4 w-4 rounded bg-surface-dark border-subtle-dark text-primary focus:ring-primary focus:ring-offset-background-dark" />
                            <span>AI-Generated</span>
                        </label>
                        <Button variant="link" className="text-sm text-primary font-medium hover:underline">Clear all</Button>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Showing 12 of 256 assets</p>
                        <div className="flex rounded-lg bg-subtle-dark view-toggle">
                            <Button variant="ghost" className="px-3 py-1.5 rounded-l-lg text-text-secondary-dark active" title="Grid View">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>grid_view</span>
                            </Button>
                            <Button variant="ghost" className="px-3 py-1.5 rounded-r-lg text-text-secondary-dark hover:bg-subtle-dark" title="List View">
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>list</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MediaToolbar;
