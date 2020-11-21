import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import { useMediaQuery } from 'react-responsive';

import { useHeaderStyles } from '../styles';
import { logoImage } from '../images';

export default () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  const history = useHistory();
  const classes = useHeaderStyles(isTabletOrMobile);
  const menuRef = useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);

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
        }}
      >
        <Toolbar className={classes.toolbar}>
          {!isTabletOrMobile && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-apart',
                alignItems: 'center',
                width: '40%',
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
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={({ currentTarget }) => {
                  setAnchorEl(currentTarget);
                }}
                ref={menuRef}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => {
                  setAnchorEl(null);
                }}
                anchorEl={anchorEl}
                style={{}}
                PaperProps={{
                  style: {
                    color: 'white',
                    backgroundColor: 'grey',
                    width: '20ch',
                  },
                }}
              >
                {['about', 'calendar', 'contact'].map((routeName) => (
                  <MenuItem
                    onClick={() => {
                      history.push(`/${routeName}`);
                      setAnchorEl(null);
                    }}
                  >
                    {capitalize(routeName)}
                  </MenuItem>
                ))}
              </Menu>
            </div>
          )}
          <h2>The Baumann</h2>
          {!isTabletOrMobile && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '40%',
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
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
