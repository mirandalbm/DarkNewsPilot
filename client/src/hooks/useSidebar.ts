import { useState, useEffect } from 'react';

export interface SidebarState {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export function useSidebar() {
  const [state, setState] = useState<SidebarState>({
    isOpen: false,
    isCollapsed: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      setState(prev => ({
        ...prev,
        isMobile,
        isTablet,
        isDesktop,
        // Auto collapse no mobile/tablet por padrão
        isCollapsed: isMobile || isTablet ? true : prev.isCollapsed,
        // Sidebar fechada no mobile por padrão
        isOpen: isMobile ? false : prev.isOpen
      }));
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-collapse baseado no tamanho da tela
  useEffect(() => {
    if (state.isMobile) {
      setState(prev => ({ ...prev, isCollapsed: true }));
    }
  }, [state.isMobile]);

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const toggleCollapse = () => {
    setState(prev => ({ ...prev, isCollapsed: !prev.isCollapsed }));
  };

  const closeSidebar = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const openSidebar = () => {
    setState(prev => ({ ...prev, isOpen: true }));
  };

  const expandSidebar = () => {
    setState(prev => ({ ...prev, isCollapsed: false }));
  };

  const collapseSidebar = () => {
    setState(prev => ({ ...prev, isCollapsed: true }));
  };

  return {
    ...state,
    toggleSidebar,
    toggleCollapse,
    closeSidebar,
    openSidebar,
    expandSidebar,
    collapseSidebar
  };
}

export default useSidebar;