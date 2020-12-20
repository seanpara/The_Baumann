import React, { useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import TheatersIcon from '@material-ui/icons/Theaters';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useHomePageStyles } from '../styles';
import { siteImages } from '../images';

export default () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const classes = useHomePageStyles();

  const isTabletOrMobile = useMediaQuery('(max-width: 1224px)');

  const updateCurrentSlide = (index) => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

  const renderCarouselImages = () => [
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#8c9eff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: '100px',
        }}
      >
        A NEW BAUMANN
      </div>
      <div
        style={{
          fontSize: '100px',
        }}
      >
        IS COMING
      </div>
    </div>,
    ...siteImages.map(({ src }) => (
      <img style={{ width: '100%', height: 'auto' }} src={src} alt="" />
    )),
  ];

  const renderEventList = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'bottom',
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: 'nowrap',
        width: '100%',
        overflowY: 'auto',
      }}
    >
      {siteImages.map(({ src }) => {
        return (
          <Paper
            className={classes.paper}
            square
            key={src}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: isTabletOrMobile ? '80%' : '18%',
            }}
          >
            {isTabletOrMobile ? (
              <img
                alt=""
                src={src}
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            ) : (
              <IconButton
                size="small"
                edge="end"
                aria-label="home"
                className={classes.icon}
              >
                <TheatersIcon style={{ fontSize: 100 }} />
              </IconButton>
            )}
          </Paper>
        );
      })}
    </div>
  );

  return (
    <div
      className={classes.root}
      style={{
        display: 'flex',
        overflow: 'auto',
        height: '100vh',
        width: '100vw',
      }}
    >
      {!isTabletOrMobile && (
        <>
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
        </>
      )}
      {isTabletOrMobile && <>{renderEventList()}</>}
    </div>
  );
};
