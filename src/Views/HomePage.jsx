import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import { siteImages } from "../images";

export default () => {
  return (
    <Carousel>
      {siteImages.map(imageSrc => (
        <div>
          <img style={{ width: "60%", height: "70%" }} src={imageSrc} alt="" />
        </div>
      ))}
    </Carousel>
  );
};
