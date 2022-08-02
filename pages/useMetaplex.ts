import { createContext, useContext } from 'react';

import { Metaplex } from '@metaplex-foundation/js';

const DEFAULT_CONTEXT: {
  metaplex?: Metaplex;
} = {
  metaplex: undefined,
};

export const MetaplexContext = createContext(DEFAULT_CONTEXT);

export default function useMetaplex() {
  return useContext(MetaplexContext);
}
