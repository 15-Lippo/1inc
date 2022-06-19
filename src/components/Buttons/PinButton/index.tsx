import { IconButton, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

import { useAppSelector } from '../../../store/hooks';
import { PinIcon, UnpinIcon } from '../../icons/PinIcon';

const StyledIconButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  margin: '0 0 18px',
  height: '16px',
  width: '16px',
  padding: '0',
  '&:hover': {
    background: theme.palette.background.default,
  },
  '&:hover .pinIcon': {
    fill: theme.palette.dark[900],
    stroke: theme.palette.dark[900],
  },
  '&:hover .unpinIcon': {
    stroke: theme.palette.dark[900],
  },
}));

interface Props {
  id: string;
  onPin: (val: string) => void;
  onUnpin: (val: string) => void;
}

const PinButton = ({ id, onPin, onUnpin }: Props) => {
  const pinned = useAppSelector((state) => state.tokens.tokens[id].pinned);

  return (
    <StyledIconButton id={id} edge="end" onClick={() => (pinned ? onUnpin(id) : onPin(id))}>
      {pinned ? <PinIcon classNamePath="pinIcon" /> : <UnpinIcon classNamePath="unpinIcon" />}
    </StyledIconButton>
  );
};

export default PinButton;
