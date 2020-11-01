import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';

import { useMediaQuery } from 'react-responsive';

import { useHeaderStyles } from '../styles';
import { logoImage } from '../images';

export default () => {
  const classes = useHeaderStyles();
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  return (
    <div
      style={{
        width: isTabletOrMobile && '100%',
      }}
    >
      <AppBar position="sticky">
        <Toolbar className={classes.toolbar}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-apart',
              alignItems: 'center',
              fontSize: isTabletOrMobile && '15px',
            }}
          >
            <Link to="/">
              <IconButton
                size="small"
                edge="start"
                color="inherit"
                aria-label="home"
              >
                <img
                  style={{
                    width: 'auto',
                    height: 50,
                  }}
                  src={logoImage}
                  alt=""
                />
              </IconButton>
            </Link>
            <Link
              style={{ textDecoration: 'none', color: 'black' }}
              to="/about"
            >
              <IconButton
                size="small"
                edge="end"
                color="inherit"
                aria-label="home"
              >
                <Typography variant="h6">About</Typography>
              </IconButton>
            </Link>
          </div>
          <h2>The Baumann</h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '25%',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '70%',
              }}
            >
              <Link
                style={{ textDecoration: 'none', color: 'black' }}
                to="/calendar"
              >
                <IconButton
                  size="small"
                  edge="end"
                  color="inherit"
                  aria-label="home"
                >
                  <Typography variant="h6">Calendar</Typography>
                </IconButton>
              </Link>
              <Link
                style={{ textDecoration: 'none', color: 'black' }}
                to="/contact"
              >
                <IconButton
                  size="small"
                  edge="end"
                  color="inherit"
                  aria-label="home"
                >
                  <Typography variant="h6">Contact</Typography>
                </IconButton>
              </Link>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-together',
              }}
            >
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
