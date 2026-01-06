import { useTranslation } from 'react-i18next';

import { AccordionAnimatedContent, type AccordionAnimatedContentProps, Icon } from 'components';
import { ReadableActionSignature } from 'containers/ReadableActionSignature';
import type { ChainId, ProposalAction } from 'types';

export interface ActionsAccordionProps extends AccordionAnimatedContentProps {
  chainId: ChainId;
  proposalActions: ProposalAction[];
}

export const ActionsAccordion: React.FC<ActionsAccordionProps> = ({
  chainId,
  proposalActions,
  ...otherProps
}) => {
  const { t } = useTranslation();

  return (
    <AccordionAnimatedContent {...otherProps}>
      <div className="pt-3 text-sm md:ml-8">
        <div className="flex items-center">
          <Icon name="document" className="mr-2 w-5 h-5" />

          <p className="text-white font-semibold">{t('voteProposalUi.command.operations.title')}</p>
        </div>

        <div className="mt-1 break-all text-grey md:pl-7">
          {proposalActions.map(action => (
            <ReadableActionSignature
              key={`readable-action-signature-${action.signature}-${action.target}-${action.value}-${action.callData}`}
              className="text-sm"
              action={action}
              chainId={chainId}
            />
          ))}
        </div>
      </div>
    </AccordionAnimatedContent>
  );
};
