'use client';

import { useState, useEffect } from 'react';
import styles from './ResponsiveDashboard.module.css';

export const ResponsiveCard = ({ title, children, icon }) => {
  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
};

export const ResponsiveGrid = ({ columns = 'auto', gap = '16px', children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : columns === 'auto' ? 'repeat(auto-fit, minmax(250px, 1fr))' : columns,
    gap: gap
  };

  return <div style={gridStyle}>{children}</div>;
};

export const ResponsiveTable = ({ headers, data, renderRow }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (isMobile) {
    // モバイル用カード表示
    return (
      <div className={styles.mobileTable}>
        {data.map((item, index) => (
          <div key={index} className={styles.mobileTableRow}>
            {renderRow(item, true)}
          </div>
        ))}
      </div>
    );
  }

  // デスクトップ用テーブル表示
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={{
                padding: '16px 12px',
                textAlign: 'left',
                fontWeight: '600',
                color: '#5d4e37',
                borderBottom: '2px solid #c79a42',
                background: 'linear-gradient(135deg, #fcfbf8 0%, #e7e6e4 100%)'
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} style={{
              borderBottom: '1px solid rgba(199, 154, 66, 0.1)',
              background: index % 2 === 0 ? 'rgba(252, 251, 248, 0.3)' : 'transparent'
            }}>
              {renderRow(item, false)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ResponsiveMetricCard = ({ title, formula, value, target, isAchieved }) => {
  return (
    <div className={styles.metricCard}>
      <h3 className={styles.metricTitle}>{title}</h3>
      <div className={styles.metricFormula}>{formula}</div>
      <div className={styles.metricValue}>{value}%</div>
      <div className={styles.metricTarget} style={{
        color: isAchieved ? '#22c55e' : '#ef4444'
      }}>
        目標: {target}%以上 • {isAchieved ? '✅ 達成' : '❌ 要改善'}
      </div>
    </div>
  );
};

export const ResponsiveButton = ({ onClick, children, variant = 'primary', fullWidth = false }) => {
  const buttonStyle = {
    background: variant === 'primary' 
      ? 'linear-gradient(135deg, #c79a42 0%, #b8873b 100%)'
      : 'white',
    color: variant === 'primary' ? '#fcfbf8' : '#5d4e37',
    padding: '14px 24px',
    border: variant === 'primary' ? 'none' : '1px solid #c79a42',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.2s',
    boxShadow: variant === 'primary' 
      ? '0 4px 12px rgba(199, 154, 66, 0.3)'
      : '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  return (
    <button onClick={onClick} style={buttonStyle}>
      {children}
    </button>
  );
};

export const useResponsive = () => {
  const [device, setDevice] = useState('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDevice('mobile');
      } else if (width < 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return {
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    device
  };
};