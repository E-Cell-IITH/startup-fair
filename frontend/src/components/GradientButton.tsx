import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const GradientButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF8C00',
  color: 'white',
  '&:hover': {
    backgroundColor: '#e67e00',
  },
  padding: '10px 20px',
  borderRadius: '4px',
  textTransform: 'uppercase',
}));

export default GradientButton;