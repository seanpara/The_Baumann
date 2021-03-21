import React from "react";

import { useMediaQuery } from "react-responsive";

import { useAboutPageStyles } from "../styles";

const AboutPage = (): JSX.Element => {
  const classes = useAboutPageStyles();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          color: "black",
          backgroundColor: "#8c9eff",
          padding: "5% 3% 0% 3%",
        }}
      >
        <div style={{ fontSize: "80px" }}>Who Are We?</div>

        <div style={{ marginTop: "1%" }}>
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
        style={{ height: "100vh", width: "auto" }}
        src="https://baumann-pics.s3.us-east-2.amazonaws.com/bauman_about_pic.jpeg?response-content-disposition=inline&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEF4aCXVzLWVhc3QtMSJHMEUCIDRw98zLh9CkZ41PnkszZ9zSc87aR4PCFtIWpB6BSfNZAiEAmWBbY3LSatH1bLd7fKJuaeVmkgAHp49KvaIS7d8GMu0q%2FwIIl%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARACGgw3MjIxMzUyMzM4ODciDDKpZo9tlDE5hooNCyrTAsW2aqHq94odKc3OXDN42E%2BEDIUGbWvx1ZbAIWTVhHfRlAbz0DJNhWWMdmIT2A96CXyUCr4hId4R2EMHlxKcG%2BaJdMpgcO2aXNSdxjRLsFk9KIhSAYEu4e0%2BqJTgT3ROLsukPrUmnC8rW%2FhUp3ogAsGUOEVBfFe%2FtCaVdCSk0g1cSvcLeArTum2RDUl%2F0OyzL03Qyti1%2F8uNhdC32Hb7ZExgzFswxOGELOPVzJ5RLukIPoNQEBVbNzJGy7U51cUHlBnYg8V4Zft4kLUaydDNjx8BGlH6nUFyAvSLBNtwwIvHHejQnGWqSYYVFWCPxU2S9LCNSBTRu74F63quG%2BRZPfLWRME%2FKK8DDTDjiIL7Hox2SccLCL1TuwSLuauUt3C2RMYBPjntD0lSp4R53sguMoa1Ds1go6%2FiS6VGFe8Qz5L%2Fei4OnZ%2BDVvbWzNZaC%2BRDj0%2B58TDJ%2Bd6CBjqzAjLTf7FVlXfwB%2BfmZn%2Btr6HnTVEEGTCP2YYsqSyoawyVzwJUrxoGWoUKMJ7RkLGv3t8VKRkTxfRqOCik6tiO5MjDf32FmrYUpZs7sb5jMPjFz%2BnxI3DxxvfJDkod87CsJS6GiiJo7dZC%2BU8IfceCMaUtx43DnBecgbzH%2BF2TTPB4G%2B0oK12pY0LVIvxYm8dFpn05WZFsgbKH1OP6SiPlLgM%2F%2FCrB8T0ChnZkze53hbcLu1p2r7317jXwpRT3APirOLtqGQIzV4ErFaNjmk%2FvcQ9pr2xuBUbkErqTH3EfNyC99zSEqOvKg0OMHtnVCa58mpHl4yMUcxQU2Qfm3aVqdL4Os9RrANXPh%2F550IBbo%2FMHSF%2BGXrdt%2Bl3sLW8gejUOoTiDw0g%2F%2FHrEOFUHuSvLFpxXYrk%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20210321T213948Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIA2QIU5GVP4KY6OOTN%2F20210321%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=70fd083f878b0474973072c27e7fb2f06f043276eaabc3c02c280fce5f962246"
        alt=""
      />
    </div>
  );
};

export default AboutPage;
