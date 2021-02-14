import { atom } from 'recoil';

export const contactState = atom({
  key: 'contactType', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});
