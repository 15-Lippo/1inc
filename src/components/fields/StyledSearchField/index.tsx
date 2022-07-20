import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';

const StyledSearchField: StyledComponent<any> = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: theme.palette.cool[100],
    '& ::placeholder': {
      opacity: 'none',
      color: '#3E4D63',
    },
    borderRadius: '12px',
    '& fieldset': {
      color: theme.palette.dark[900],
      borderRadius: '12px',
      borderColor: theme.palette.cool[100],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.blue[500],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.blue[500],
    },
  },
}));

export default StyledSearchField;
