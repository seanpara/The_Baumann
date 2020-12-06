import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import { useMediaQuery } from 'react-responsive';

import { useHeaderStyles } from '../styles';

export default () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const history = useHistory();
  const classes = useHeaderStyles(isTabletOrMobile);

  const capitalize = (word) =>
    word.replace(/(\b[a-z](?!\s))/g, (w) => w.toUpperCase());

  return (
    <div
      style={{
        width: isTabletOrMobile && '100%',
        height: !isTabletOrMobile && '10vh',
      }}
    >
      <AppBar
        position="sticky"
        style={{
          width: isTabletOrMobile && '100%',
          backgroundColor: 'white',
        }}
      >
        <Toolbar>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div
              style={{ fontSize: '25px' }}
              onClick={() => {
                history.push('/');
              }}
            >
              THE BAUMANN
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '20%',
              }}
            >
              {['about', 'calendar', 'contact'].map((routeName) => (
                <Button
                  variant="outlined"
                  color="secondary"
                  style={{ color: 'black' }}
                  onClick={() => {
                    history.push(`/${routeName}`);
                  }}
                >
                  {capitalize(routeName)}
                </Button>
              ))}
              <IconButton
                size="small"
                edge="end"
                aria-label="home"
                color="secondary"
                onClick={() =>
                  window.open('https://www.facebook.com/BaumannNY/', '_blank')
                }
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                size="small"
                edge="end"
                aria-label="home"
                color="secondary"
                onClick={() =>
                  window.open('https://www.instagram.com/baumannnyc/', '_blank')
                }
              >
                <InstagramIcon />
              </IconButton>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
