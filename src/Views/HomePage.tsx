import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Paper from "@material-ui/core/Paper";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { storage } from "../firebase";
import { useHomePageStyles } from "../styles";
import { imageNames } from "./Admin";

export default () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [siteImages, setSiteImages] = useState<{ src: string; link: string }[]>(
    []
  );
  const classes = useHomePageStyles();

  const isTabletOrMobile = useMediaQuery("(max-width: 1224px)");
  const [slideOneData, setSlideOneData] = useState({
    text: "Please Subscribe to Our Monthly Artsbox!",
    link: "",
  });
  useEffect(() => {
    const setData = async () => {
      const { slideTwoData, otherData } = await fetch(
        "https://us-central1-baumann-firebase.cloudfunctions.net/getHomePageText"
        // "http://localhost:5001/baumann-firebase/us-central1/getHomePageText"
      ).then((r) => r.json());

      const imageUrls = await Promise.all(
        imageNames.map(async (imageName: string): Promise<{
          [key: string]: string;
        }> => {
          const src = await storage
            .ref("images")
            .child(imageName)
            .getDownloadURL();

          return { [imageName]: src };
        })
      );
      setSlideOneData(slideTwoData);

      // i am not proud of myself . . .
      setSiteImages(
        imageUrls.map((obj) => {
          const arO = Object.entries(obj).map(([name, src]) => ({
            src,
            link: otherData.find((obj2: any) =>
              Object.keys(obj2).includes(name)
            )[name].value,
          }));
          return arO[0];
        })
      );
    };

    setData();
  }, []);

  const updateCurrentSlide = (index: number): void => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

  const renderCarouselImages = (): JSX.Element[] => [
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#8c9eff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
          width: "100%",
          overflowWrap: "normal",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a
          style={{ color: "inherit", width: "90%" }}
          target="_blank"
          href={slideOneData.link}
        >
          {slideOneData.text}
        </a>
      </div>
    </div>,

    ...siteImages.map(({ src, link }) => (
      <div
        onClick={(): void => {
          window.open(link);
        }}
      >
        <img
          key={src}
          style={{ width: "100%", height: "auto" }}
          src={src}
          alt=""
        />
      </div>
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
        width: "100%",
      }}
    >
      {!isTabletOrMobile ? (
        <Carousel
          showThumbs={false}
          onChange={updateCurrentSlide}
          selectedItem={currentSlide}
          infiniteLoop
          autoPlay
          showStatus={false}
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
