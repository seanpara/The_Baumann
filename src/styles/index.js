import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#757575',
      light: '#f06292',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#1976d2',
      main: '#8c9eff',
      // dark: will be calculated from palette.secondary.main,
      dark: '#0d47a1',
      contrastText: '#ffcc00',
    },
  },
});

export const useHomePageStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.secondary.main,
  },
  eventDetailPaper: {
    margin: '1%',
    padding: '0.5%',
    background: theme.palette.primary.main,
    color: 'white',
    width: '50%',
    height: '20%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  paper: {
    padding: '2%',
    margin: '1%',
    background: theme.palette.primary.main,
    color: 'white',
    width: '80%',
    height: 'auto',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-apart',
  },
  carouselPaper: {
    background: 'black',
    display: 'flex',
    justifyContent: 'center',
  },
  icon: {
    color: '#f48fb1',
  },
}));

export const useAboutPageStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'top',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: '5% 0%',
    },
    background: theme.palette.secondary.main,
    height: '100vh',
  },
  paper: {
    padding: '2% 2% 5% 2%',
    background: theme.palette.primary.main,
    color: 'white',
    textAlign: 'left',
  },
}));

export const useHeaderStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    justifyContent: 'space-between',
    opacity: '.8',
    typography: {
      fontFamily: '"Amatic SC", cursive',
    },
  },
}));
