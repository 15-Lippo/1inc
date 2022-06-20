import { IconButton, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useAppDispatch } from '../../../store/hooks';
import { switchCurrencies } from '../../../store/state/swap/swapSlice';
import SwitchTokensIcon from '../../icons/SwitchTokensIcon';

const StyledIconButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  padding: 0,
  position: 'absolute',
  top: '36%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.08))',
  '&:hover #switch-tokens': {
    transform: 'rotate(180deg)',
    WebkitTransition: '0.40s',
    MozTransition: '0.40s',
    MsTransition: '0.40s',
    OTransition: '0.40s',
    WebkitTransform: 'rotate(180deg)',
    MozTransform: 'rotate(180deg)',
    OTransform: 'rotate(180deg)',
    MsTransform: 'rotate(180deg)',
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
