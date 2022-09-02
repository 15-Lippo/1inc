import { FormControl, MenuItem, MenuItemProps, Select, SelectChangeEvent, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React, { useEffect, useState } from 'react';

import { getNetworkConfig } from '../../../constants/networks';
import { useActiveWeb3React } from '../../../packages/web3-provider';
import { NetworkListBtnType, SupportedChainId } from '../../../types';
import { switchNetwork } from '../../../utils';
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
  [SupportedChainId[SupportedChainId.MAINNET]]: {
    label: SupportedChainId.MAINNET,
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

if (process.env.NODE_ENV === 'development') {
  networkListBtn[SupportedChainId[SupportedChainId.LOCALHOST]] = {
    label: SupportedChainId.LOCALHOST,
    name: 'Localhost',
    logo: () => <></>,
  };
}

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
  const { chainId, connector, account } = useActiveWeb3React();
  const theme = useTheme();
  const [network, setNetwork] = useState<string>();

  useEffect(() => {
    const info = getNetworkConfig(chainId);
    const onSupportedChain = info !== undefined;
    if (chainId && onSupportedChain) {
      // in select component we can't choose an object, but we can save full object as a sting
      const supportedOption = JSON.stringify(networkListBtn[SupportedChainId[chainId.toString()]]);
      setNetwork(supportedOption);
    }
    if (!onSupportedChain) setNetwork('');
  }, [chainId]);

  // useEffect(() => {
  //   const chainChanged = (chainId: string) => setNetwork(parseInt(chainId, 16).toString());
  //   ethereum.on('chainChanged', chainChanged);
  //   return () => ethereum.removeListener('chainChanged', chainChanged);
  // }, []);

  const changeNetwork = async (event: SelectChangeEvent) => {
    try {
      const v = JSON.parse(event.target.value);
      await switchNetwork(connector, Number(v.label), account);
    } catch (err) {
      console.error('Error in changeNetwork:', err);
    }
  };

  const background = {
    [SupportedChainId.MAINNET]: theme.palette['gradientEth'],
    [SupportedChainId.LOCALHOST]: theme.palette['gradientEth'],
    [SupportedChainId.ARBITRUM_ONE]: theme.palette['gradientArbitrum'],
    [SupportedChainId.OPTIMISM]: theme.palette['gradientOptimism'],
    [SupportedChainId.POLYGON]: theme.palette['gradientPolygon'],
    [SupportedChainId.BINANCE]: theme.palette['gradientBnb'],
    [SupportedChainId.AVALANCHE]: theme.palette['gradientAvalanche'],
    [SupportedChainId.FANTOM]: theme.palette['gradientFantom'],
    [SupportedChainId.GNOSIS]: theme.palette['gradientGnosis'],
  };

  return (
    <FormControl>
      <Select
        style={{
          background: network ? background[JSON.parse(network).label] : theme.palette.widget['bg-03'],
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
            '&.Mui-disabled': {
              WebkitTextFillColor: theme.palette.widget['text-disabled'],
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
          '&.Mui-disabled': {
            background: theme.palette.widget['bg-disabled'],
          },
        }}
        id="switch-network"
        labelId="custom-select-label"
        onChange={changeNetwork}
        displayEmpty
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
        }}
        value={network || ''}
        renderValue={(v) =>
          v && network ? (
            <Typography
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: 'inherit',
              }}
              color="widget.text-primary-02"
              variant="rsm14">
              {networkListBtn[SupportedChainId[JSON.parse(network).label]]?.logo()}
              &nbsp;&nbsp;
              {JSON.parse(network).name}
            </Typography>
          ) : (
            <Typography color="widget.text-primary-02" variant="rsm14">
              Switch network
            </Typography>
          )
        }>
        {Object.values(networkListBtn).map((v: NetworkListBtnType) => (
          <StyledMenuItem key={v.name} value={JSON.stringify(v)}>
            {v?.logo()}
            <Typography color="widget.text-primary" variant="rsm14">
              {v.name}
            </Typography>
          </StyledMenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SwitchNetworkButton;
