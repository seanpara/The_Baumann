import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";

import { logoImage } from "../images";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    justifyContent: "space-between",
    opacity: ".8",
  },
}));

export default () => {
  const classes = useStyles();
  return (
    <AppBar position="sticky">
      <Toolbar className={classes.toolbar}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-apart",
            alignItems: "center",
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
                  width: "auto",
                  height: 50,
                }}
                src={logoImage}
                alt=""
              />
            </IconButton>
          </Link>
          <Link
            edge="start"
            style={{ textDecoration: "none", color: "black" }}
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
        <h3>The Baumann</h3>
        <div style={{ display: "flex", justifyContent: "space-apart" }}>
          <IconButton
            size="small"
            edge="end"
            aria-label="home"
            color="secondary"
            onClick={() =>
              window.open("https://www.facebook.com/BaumannNY/", "_blank")
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
              window.open("https://www.instagram.com/baumannnyc/", "_blank")
            }
          >
            <InstagramIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};
