import React, { useContext as useReactContext } from 'react';

export const Context = React.createContext();

export default function useContext() {
  return useReactContext(Context);
}
