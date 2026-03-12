import { useMemo, useState } from 'react';

import type { YieldPlusPosition } from 'types';
import type { FormValues } from '../PositionForm';

export const usePositionForm = ({ position }: { position: YieldPlusPosition }) => {
  const initialFormValues: FormValues = useMemo(
    () => ({
      leverageFactor: position.leverageFactor,
      dsaToken: position.dsaAsset.vToken.underlyingToken,
      dsaAmountTokens: '',
      shortAmountTokens: '',
      acknowledgeRisk: false,
      acknowledgeHighPriceImpact: false,
    }),
    [position.leverageFactor, position.dsaAsset.vToken.underlyingToken],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  return {
    formValues,
    setFormValues,
  };
};
