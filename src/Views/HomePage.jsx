import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import { siteImages } from "../images";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: "5%",
    margin: "2%",
    background: theme.palette.secondary.dark,
    color: "white",
    width: "80%",
    height: "100%",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
  carouselPaper: {
    background: "black",
  },
}));
export default () => {
  const classes = useStyles();
  const renderImages = () =>
    siteImages.map(imageSrc => (
      <Paper className={classes.carouselPaper} key={imageSrc}>
        <img style={{ width: "60%", height: "auto" }} src={imageSrc} alt="" />
      </Paper>
    ));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#1976d2",
      }}
    >
      <Carousel showThumbs={false}>{renderImages()}</Carousel>
      <Paper className={classes.paper}>
        <p>Hi fergas </p>
        <p>41 Varick </p>
        <p>fbaumann@bennington.edu</p>
      </Paper>
    </div>
  );
};
