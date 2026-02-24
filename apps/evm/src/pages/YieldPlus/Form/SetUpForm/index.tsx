import { useGetTokens } from 'libs/tokens';
import { useSearchParams } from 'react-router';

import { SelectTokenField } from 'components';
import { SubmitButton } from 'containers/SubmitButton';
import { useTranslation } from 'libs/translations';
import type { Token } from 'types';
import { LONG_TOKEN_ADDRESS_PARAM_KEY, SHORT_TOKEN_ADDRESS_PARAM_KEY } from '../../constants';
import { useTokenPair } from '../../useTokenPair';

export interface FormValues {
  shortToken: Token;
  longToken: Token;
}

export const SetUpForm: React.FC = () => {
  const tokens = useGetTokens();
  const { t } = useTranslation();

  const { longToken, shortToken } = useTokenPair();
  const [_, setSearchParams] = useSearchParams();

  const setLongToken = (newLongToken: Token) => {
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [LONG_TOKEN_ADDRESS_PARAM_KEY]: newLongToken.address,
    }));
  };

  const setShortToken = (newShortToken: Token) =>
    setSearchParams(currentSearchParams => ({
      ...Object.fromEntries(currentSearchParams),
      [SHORT_TOKEN_ADDRESS_PARAM_KEY]: newShortToken.address,
    }));

  const isLoading = false; // TODO: wire up

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-4">
        <SelectTokenField
          label={t('yieldPlus.form.longField.label')}
          selectedToken={longToken}
          tokens={tokens}
          onChangeSelectedToken={setLongToken}
        />

        <SelectTokenField
          label={t('yieldPlus.form.shortField.label')}
          selectedToken={shortToken}
          tokens={tokens}
          onChangeSelectedToken={setShortToken}
        />
      </div>

      <SubmitButton
        label={t('yieldPlus.form.submitButton.label')}
        isFormValid
        isLoading={isLoading}
      />
    </div>
  );
};
