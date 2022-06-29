import { CSSProperties } from 'react';
import React from 'react';

interface IconProps {
  style?: CSSProperties | undefined;
}

const SwitchTokensIcon = ({ style }: IconProps) => {
  return (
    <svg
      style={{
        ...style,
        transition: 'transform .4s ease-in-out',
      }}
      id="switch-tokens"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="white" />
      <circle cx="12" cy="12" r="11.5" stroke="#CADAF4" strokeOpacity="0.5" />
      <path d="M12.0164 17L12.0164 7" stroke="#2F8AF5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M16.0327 12.9663L12.0173 16.9996L8 12.9663"
        stroke="#2F8AF5"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default SwitchTokensIcon;
