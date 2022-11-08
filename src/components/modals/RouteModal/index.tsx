import { Avatar, Box, Typography } from '@mui/material';
import { ethereumApi } from '@yozh-io/1inch-widget-api-client';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../store';
import { roundPercentInRoutes } from '../../../utils';
import { NoLogoURI, RouteModalDivider, RouteStepArrow, WarningTriangleIcon } from '../../icons';
import { Modal, ModalHeaderType } from '../Modal';

interface RouteModalProps {
  protocols: any;
  isOpen: boolean;
  goBack: () => void;
  totalRouteSteps: number;
}

const RouteModal = ({ protocols, isOpen, goBack, totalRouteSteps }: RouteModalProps) => {
  const { t } = useTranslation();
  const { tokens, INPUT, OUTPUT, quoteError, swapError } = useAppSelector((state) => ({
    tokens: state.tokens.tokens,
    INPUT: state.swap.INPUT,
    OUTPUT: state.swap.OUTPUT,
    quoteError: state.swap.quoteError,
    swapError: state.swap.swapError,
  }));

  function renderRoutes() {
    return (
      <Box
        sx={{
          display: 'grid',
          gridAutoColumns: '1fr',
          gridAutoRows: 'auto',
          justifyItems: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: '10px',
        }}>
        {!quoteError && !swapError && protocols?.length && totalRouteSteps ? (
          protocols.flatMap((path: any, pathIndex: number) => {
            const percent = (path.length * 100) / totalRouteSteps;
            return (
              <React.Fragment key={pathIndex}>
                <Box
                  sx={{
                    gridColumn: `${pathIndex + 1}`,
                    gridRow: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    rowGap: '6px',
                    padding: '15px 0',
                  }}>
                  {protocols?.length > 1 && (
                    <Typography variant="rsm14" color="widget.text-secondary">
                      {roundPercentInRoutes(percent, 2)} %
                    </Typography>
                  )}
                  <RouteStepArrow />
                </Box>
                {path.flatMap((step: ethereumApi.PathViewDto[], stepIndex: number) => {
                  return (
                    <React.Fragment key={stepIndex}>
                      <Box
                        sx={{
                          gridColumn: `${pathIndex + 1}`,
                          gridRow: `${(stepIndex + 1) * 2}`,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                        }}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            rowGap: '6px',
                            border: '1px solid',
                            borderColor: 'widget.border-03',
                            borderRadius: '12px',
                            padding: '5px',
                          }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '4px' }}>
                            <Avatar
                              src={tokens[step[0].toTokenAddress]?.logoURI}
                              alt={tokens[step[0].toTokenAddress]?.symbol}
                              sx={{ width: 24, height: 24, backgroundColor: 'transparent' }}>
                              <NoLogoURI />
                            </Avatar>
                            <Typography variant="mm16" color="widget.text-primary">
                              {tokens[step[0].toTokenAddress]?.symbol}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              rowGap: '4px',
                            }}>
                            {step.map((prot: ethereumApi.PathViewDto, protIndex: number) => {
                              return (
                                <Box
                                  key={protIndex}
                                  sx={{
                                    borderRadius: '8px',
                                    minWidth: '118px',
                                    padding: '0 5px',
                                    backgroundColor: 'widget.bg-01',
                                  }}>
                                  <Typography
                                    variant="rxs12"
                                    color="widget.text-secondary">{`${prot.name} ${prot.part}%`}</Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ gridColumn: `${pathIndex + 1}`, gridRow: `${stepIndex * 2 + 3}`, padding: '15px 0' }}>
                        <RouteStepArrow />
                      </Box>
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              border: '1px solid',
              borderColor: 'widget.input-border-warn',
              borderRadius: '12px',
              padding: '5px 10px',
            }}>
            <WarningTriangleIcon />
            <Typography variant="rm16" color="widget.text-warn">
              {t('No liquidity for swap')}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Modal headerType={ModalHeaderType.Route} isOpen={isOpen} goBack={goBack}>
      <Box
        sx={{
          position: 'absolute',
          top: 50,
          display: 'flex',
          justifyContent: 'center',
          width: 'inherit',
          padding: '18px 0',
        }}>
        <Avatar
          alt={tokens[INPUT]?.symbol}
          src={tokens[INPUT]?.logoURI}
          sx={{ position: 'absolute', width: 32, height: 32, backgroundColor: 'transparent' }}>
          <NoLogoURI />
        </Avatar>
        <RouteModalDivider styles={{ bottom: -30 }} />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 115,
          left: 0,
          display: 'flex',
          justifyContent: `${protocols?.length > 2 ? 'flex-start' : 'center'}`,
          overflow: 'auto',
          borderLeft: '15px solid',
          borderRight: '15px solid',
          borderColor: 'widget.bg-main',
          boxSizing: 'border-box',
          width: 'inherit',
          height: '348px',
          padding: '0 10px',
        }}>
        {renderRoutes()}
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          width: 'inherit',
          padding: '18px 0 28px',
        }}>
        <RouteModalDivider styles={{ top: -28 }} />
        <Avatar
          alt={tokens[OUTPUT]?.symbol}
          src={tokens[OUTPUT]?.logoURI}
          sx={{ position: 'absolute', top: -12, width: 32, height: 32, backgroundColor: 'transparent' }}>
          <NoLogoURI />
        </Avatar>
      </Box>
    </Modal>
  );
};

export default RouteModal;
