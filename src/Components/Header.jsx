import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import { useMediaQuery } from 'react-responsive';

export default () => {
  // hover pseudo selector refuses to work so this is a workaround
  // hopefully remove later
  const [hoveringEl, setHoveringEl] = useState('');
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (currentTarget) => {
    setAnchorEl(currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
                alignItems: 'center',
                width: '35%',
              }}
            >
              {['about', 'events', 'contact'].map((routeName) => (
                <div
                  style={{
                    fontSize: '18px',
                    borderBottom:
                      hoveringEl === routeName && '5px solid #8c9eff',
                  }}
                  onMouseEnter={() => {
                    setHoveringEl(routeName);
                  }}
                  onMouseLeave={() => {
                    setHoveringEl('');
                  }}
                  onClick={({ currentTarget }) => {
                    routeName === 'contact'
                      ? handleClick(currentTarget)
                      : history.push(`/${routeName}`);
                  }}
                >
                  {routeName.toUpperCase()}
                </div>
              ))}
              <div
                style={{
                  fontSize: '18px',
                  borderBottom: hoveringEl === 'rentals' && '5px solid #8c9eff',
                }}
                onMouseEnter={() => {
                  setHoveringEl('rentals');
                }}
                onMouseLeave={() => {
                  setHoveringEl('');
                }}
                onClick={() =>
                  window.open('baumannrentals.com/s/order', '_blank')
                }
              >
                EQUIPMENT
              </div>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    width: '20ch',
                  },
                }}
              >
                <MenuItem onClick={handleClose}>Book With Us</MenuItem>
                <MenuItem onClick={handleClose}>General Contact</MenuItem>
              </Menu>
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
