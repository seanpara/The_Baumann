import { atom } from "recoil";

import { EventMap } from "./Views/Calendar";

export const contactState = atom<string>({
  key: "contactType", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});

export const eventState = atom<EventMap>({
  key: "events", // unique ID (with respect to other atoms/selectors)
  default: {}, // default value (aka initial value)
});

export const authState = atom<{ isSignedIn: boolean; isValid: boolean }>({
  key: "auth", // unique ID (with respect to other atoms/selectors)
  default: { isSignedIn: false, isValid: false }, // default value (aka initial value)
});
