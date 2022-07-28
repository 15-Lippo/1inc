import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';

const StyledSearchField: StyledComponent<any> = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: theme.palette.widget['input-primary-text'],
    background: theme.palette.widget['input-bg'],
    '& ::placeholder': {
      opacity: 'none',
      color: theme.palette.widget['input-placeholder'],
    },
    borderRadius: '12px',
    '& fieldset': {
      color: theme.palette.widget['input-primary-text'],
      borderRadius: '12px',
      borderColor: theme.palette.widget['input-bg'],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.widget['input-border'],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.widget['input-border'],
    },
  },
}));

export default StyledSearchField;
