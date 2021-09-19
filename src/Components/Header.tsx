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
import MenuIcon from "@material-ui/icons/Menu";
import { useMediaQuery } from "react-responsive";

import { contactState } from "../atoms";

const Header = (): JSX.Element => {
  // hover pseudo selector refuses to work so this is a workaround
  // hopefully remove later
  const [hoveringEl, setHoveringEl] = useState("");
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  // const [mobileMenuAnchorEl, setMobileMenuAnchorEl] =
  //   useState<HTMLElement | null>(null);
  const logoSrc =
    "https://baumann-pics.s3.us-east-2.amazonaws.com/Logo-NO+TEXT.png";
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

  const renderMainLinks = () =>
    ["about", "events", "contact"].map((routeName) => (
      <div
        key={routeName}
        style={{
          fontSize: "18px",
          borderBottom: hoveringEl === routeName ? "5px solid #8c9eff" : "",
        }}
        onMouseEnter={(): void => {
          setHoveringEl(routeName);
        }}
        onMouseLeave={(): void => {
          setHoveringEl("");
        }}
        onClick={({ currentTarget }): void => {
          routeName === "contact" && !isTabletOrMobile
            ? handleClick(currentTarget)
            : history.push(`/${routeName}`);
          if (isTabletOrMobile) {
            setAnchorEl(null);
          }
        }}
      >
        {routeName.toUpperCase()}
      </div>
    ));

  const renderOtherItems = () => [
    <div
      style={{
        fontSize: "18px",
        borderBottom: hoveringEl === "rentals" ? "5px solid #8c9eff" : "",
      }}
      onMouseEnter={(): void => {
        setHoveringEl("rentals");
      }}
      onMouseLeave={(): void => {
        setHoveringEl("");
      }}
      onClick={(): void => {
        window.open("https://www.sharegrid.com/p/fergus_baumann?type=rent");
        setAnchorEl(null);
      }}
    >
      EQUIPMENT
    </div>,
    !isTabletOrMobile && (
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!isTabletOrMobile && Boolean(anchorEl)}
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
        <MenuItem onClick={() => handleClose("booking")}>Book With Us</MenuItem>
        <MenuItem onClick={() => handleClose("general")}>
          General Contact
        </MenuItem>
      </Menu>
    ),
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
    </IconButton>,
    <IconButton
      size="small"
      edge="end"
      aria-label="home"
      color="secondary"
      onClick={(): void => {
        window.open("https://www.instagram.com/baumannnyc/", "_blank");
      }}
    >
      <InstagramIcon />
    </IconButton>,
  ];

  const getHeaderContent = () => [
    <>{renderMainLinks()}</>,
    ...renderOtherItems(),
  ];

  const renderMobileMenu = () =>
    [...renderMainLinks(), ...renderOtherItems()]
      .filter((el) => el)
      .map((el) => <MenuItem>{el}</MenuItem>);

  const homeButonProps = {
    onMouseEnter: (): void => {
      setHoveringEl("homeButton");
    },
    onMouseLeave: (): void => {
      setHoveringEl("");
    },
    onClick: (): void => {
      history.push("/");
    },
  };
  return (
    <div
      style={{
        width: isTabletOrMobile ? "100vw" : "",
        height: !isTabletOrMobile ? "10%" : "",
      }}
    >
      <AppBar
        position="sticky"
        style={{
          width: isTabletOrMobile ? "100vw" : "",
          backgroundColor: "white",
        }}
      >
        <Toolbar>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: isTabletOrMobile ? "center" : "",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {isTabletOrMobile && (
              <IconButton
                style={{
                  width: "25%",
                  height: "auto",
                }}
                {...homeButonProps}
              >
                <img
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                  src={logoSrc}
                />
              </IconButton>
            )}

            {!isTabletOrMobile ? (
              <>
                <div
                  style={{
                    fontSize: "25px",
                    borderBottom:
                      hoveringEl === "homeButton" ? "5px solid #8c9eff" : "",
                  }}
                  {...(!isTabletOrMobile && homeButonProps)}
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
                  {getHeaderContent()}
                </div>
              </>
            ) : (
              <>
                <IconButton
                  onClick={({ currentTarget }): void => {
                    handleClick(currentTarget);
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={() => {
                    setAnchorEl(null);
                  }}
                >
                  {renderMobileMenu()}
                </Menu>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
