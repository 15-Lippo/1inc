import { IconButton, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React, { useState } from 'react';

import { REFRESH_QUOTE_DELAY } from '../../../constants';
import { useAppSelector } from '../../../store/hooks';
import { useCountdownQuote } from '../../../store/state/swap/useCountdownQuote';

const StyledIconButton: StyledComponent<any> = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  borderRadius: '12px',
  marginRight: '5px',
  padding: '0',
  height: '36px',
  width: '36px',
  background: theme.palette.background.default,
  '&:hover': {
    background: theme.palette.cool[100],
  },
}));

const RefreshQuoteButton = () => {
  const typedValue = useAppSelector((state) => state.swap.typedValue);
  const { countdown, reset } = useCountdownQuote();
  const [rotate, setRotate] = useState(false);
  const circleRadius = 5;
  const circumference = 2 * Math.PI * circleRadius;

  const setProgress = (count: number) => {
    if (!typedValue || count === 0) return;
    const offset = (count / REFRESH_QUOTE_DELAY) * circumference - circumference;
    return offset;
  };

  const onRefresh = () => {
    reset();
    setRotate(true);
    setTimeout(() => setRotate(false), 1000);
  };

  return (
    <StyledIconButton disableRipple aria-label="refresh-button" onClick={onRefresh}>
      <svg
        id="refresh-button"
        viewBox="0 0 36 36"
        width="100%"
        height="100%"
        style={{
          transition: `transform ${countdown === REFRESH_QUOTE_DELAY ? 0 : 0.8}s linear`,
          transform: rotate ? 'rotate(360deg)' : 'none',
        }}>
        <path
          stroke="none"
          fill="#E3E7EE"
          d="M 21.7751 13.29 C 19.432 10.9468 15.633 10.9468 13.2899 13.29 C 12.5285 14.0513 12.0146 14.9663 11.748 15.9351 C 11.7447 15.9499 11.7411 15.9646 11.7372 15.9793 C 11.6763 16.2064 11.6294 16.4339 11.5958 16.661 C 11.3316 18.4457 11.8925 20.2026 13.0262 21.4944 C 13.1105 21.5901 13.1984 21.6838 13.2899 21.7752 C 13.5831 22.0685 13.8991 22.325 14.2322 22.5448 C 14.7553 22.8892 15.3417 23.1568 15.9798 23.3278 C 16.2386 23.3971 16.4979 23.4484 16.7565 23.4825 C 18.4537 23.7061 20.1187 23.1866 21.3747 22.1415 C 21.5123 22.0265 21.6459 21.9044 21.7751 21.7752 C 21.7848 21.7655 21.7947 21.7561 21.8047 21.7469 C 22.5123 21.031 23.0491 20.127 23.3283 19.0851 C 23.4712 18.5517 24.0196 18.2351 24.553 18.378 C 25.0865 18.521 25.4031 19.0693 25.2602 19.6028 C 24.8141 21.2676 23.8745 22.6684 22.6409 23.6899 C 21.6883 24.4822 20.5949 25.0189 19.4515 25.3002 C 17.3607 25.8147 15.1028 25.4749 13.2328 24.2809 C 12.5686 23.8579 11.9784 23.3432 11.4752 22.7589 C 10.6234 21.7738 10.0517 20.6302 9.7601 19.4324 C 9.517 18.4416 9.461 17.3931 9.6217 16.3379 C 9.867 14.7048 10.6183 13.1331 11.8756 11.8757 C 14.9998 8.7515 20.0652 8.7515 23.1894 11.8757 L 23.7332 12.4196 L 23.7337 10.9995 C 23.7338 10.5577 24.0921 10.1996 24.534 10.1998 C 24.9758 10.2 25.3338 10.5583 25.3337 11.0001 L 25.3325 14.5328 L 25.3322 15.3325 L 24.5325 15.3325 L 24.4401 15.3325 C 24.3146 15.3567 24.1854 15.3567 24.0599 15.3325 L 21.0005 15.3324 C 20.5587 15.3324 20.2005 14.9743 20.2005 14.5324 C 20.2005 14.0906 20.5587 13.7325 21.0005 13.7325 L 22.2176 13.7325 L 21.7751 13.29 Z"
        />
        <defs>
          <path
            id="arrow"
            stroke="none"
            fill="none"
            d="M 21.7751 13.29 C 19.432 10.9468 15.633 10.9468 13.2899 13.29 C 12.5285 14.0513 12.0146 14.9663 11.748 15.9351 C 11.7447 15.9499 11.7411 15.9646 11.7372 15.9793 C 11.6763 16.2064 11.6294 16.4339 11.5958 16.661 C 11.3316 18.4457 11.8925 20.2026 13.0262 21.4944 C 13.1105 21.5901 13.1984 21.6838 13.2899 21.7752 C 13.5831 22.0685 13.8991 22.325 14.2322 22.5448 C 14.7553 22.8892 15.3417 23.1568 15.9798 23.3278 C 16.2386 23.3971 16.4979 23.4484 16.7565 23.4825 C 18.4537 23.7061 20.1187 23.1866 21.3747 22.1415 C 21.5123 22.0265 21.6459 21.9044 21.7751 21.7752 C 21.7848 21.7655 21.7947 21.7561 21.8047 21.7469 C 22.5123 21.031 23.0491 20.127 23.3283 19.0851 C 23.4712 18.5517 24.0196 18.2351 24.553 18.378 C 25.0865 18.521 25.4031 19.0693 25.2602 19.6028 C 24.8141 21.2676 23.8745 22.6684 22.6409 23.6899 C 21.6883 24.4822 20.5949 25.0189 19.4515 25.3002 C 17.3607 25.8147 15.1028 25.4749 13.2328 24.2809 C 12.5686 23.8579 11.9784 23.3432 11.4752 22.7589 C 10.6234 21.7738 10.0517 20.6302 9.7601 19.4324 C 9.517 18.4416 9.461 17.3931 9.6217 16.3379 C 9.867 14.7048 10.6183 13.1331 11.8756 11.8757 C 14.9998 8.7515 20.0652 8.7515 23.1894 11.8757 L 23.7332 12.4196 L 23.7337 10.9995 C 23.7338 10.5577 24.0921 10.1996 24.534 10.1998 C 24.9758 10.2 25.3338 10.5583 25.3337 11.0001 L 25.3325 14.5328 L 25.3322 15.3325 L 24.5325 15.3325 L 24.4401 15.3325 C 24.3146 15.3567 24.1854 15.3567 24.0599 15.3325 L 21.0005 15.3324 C 20.5587 15.3324 20.2005 14.9743 20.2005 14.5324 C 20.2005 14.0906 20.5587 13.7325 21.0005 13.7325 L 22.2176 13.7325 L 21.7751 13.29 Z"
          />
          <clipPath id="arrow-clip">
            <use xlinkHref="#arrow"></use>
          </clipPath>
        </defs>
        <g clipPath="url(#arrow-clip)">
          <circle
            cx="50%"
            cy="50%"
            r={circleRadius}
            style={{ transition: `stroke-dashoffset ${countdown ? 1 : 0}s linear` }}
            fill="none"
            stroke="#000000"
            strokeWidth="15"
            strokeDasharray={circumference}
            strokeDashoffset={typedValue && setProgress(countdown)}></circle>
        </g>
        <use xlinkHref="#arrow"></use>
      </svg>
    </StyledIconButton>
  );
};

export default RefreshQuoteButton;
