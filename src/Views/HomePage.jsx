import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Paper from "@material-ui/core/Paper";

import { useHomePageStyles } from "../styles";
import { siteImages } from "../images";

export default () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const classes = useHomePageStyles();

  const updateCurrentSlide = index => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

  const renderImages = () =>
    siteImages.map(({ src }) => (
      <Paper className={classes.carouselPaper} key={src}>
        <img style={{ width: "60%", height: "auto" }} src={src} alt="" />
      </Paper>
    ));
  const { text } = siteImages[currentSlide];
  return (
    <div className={classes.root}>
      <Carousel
        showThumbs={false}
        onChange={updateCurrentSlide}
        selectedItem={currentSlide}
        infiniteLoop
      >
        {renderImages()}
      </Carousel>
      <Paper className={classes.paper}>
        <h3> {text}</h3>
      </Paper>
      <Paper className={classes.paper}>
        <h2>Contact Info Here?? </h2>
        <p>41 Varick </p>
        <p>fbaumann@bennington.edu</p>
      </Paper>
    </div>
  );
};
