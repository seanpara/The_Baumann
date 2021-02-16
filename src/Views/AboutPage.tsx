import React from 'react';

import { useMediaQuery } from 'react-responsive';

import { useAboutPageStyles } from '../styles';

const AboutPage = (): JSX.Element => {
  const classes = useAboutPageStyles();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          color: 'black',
          backgroundColor: '#8c9eff',
          padding: '5% 3% 0% 3%',
        }}
      >
        <div style={{ fontSize: '80px' }}>About Us</div>
        <div style={{ marginTop: '1%' }}>
          The Baumann performance venue was founded in September 2017 by Zivon
          Toplin, Owen Campbell, and Fergus Baumann, members of the Zoo City
          theatre collective. They debuted the venue with a theatrical
          adaptation of Franz Kafka’s “A Country Doctor” for a two week run +
          gallery. Subsequently, Fergus and Owen held a series of film and live
          improv events to fundraise for climate change research. As more events
          transpired at The Baumann, word of mouth requests were made by
          curators across disciplines to host their own events. Over the past
          two years, The Baumann has housed hundreds of performances and
          workshops across dance, theatre, film, poetry, music, comedy, magic,
          circus, crafts making, and more. Today it seeks to be a refuge in the
          price gouged industry that is art studio rentals in NYC. The Baumann
          seeks to be accessible both for private use and public event use. It
          also seeks seeks to be an accessible space for patrons of art, making
          entry to the majority of its events “pay what you can”. The Baumann
          seeks to be a facility-rich space, allowing for curators to exhibit
          developing or experimental work. It seeks to create partnerships
          between artists and curators, and form unique collaborations.
        </div>
      </div>
      <img
        style={{ height: '100vh', width: 'auto' }}
        src="https://mediad.publicbroadcasting.net/p/shared/npr/styles/x_large/nprshared/201811/613351266.jpg"
        alt=""
      />
    </div>
  );
};

export default AboutPage;
