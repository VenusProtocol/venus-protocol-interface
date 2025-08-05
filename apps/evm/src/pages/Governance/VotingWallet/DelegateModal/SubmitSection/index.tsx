import { ConnectWallet } from 'containers/ConnectWallet';
import { FormikSubmitButton } from 'containers/Form';
import { SwitchChain } from 'containers/SwitchChain';
import { useFormikContext } from 'formik';
import { useTranslation } from 'libs/translations';
import { governanceChain } from 'libs/wallet';

export interface SubmitSectionProps {
  previouslyDelegated: boolean;
  isVoteDelegationLoading: boolean;
}

export const SubmitSection = ({
  previouslyDelegated,
  isVoteDelegationLoading,
}: SubmitSectionProps) => {
  const { t } = useTranslation();
  const { isValid } = useFormikContext();

  let dom = (
    <FormikSubmitButton
      className="w-full"
      enabledLabel={previouslyDelegated ? t('vote.redelegate') : t('vote.delegateVotes')}
      loading={isVoteDelegationLoading}
    />
  );

  if (isValid) {
    dom = (
      <ConnectWallet analyticVariant="vote_delegate_modal">
        <SwitchChain chainId={governanceChain.id}>{dom}</SwitchChain>
      </ConnectWallet>
    );
  }

  return <div className="mb-2 mt-8">{dom}</div>;
};
