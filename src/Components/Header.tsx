import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import IconButton from "@material-ui/core/IconButton";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import { useMediaQuery } from "react-responsive";

import { contactState } from "../atoms";

const Header = (): JSX.Element => {
  // hover pseudo selector refuses to work so this is a workaround
  // hopefully remove later
  const [hoveringEl, setHoveringEl] = useState("");
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [, setContactType] = useRecoilState(contactState);

  const handleClick = (currentTarget: HTMLElement): void => {
    setAnchorEl(currentTarget);
  };

  const handleClose = (contactType?: string): void => {
    if (contactType) {
      setContactType(contactType);
      history.push("contact");
    }
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        width: isTabletOrMobile ? "100%" : "",
        height: !isTabletOrMobile ? "10%" : "",
      }}
    >
      <AppBar
        position="sticky"
        style={{
          width: isTabletOrMobile ? "100%" : "",
          backgroundColor: "white",
        }}
      >
        <Toolbar>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: "25px",
                borderBottom:
                  hoveringEl === "homeButton" ? "5px solid #8c9eff" : "",
              }}
              onMouseEnter={(): void => {
                setHoveringEl("homeButton");
              }}
              onMouseLeave={(): void => {
                setHoveringEl("");
              }}
              onClick={(): void => {
                history.push("/");
              }}
            >
              THE BAUMANN
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "35%",
              }}
            >
              {["about", "events", "contact"].map((routeName) => (
                <div
                  key={routeName}
                  style={{
                    fontSize: "18px",
                    borderBottom:
                      hoveringEl === routeName ? "5px solid #8c9eff" : "",
                  }}
                  onMouseEnter={(): void => {
                    setHoveringEl(routeName);
                  }}
                  onMouseLeave={(): void => {
                    setHoveringEl("");
                  }}
                  onClick={({ currentTarget }): void => {
                    routeName === "contact"
                      ? handleClick(currentTarget)
                      : history.push(`/${routeName}`);
                  }}
                >
                  {routeName.toUpperCase()}
                </div>
              ))}
              <div
                style={{
                  fontSize: "18px",
                  borderBottom:
                    hoveringEl === "rentals" ? "5px solid #8c9eff" : "",
                }}
                onMouseEnter={(): void => {
                  setHoveringEl("rentals");
                }}
                onMouseLeave={(): void => {
                  setHoveringEl("");
                }}
                onClick={(): void => {
                  window.open(
                    "https://www.sharegrid.com/p/fergus_baumann?type=rent"
                  );
                }}
              >
                EQUIPMENT
              </div>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => handleClose()}
                getContentAnchorEl={null}
                PaperProps={{
                  style: {
                    width: "20ch",
                  },
                }}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <MenuItem onClick={() => handleClose("booking")}>
                  Book With Us
                </MenuItem>
                <MenuItem onClick={() => handleClose("general")}>
                  General Contact
                </MenuItem>
              </Menu>
              <IconButton
                size="small"
                edge="end"
                aria-label="home"
                color="secondary"
                onClick={(): void => {
                  window.open("https://www.facebook.com/BaumannNY/", "_blank");
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                size="small"
                edge="end"
                aria-label="home"
                color="secondary"
                onClick={(): void => {
                  window.open(
                    "https://www.instagram.com/baumannnyc/",
                    "_blank"
                  );
                }}
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

export default Header;
