import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import { siteImages } from "../images";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: "5%",
    background: theme.palette.secondary.dark,
    color: "white",
    width: "100%",
    height: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
}));
export default () => {
  const classes = useStyles();
  const renderImages = () =>
    siteImages.map(imageSrc => (
      <div key={imageSrc}>
        <img style={{ width: "60%", height: "70%" }} src={imageSrc} alt="" />
      </div>
    ));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Carousel>{renderImages()}</Carousel>
      <Paper className={classes.paper}>
        <p>41 Varick </p>
        <p>fbaumann@bennington.edu</p>
      </Paper>
    </div>
  );
};
