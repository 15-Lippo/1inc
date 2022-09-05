import { IconButton, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React from 'react';

import { PinIcon, UnpinIcon } from '../../icons';

const StyledIconButton: StyledComponent<any> = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  margin: '0 0 18px',
  height: '16px',
  width: '16px',
  padding: '0',
  '&:hover': {
    background: theme.palette.widget['bg-main'],
  },
  '&:hover .pinIcon': {
    fill: theme.palette.widget['icon-01'],
    stroke: theme.palette.widget['icon-01'],
  },
  '&:hover .unpinIcon': {
    stroke: theme.palette.widget['icon-01'],
  },
}));

interface Props {
  id: string;
  onPin: (val: string) => void;
  onUnpin: (val: string) => void;
  pinned: boolean;
}

const PinButton = ({ id, onPin, onUnpin, pinned }: Props) => {
  return (
    <StyledIconButton id={id} edge="end" onClick={() => (pinned ? onUnpin(id) : onPin(id))}>
      {pinned ? <PinIcon classNamePath="pinIcon" /> : <UnpinIcon classNamePath="unpinIcon" />}
    </StyledIconButton>
  );
};

export default PinButton;
