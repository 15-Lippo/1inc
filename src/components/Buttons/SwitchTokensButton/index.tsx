import { IconButton, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '../../../store/hooks';
import { switchCurrencies } from '../../../store/state/swap/swapSlice';
import SwitchTokensIcon from '../../icons/SwitchTokensIcon';

const StyledIconButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  padding: 0,
  position: 'absolute',
  top: '37.5%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.08))',
  '&:hover #switch-tokens': {
    transform: 'rotate(180deg)',
    '-webkit-transition': '0.40s',
    '-moz-transition': '0.40s',
    '-ms-transition': '0.40s',
    '-o-transition': '0.40s',
    '-webkit-transform': 'rotate(180deg)',
    '-moz-transform': 'rotate(180deg)',
    '-o-transform': 'rotate(180deg)',
    '-ms-transform': 'rotate(180deg)',
  },
}));

const SwitchTokensButton = () => {
  const dispatch = useAppDispatch();

  const onClick = () => {
    dispatch(switchCurrencies());
  };

  return (
    <StyledIconButton disableRipple aria-label="switch-button" onClick={onClick}>
      <SwitchTokensIcon />
    </StyledIconButton>
  );
};

export default SwitchTokensButton;
