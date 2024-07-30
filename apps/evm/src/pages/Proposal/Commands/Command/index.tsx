import { AccordionAnimatedContent, Icon } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { ReadableActionSignature } from 'containers/ReadableActionSignature';
import { isAfter } from 'date-fns/isAfter';
import { useNow } from 'hooks/useNow';
import { useGetTokens } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { useMemo, useState } from 'react';
import { type ProposalCommand, ProposalCommandState } from 'types';
import { cn } from 'utilities';
import { Cta } from './Cta';

export type CommandProps = React.HTMLAttributes<HTMLDivElement> & ProposalCommand & {};

export const Command: React.FC<CommandProps> = ({
  chainId,
  state,
  actionSignatures,
  bridgedAt,
  canceledAt,
  queuedAt,
  succeededAt,
  failedExecutionAt,
  executableAt,
  executedAt,
  expiredAt,
  ...otherProps
}) => {
  const chainMetadata = CHAIN_METADATA[chainId];
  const { t } = useTranslation();
  const tokens = useGetTokens();
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => setIsOpen(prevState => !prevState);
  const now = useNow();

  const { description } = useMemo(() => {
    let tmpDescription = '';

    switch (state) {
      case ProposalCommandState.Pending:
        tmpDescription = t('voteProposalUi.command.description.pending');
        break;
      case ProposalCommandState.Bridged:
        tmpDescription = t('voteProposalUi.command.description.bridged');
        break;
      case ProposalCommandState.Canceled:
        tmpDescription = t('voteProposalUi.command.description.canceled');
        break;
      case ProposalCommandState.Queued:
        if (!executableAt || isAfter(executableAt, now)) {
          tmpDescription = t('voteProposalUi.command.description.waitingToBeExecutable');
        } else if (failedExecutionAt && !executedAt) {
          tmpDescription = t('voteProposalUi.command.description.executionFailed');
        }
        break;
    }

    return {
      description: tmpDescription,
    };
  }, [t, state, executableAt, failedExecutionAt, executedAt, now]);

  return (
    <div {...otherProps}>
      <div className="md:flex md:justify-between">
        <div className="float-right md:float-none md:order-2">
          <Cta
            state={state}
            bridgedAt={bridgedAt}
            canceledAt={canceledAt}
            queuedAt={queuedAt}
            succeededAt={succeededAt}
            failedExecutionAt={failedExecutionAt}
            executableAt={executableAt}
            executedAt={executedAt}
            expiredAt={expiredAt}
          />
        </div>

        <div
          className={cn(
            'text-left cursor-pointer md:flex-1 md:mr-3',
            !description && 'flex flex-col justify-center',
          )}
          onClick={toggleAccordion}
        >
          <div className="md:flex md:items-center">
            <img
              src={chainMetadata.logoSrc}
              alt={chainMetadata.name}
              className="w-5 max-w-none flex-none mb-3 md:mb-0 md:mr-3"
            />

            <div className="flex items-center">
              <p className="text-sm font-semibold">{chainMetadata.name}</p>

              <Icon
                name="arrowUp"
                className={cn('text-grey w-5 h-5 ml-1', !isOpen && 'rotate-180')}
              />
            </div>
          </div>

          {!!description && (
            <p
              className={cn(
                'text-sm mt-1 md:pl-8',
                failedExecutionAt && !executedAt ? 'text-red' : 'text-grey',
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>

      <AccordionAnimatedContent isOpen={isOpen}>
        <div className="pt-3 text-sm md:pl-8">
          <div className="flex items-center">
            <Icon name="document" className="mr-2 w-5 h-5" />

            <p className="text-offWhite font-semibold">
              {t('voteProposalUi.command.operations.title')}
            </p>
          </div>

          <div className="mt-1 break-all text-grey md:pl-7">
            {actionSignatures.map(action => (
              <ReadableActionSignature
                className="text-sm"
                key={`readable-action-signature-${action.signature}-${action.target}-${action.value}-${action.callData}`}
                action={action}
                tokens={tokens}
              />
            ))}
          </div>
        </div>
      </AccordionAnimatedContent>
    </div>
  );
};
