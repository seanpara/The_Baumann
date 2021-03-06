import { atom } from "recoil";

import { EventMap } from "./Views/Calendar";

export const contactState = atom({
  key: "contactType", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const eventState = atom<EventMap>({
  key: "events", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
});
