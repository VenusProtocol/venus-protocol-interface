import { useContext } from 'react';

import { ActiveTabPathContext } from '../context';

export const useActiveTabPath = () => useContext(ActiveTabPathContext);
