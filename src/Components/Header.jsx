import React from "react";

import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import { logoImage } from "../images";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    justifyContent: "space-between",
  },
}));
export default () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Link to="/">
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="home"
          >
            <img
              style={{
                width: 50,
                height: 50,
              }}
              src={logoImage}
              alt=""
            />
          </IconButton>
        </Link>
        <h3>The Baumann</h3>
        <Link
          edge="start"
          style={{ textDecoration: "none", color: "black" }}
          to="/about"
        >
          <IconButton size="small" edge="end" color="inherit" aria-label="home">
            <Typography variant="h6">About</Typography>
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
};
