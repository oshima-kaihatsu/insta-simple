// レスポンシブデザイン用のユーティリティ
export const getResponsiveStyles = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024;

  return {
    isMobile,
    isTablet,
    isDesktop,
    
    // コンテナ幅
    maxWidth: isMobile ? '100%' : isTablet ? '100%' : '1200px',
    padding: isMobile ? '16px' : isTablet ? '24px' : '40px 20px',
    
    // フォントサイズ
    h1Size: isMobile ? '24px' : isTablet ? '28px' : '32px',
    h2Size: isMobile ? '20px' : isTablet ? '24px' : '28px',
    h3Size: isMobile ? '18px' : isTablet ? '20px' : '24px',
    bodySize: isMobile ? '14px' : '16px',
    smallSize: isMobile ? '12px' : '14px',
    
    // グリッド
    gridColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(250px, 1fr))',
    tableLayout: isMobile ? 'vertical' : 'horizontal',
    
    // スペーシング
    gap: isMobile ? '12px' : isTablet ? '16px' : '20px',
    marginBottom: isMobile ? '20px' : isTablet ? '28px' : '32px'
  };
};

// メディアクエリ定数
export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1200px'
};

// レスポンシブグリッドスタイル
export const responsiveGrid = (columns = { mobile: 1, tablet: 2, desktop: 4 }) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`,
  '@media (min-width: 768px)': {
    gridTemplateColumns: `repeat(${columns.tablet}, 1fr)`
  },
  '@media (min-width: 1024px)': {
    gridTemplateColumns: `repeat(${columns.desktop}, 1fr)`
  }
});