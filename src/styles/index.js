import { makeStyles } from "@material-ui/core/styles";

export const useHomePageStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: theme.palette.secondary.main,
  },
  paper: {
    padding: "2%",
    margin: "1%",
    background: theme.palette.primary.main,
    color: "white",
    width: "80%",
    height: "auto",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-apart",
  },
  carouselPaper: {
    background: "black",
  },
}));

export const useAboutPageStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: "5% 0% 5% 0%",
      width: "80%",
      height: "70%",
    },
    background: theme.palette.secondary.main,
    height: "100vh",
  },
  paper: {
    padding: "2% 2% 5% 2%",
    background: theme.palette.primary.main,
    color: "white",
    textAlign: "center",
    typography: {
      fontFamily: "Roboto, sans-serif;",
    },
  },
}));
