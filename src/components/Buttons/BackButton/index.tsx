import { IconButton, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledIconButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  padding: 0,
  '&:hover #back-button #background-back': {
    fill: theme.palette.cool[100],
  },
  '&:active #back-button #back-arrow': {
    fill: theme.palette.blue[500],
  },
  '&:disabled #back-button #back-arrow': {
    fill: theme.palette.dark[500],
  },
}));

interface Props {
  disabled?: boolean;
  onClick: () => void;
}

const BackButton = ({ disabled, onClick }: Props) => {
  return (
    <StyledIconButton disabled={disabled} disableRipple aria-label="back-button" onClick={onClick}>
      <svg
        id="back-button"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          id="background-back"
          d="M0 12C0 5.37258 5.37258 0 12 0H24C30.6274 0 36 5.37258 36 12V24C36 30.6274 30.6274 36 24 36H12C5.37258 36 0 30.6274 0 24V12Z"
          fill="white"
        />
        <path
          id="back-arrow"
          d="M20.2929 24.7071C20.6834 25.0976 21.3166 25.0976 21.7071 24.7071C22.0976 24.3166 22.0976 23.6834 21.7071 23.2929L20.2929 24.7071ZM15 18L14.2929 17.2929C13.9024 17.6834 13.9024 18.3166 14.2929 18.7071L15 18ZM21.7071 12.7071C22.0976 12.3166 22.0976 11.6834 21.7071 11.2929C21.3166 10.9024 20.6834 10.9024 20.2929 11.2929L21.7071 12.7071ZM21.7071 23.2929L15.7071 17.2929L14.2929 18.7071L20.2929 24.7071L21.7071 23.2929ZM15.7071 18.7071L21.7071 12.7071L20.2929 11.2929L14.2929 17.2929L15.7071 18.7071Z"
          fill="#222222"
        />
      </svg>
    </StyledIconButton>
  );
};

BackButton.defaultProps = {
  disabled: false,
};

export default BackButton;
