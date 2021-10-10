import React, { useState, useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Paper from "@material-ui/core/Paper";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { useHomePageStyles } from "../styles";

interface TextSlideData {
  text: string;
  link: string;
}
type SlideImageData = { link: string; src: string }[];

export default () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const classes = useHomePageStyles();

  const isTabletOrMobile = useMediaQuery("(max-width: 1224px)");

  const [{ textSlideData, slideImageData }, setHomePageData] = useState<{
    textSlideData: TextSlideData;
    slideImageData: SlideImageData;
  }>({
    textSlideData: {
      text: "",
      link: "",
    },
    slideImageData: [
      {
        src: "https://firebasestorage.googleapis.com/v0/b/baumann-firebase.appspot.com/o/images%2Fimage1?alt=media",
        link: "",
      },
      {
        src: "https://firebasestorage.googleapis.com/v0/b/baumann-firebase.appspot.com/o/images%2Fimage2?alt=media",
        link: "",
      },
      {
        src: "https://firebasestorage.googleapis.com/v0/b/baumann-firebase.appspot.com/o/images%2Fimage3?alt=media",
        link: "",
      },
    ],
  });
  useEffect(() => {
    const setData = async () => {
      const { otherData } = await fetch(
        "https://us-central1-baumann-firebase.cloudfunctions.net/getHomePageText"
        // "http://localhost:5001/baumann-firebase/us-central1/getHomePageText"
      ).then((r) => r.json());
      const textSlideData = {
        link: otherData.find((o: any) => Object.keys(o).includes("slide2Link"))
          .slide2Link.value,
        text: otherData.find((o: any) => Object.keys(o).includes("slide2Text"))
          .slide2Text.value,
      };
      const slideImageData = Object.values(otherData)
        .filter((o) => Object.keys(o as {}).some((k) => k.includes("image")))
        .map((o) => {
          const { value: link, src } = Object.values(o as any)[0] as {
            value: string;
            src: string;
          };

          return { link, src };
        });

      setHomePageData({ textSlideData, slideImageData });
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
    ...slideImageData.map(({ src, link }) => (
      <img
        key={src}
        style={{
          width: "auto",
          height: "100%",
          // @ts-ignore
          "pointer-events": "all",
        }}
        src={src}
        alt=""
        onClick={(): void => {
          window.open(link);
        }}
      />
    )),
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#8c9eff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <a
        style={{ color: "inherit", width: "90%", fontSize: "70px" }}
        target="_blank"
        href={textSlideData.link}
      >
        {textSlideData.text}
      </a>
    </div>,
  ];

  const renderEventList = (): JSX.Element => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flexWrap: "nowrap",
        justifyContent: "space-apart",
        width: "100%",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          textAlign: "center",
          marginTop: "3%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        UPCOMING EVENTS AND PROJECTS:
      </div>
      {slideImageData.map(({ src, link }) => (
        <Paper
          square
          style={{
            width: "80%",
            height: "auto",
            margin: "2% 1% 2% 1%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "black",
            borderRadius: "5px",
          }}
        >
          <img
            alt=""
            src={src}
            style={{
              width: "100%",
              height: "auto",
              border: "5px solid black",
              borderRadius: "5px",
            }}
            onClick={() => {
              window.open(link);
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
        width: "100vw",
      }}
    >
      {!isTabletOrMobile ? (
        <Carousel
          showArrows
          onChange={updateCurrentSlide}
          selectedItem={currentSlide}
          infiniteLoop
          autoPlay
          showThumbs={false}
          interval={5000}
          showStatus={false}
        >
          {renderCarouselImages()}
        </Carousel>
      ) : (
        renderEventList()
      )}
    </div>
  );
};
