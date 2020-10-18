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

  const renderImages = () =>
    siteImages.map(({ src, href }) => (
      <Paper className={classes.carouselPaper} key={src}>
        <a
          style={{ display: 'flex', justifyContent: 'center', width: '55%' }}
          href={href || null}
          target="_blank"
          rel="noreferrer noopener"
        >
          <img style={{ width: '100%', height: 'auto' }} src={src} alt="" />
        </a>
      </Paper>
    ));

  const renderEventList = () => (
    <div
      style={{
        display: 'flex',
        justifyContent: isTabletOrMobile ? 'bottom' : 'space-around',
        flexDirection: isTabletOrMobile ? 'column' : 'row',
        alignItems: 'center',
        flexWrap: isTabletOrMobile ? 'nowrap' : 'wrap',
        width: '100%',
      }}
    >
      {siteImages.map(({ text: { eventName }, src, href }) => {
        return (
          <Paper
            className={classes.paper}
            square
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: isTabletOrMobile ? '60%' : '18%',
            }}
          >
            {isTabletOrMobile ? (
              <img
                alt=""
                src={src}
                style={{
                  width: '60%',
                  height: 'auto',
                }}
                onClick={() => window.open(href, '_blank')}
              />
            ) : (
              <IconButton
                size="small"
                edge="end"
                aria-label="home"
                className={classes.icon}
                onClick={() => window.open(href, '_blank')}
              >
                <TheatersIcon style={{ fontSize: 100 }} />
              </IconButton>
            )}
            <h3> {eventName}</h3>
          </Paper>
        );
      })}
    </div>
  );

  const {
    text: { eventName, curators, date },
  } = siteImages[currentSlide];
  return (
    <div
      className={classes.root}
      style={{
        display: 'flex',
        overflow: isTabletOrMobile && 'scroll',
        width: '100%',
        position: 'fixed',
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
            {renderImages()}
          </Carousel>
          <Paper
            className={classes.eventDetailPaper}
            style={{
              width: isTabletOrMobile && '90%',
              height: isTabletOrMobile && '10%',
            }}
          >
            <h4 style={{ margin: '1% 0%' }}>{eventName}</h4>
            <div>{curators}</div>
            <div>{date}</div>
          </Paper>
        </>
      )}
      <Paper
        className={`${classes.theaterImagePaper} theater-header`}
        style={{ padding: isTabletOrMobile && '0% 5%' }}
      >
        <h1>This Week at the Baumann</h1>
      </Paper>
      {renderEventList()}
    </div>
  );
};
