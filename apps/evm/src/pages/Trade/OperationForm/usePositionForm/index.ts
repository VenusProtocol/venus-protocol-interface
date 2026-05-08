import { useEffect, useMemo, useState } from 'react';

import { useTokenPair } from 'pages/Trade/useTokenPair';
import type { TradePosition } from 'types';
import type { FormValues } from '../../PositionForm';

export const usePositionForm = ({ position }: { position: TradePosition }) => {
  const { shortToken, longToken } = useTokenPair();

  const initialFormValues: FormValues = useMemo(
    () => ({
      leverageFactor: position.leverageFactor,
      dsaToken: position.dsaAsset.vToken.underlyingToken,
      dsaAmountTokens: '',
      longAmountTokens: '',
      shortAmountTokens: '',
      acknowledgeRisk: false,
      acknowledgeHighPriceImpact: false,
    }),
    [position.leverageFactor, position.dsaAsset.vToken.underlyingToken],
  );

  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

  // Reset form when tokens are changed
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    setFormValues(initialFormValues);
  }, [initialFormValues, shortToken.address, longToken.address, setFormValues]);

  return {
    formValues,
    setFormValues,
  };
};
