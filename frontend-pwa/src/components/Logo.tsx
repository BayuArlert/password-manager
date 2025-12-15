import React from 'react';

export const Logo = ({ size = 80 }: { size?: number }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(180, 199, 231, 0.4))' }}
        >
            {/* Lock Body */}
            <rect
                x="20"
                y="45"
                width="60"
                height="45"
                rx="12"
                fill="url(#gradient-body)"
            />

            {/* Shackle */}
            <path
                d="M30 45V30C30 19 39 10 50 10C61 10 70 19 70 30V45"
                stroke="url(#gradient-shackle)"
                strokeWidth="12"
                strokeLinecap="round"
            />

            {/* Keyhole */}
            <circle cx="50" cy="62" r="6" fill="#FFFFFF" fillOpacity="0.9" />
            <rect x="46" y="62" width="8" height="14" rx="4" fill="#FFFFFF" fillOpacity="0.9" />

            {/* Gradients */}
            <defs>
                <linearGradient id="gradient-body" x1="20" y1="45" x2="80" y2="90" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#B4C7E7" />
                    <stop offset="100%" stopColor="#9AB3D9" />
                </linearGradient>
                <linearGradient id="gradient-shackle" x1="30" y1="10" x2="70" y2="45" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#F4C2C2" />
                    <stop offset="100%" stopColor="#D5B3E0" />
                </linearGradient>
            </defs>
        </svg>
    );
};

export default Logo;
