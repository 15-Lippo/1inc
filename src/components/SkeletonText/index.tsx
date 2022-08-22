import { Skeleton } from '@mui/material';
import React, { CSSProperties } from 'react';

interface SkeletonTextProps {
  width?: string | number;
  height?: string | number;
  bgcolor?: CSSProperties['backgroundColor'];
}

const SkeletonText = ({ width, height, bgcolor }: SkeletonTextProps) => (
  <Skeleton
    animation="wave"
    height={height}
    width={width || '100px'}
    sx={{ bgcolor: bgcolor || 'widget.skeleton-00' }}
  />
);

export default SkeletonText;
