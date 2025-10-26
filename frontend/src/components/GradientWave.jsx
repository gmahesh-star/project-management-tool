import React from 'react';

const GradientWave = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top Wave */}
      <svg
        className="absolute top-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '40%' }}
      >
        <path
          fill="url(#gradient1)"
          fillOpacity="0.3"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgb(210, 180, 140)', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: 'rgb(245, 222, 179)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(222, 184, 135)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>

      {/* Bottom Wave */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        style={{ height: '40%' }}
      >
        <path
          fill="url(#gradient2)"
          fillOpacity="0.25"
          d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,234.7C672,245,768,235,864,213.3C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
        <defs>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: 'rgb(139, 92, 46)', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: 'rgb(160, 120, 80)', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: 'rgb(184, 134, 11)', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default GradientWave;
