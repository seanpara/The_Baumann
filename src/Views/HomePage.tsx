import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Paper from "@material-ui/core/Paper";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useHomePageStyles } from "../styles";
import { siteImages } from "../images";

export default () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const classes = useHomePageStyles();

  const isTabletOrMobile = useMediaQuery("(max-width: 1224px)");

  const updateCurrentSlide = (index: number): void => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

  const renderCarouselImages = (): JSX.Element[] => [
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#8c9eff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "100px",
        }}
      >
        <a
          style={{ color: "inherit" }}
          target="_blank"
          href="https://www.baumannartsbox.com/products/monthly-artsbox"
        >
          Subscribe to Our Monthly Artsbox
        </a>
      </div>
    </div>,
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#8c9eff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: "100px",
        }}
      >
        A NEW BAUMANN
      </div>
      <div
        style={{
          fontSize: "100px",
        }}
      >
        IS COMING
      </div>
    </div>,
    ...siteImages.map(({ src }) => (
      <img
        key={src}
        style={{ width: "100%", height: "auto" }}
        src={src}
        alt=""
      />
    )),
  ];

  const renderEventList = (): JSX.Element => (
    <div
      style={{
        display: "flex",
        justifyContent: "bottom",
        flexDirection: "column",
        alignItems: "center",
        flexWrap: "nowrap",
        width: "100%",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {siteImages.map(({ src }) => (
        <Paper
          className={classes.paper}
          square
          key={src}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: isTabletOrMobile ? "80%" : "18%",
          }}
        >
          <img
            alt=""
            src={src}
            style={{
              width: "100%",
              height: "auto",
            }}
          />
        </Paper>
      ))}
    </div>
  );

  return (
    <div
      className={classes.root}
      style={{
        display: "flex",
        overflow: "auto",
        height: "100%",
        width: "100",
      }}
    >
      {!isTabletOrMobile ? (
        <Carousel
          showThumbs={false}
          onChange={updateCurrentSlide}
          selectedItem={currentSlide}
          infiniteLoop
          autoPlay
          interval={5000}
        >
          {renderCarouselImages()}
        </Carousel>
      ) : (
        renderEventList()
      )}
    </div>
  );
};
