import { Avatar, IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  position: 'relative',
  border: '1px solid',
  borderRadius: '12px',
  borderColor: theme.palette.cool[300],
  maxWidth: 'fit-content',
  alignSelf: 'flex-start',
  '&:hover': {
    background: theme.palette.cool[100],
  },
  '& .MuiListItemButton-root': {
    padding: '9px 12px',
  },
  '&:hover .MuiListItemButton-root': {
    background: 'none',
  },
  '&:hover .removeButton': {
    display: 'flex',
  },
}));

const StyledIconButtonRemove = styled(IconButton)(({ theme }) => ({
  display: 'none',
  position: 'absolute',
  top: -25,
  right: -20,
  boxShadow: '-1px 1px 2px 0.5px rgba(0, 0, 0, 0.11)',
  height: '14px',
  width: '14px',
  padding: '0',
  background: theme.palette.background.default,
  '&:hover': {
    background: theme.palette.background.default,
  },
  '&:hover #remove-button-vector-1, &:hover #remove-button-vector-2': {
    stroke: theme.palette.dark[900],
  },
}));

interface Props {
  id: string;
  symbol: string;
  logo: string;
  onChoose: (val: string) => void;
  onUnpin: (val: string) => void;
}

const PinnedToken = ({ id, symbol, logo, onChoose, onUnpin }: Props) => {
  return (
    <StyledListItem
      id={id}
      secondaryAction={
        <StyledIconButtonRemove className="removeButton" aria-label="remove-button" onClick={() => onUnpin(id)}>
          <svg
            id="remove-button"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              id="remove-button-vector-1"
              d="M8.82858 8.82825L3.17173 3.17139"
              stroke="#9BAFCD"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              id="remove-button-vector-2"
              d="M8.82846 3.17151L3.17161 8.82836"
              stroke="#9BAFCD"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </StyledIconButtonRemove>
      }
      disablePadding>
      <ListItemButton onClick={() => onChoose(id)}>
        <Avatar src={logo} alt={symbol} sx={{ height: '24px', width: '24px' }} />
        <ListItemText
          primaryTypographyProps={{
            ml: '8px',
            typography: 'rxs12',
            lineHeight: '14px',
            color: 'dark.900',
          }}
          primary={symbol}
        />
      </ListItemButton>
    </StyledListItem>
  );
};

export default PinnedToken;
