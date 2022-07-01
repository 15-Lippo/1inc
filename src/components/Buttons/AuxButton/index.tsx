import { Link } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { TypographyProps } from '@mui/material/Typography';
import { SxProps } from '@mui/system';
import React from 'react';

interface AuxButtonProps {
  onClick(event: React.MouseEvent<HTMLElement>): void;
  text: string;
  variant?: TypographyProps['variant'];
  sx?: SxProps<Theme>;
}

const AuxButton = ({ onClick, text, variant, sx }: AuxButtonProps) => {
  return (
    <Link variant={variant || 'rxs12'} lineHeight="14px" href="#" sx={sx} underline="none" onClick={onClick}>
      {text}
    </Link>
  );
};

export default AuxButton;
