import React, { CSSProperties } from 'react';

const SelectDownArrowButton = ({ color }: { color: CSSProperties['color'] }) => {
  return (
    <svg
      className="selectDownArrowButton"
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <path
        id="select-down-arrow-button"
        d="M9.6364 1.6364C9.98787 1.28492 9.98787 0.715076 9.6364 0.363604C9.28492 0.0121321 8.71508 0.012132 8.3636 0.363604L9.6364 1.6364ZM5 5L4.3636 5.6364C4.53239 5.80518 4.76131 5.9 5 5.9C5.23869 5.9 5.46761 5.80518 5.6364 5.6364L5 5ZM1.6364 0.363604C1.28492 0.0121317 0.715076 0.0121317 0.363604 0.363604C0.0121317 0.715075 0.0121317 1.28492 0.363604 1.6364L1.6364 0.363604ZM8.3636 0.363604L4.3636 4.3636L5.6364 5.6364L9.6364 1.6364L8.3636 0.363604ZM5.6364 4.3636L1.6364 0.363604L0.363604 1.6364L4.3636 5.6364L5.6364 4.3636Z"
        fill={color}
      />
    </svg>
  );
};

export default SelectDownArrowButton;
