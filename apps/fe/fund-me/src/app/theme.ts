import {createTheme} from '@mui/material/styles';
import {purple} from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#FFA83E', // Customize the primary color
        },
        secondary: {
            main: '#c7dffe', // Customize the secondary color
        },
        error: {
            main: '#f44336', // Customize the error color
        },
        background: {
            default: '#f5f5f5', // Customize the background color
        },
        // Add more customizations if needed
    },
    typography: {
        // Customize typography if needed
        fontFamily: 'Lato, sans-serif',
    },
});
