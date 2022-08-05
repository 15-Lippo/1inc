import { useTheme } from '@mui/material';
import { MenuItem, MenuItemProps, Select, SelectChangeEvent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React, { useState } from 'react';

import { MainnetChainId } from '../../../constants';
import { NetworkListBtnType, SupportedChainId } from '../../../types';
import {
  ArbitrumLogo,
  AvalancheLogo,
  BinanceSmartChainLogo,
  EthereumLogo,
  FantomLogo,
  GnosisLogo,
  OptimismLogo,
  PolygonLogo,
  SelectDownArrowButton,
} from '../../icons';

const networkListBtn: Record<string, NetworkListBtnType> = {
  [SupportedChainId[MainnetChainId]]: {
    label: MainnetChainId,
    name: 'Ethereum',
    logo: EthereumLogo,
  },
  [SupportedChainId[SupportedChainId.BINANCE]]: {
    label: SupportedChainId.BINANCE,
    name: 'BNB',
    logo: BinanceSmartChainLogo,
  },
  [SupportedChainId[SupportedChainId.POLYGON]]: {
    label: SupportedChainId.POLYGON,
    name: 'Polygon',
    logo: PolygonLogo,
  },
  [SupportedChainId[SupportedChainId.OPTIMISM]]: {
    label: SupportedChainId.OPTIMISM,
    name: 'Optimism',
    logo: OptimismLogo,
  },
  [SupportedChainId[SupportedChainId.ARBITRUM_ONE]]: {
    label: SupportedChainId.ARBITRUM_ONE,
    name: 'Arbitrum',
    logo: ArbitrumLogo,
  },
  [SupportedChainId[SupportedChainId.GNOSIS]]: {
    label: SupportedChainId.GNOSIS,
    name: 'Gnosis',
    logo: GnosisLogo,
  },
  [SupportedChainId[SupportedChainId.AVALANCHE]]: {
    label: SupportedChainId.AVALANCHE,
    name: 'Avalanche',
    logo: AvalancheLogo,
  },
  [SupportedChainId[SupportedChainId.FANTOM]]: {
    label: SupportedChainId.FANTOM,
    name: 'Fantom',
    logo: FantomLogo,
  },
};

const StyledMenuItem: StyledComponent<any> = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  columnGap: '5px',
  padding: '9px 10px',
  backgroundColor: theme.palette.widget['bg-02'],
  lineHeight: '16px',
  color: theme.palette.widget['text-primary-02'],
  '&.Mui-selected': {
    backgroundColor: `${theme.palette.widget['bg-02']} !important`,
    '& span': { color: theme.palette.widget['text-primary-01'] },
  },
  '&:hover': { backgroundColor: `${theme.palette.widget['bg-05']} !important` },
}));

const SwitchNetworkButton = () => {
  const theme = useTheme();
  const [network, setNetwork] = useState<string>(MainnetChainId.toString());

  const changeNetwork = (event: SelectChangeEvent) => {
    setNetwork(event.target.value);
  };

  const background = {
    [MainnetChainId]: theme.palette['gradientEth'],
    [SupportedChainId.ARBITRUM_ONE]: theme.palette['gradientArbitrum'],
    [SupportedChainId.OPTIMISM]: theme.palette['gradientOptimism'],
    [SupportedChainId.POLYGON]: theme.palette['gradientPolygon'],
    [SupportedChainId.BINANCE]: theme.palette['gradientBnb'],
    [SupportedChainId.AVALANCHE]: theme.palette['gradientAvalanche'],
    [SupportedChainId.FANTOM]: theme.palette['gradientFantom'],
    [SupportedChainId.GNOSIS]: theme.palette['gradientGnosis'],
  };

  return (
    <Select
      id="switch-network"
      style={{
        background: background[network],
      }}
      sx={{
        borderRadius: '12px',
        minWidth: '132px',
        cursor: 'pointer',
        '& .MuiOutlinedInput-input': {
          display: 'flex',
          alignItems: 'center',
          columnGap: '5px',
          minHeight: '20px',
          padding: '8px 10px',
          lineHeight: '16px',
          '& span': {
            color: 'widget.text-primary-02',
          },
          '& svg': {
            minWidth: '20px',
          },
        },
        '& fieldset': {
          border: 'none',
        },
        '& .selectDownArrowButton': {
          position: 'absolute',
          right: '7px',
          userSelect: 'none',
          pointerEvents: 'none',
        },
        '& [aria-expanded=true] ~ .selectDownArrowButton': {
          transform: 'rotate(180deg)',
          WebkitTransform: 'rotate(180deg)',
          MozTransform: 'rotate(180deg)',
          OTransform: 'rotate(180deg)',
          MsTransform: 'rotate(180deg)',
        },
      }}
      value={network}
      onChange={changeNetwork}
      IconComponent={() => <SelectDownArrowButton color={theme.palette.widget['icon-06']} />}
      MenuProps={{
        MenuListProps: {
          sx: {
            padding: '8px 0',
            backgroundColor: 'widget.bg-02',
          },
        },
        TransitionProps: {
          style: {
            borderRadius: '16px',
            backgroundColor: theme.palette.widget['bg-02'],
          },
        },
      }}>
      {Object.values(networkListBtn).map((network: NetworkListBtnType) => (
        <StyledMenuItem key={network.name} value={network.label}>
          {network.logo()}
          <Typography color="widget.text-primary" variant="rsm14">
            {network.name}
          </Typography>
        </StyledMenuItem>
      ))}
    </Select>
  );
};

export default SwitchNetworkButton;
