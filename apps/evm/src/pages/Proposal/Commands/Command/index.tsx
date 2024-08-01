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
import { useCommand } from './useCommand';

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

  const { isOnWrongChain, isExecutable, hasFailedExecution } = useCommand({
    chainId,
    state,
    executableAt,
    failedExecutionAt,
    executedAt,
  });

  const description = useMemo(() => {
    switch (state) {
      case ProposalCommandState.Pending:
        return t('voteProposalUi.command.description.pending');
      case ProposalCommandState.Bridged:
        return t('voteProposalUi.command.description.bridged');
      case ProposalCommandState.Canceled:
        return t('voteProposalUi.command.description.canceled');
      case ProposalCommandState.Queued:
        if (!executableAt || isAfter(executableAt, now)) {
          return t('voteProposalUi.command.description.waitingToBeExecutable');
        }

        if (isOnWrongChain) {
          return t('voteProposalUi.command.description.wrongChain', {
            chainName: chainMetadata.name,
          });
        }

        if (hasFailedExecution) {
          return t('voteProposalUi.command.description.executionFailed');
        }
        break;
    }
  }, [t, state, executableAt, hasFailedExecution, now, chainMetadata, isOnWrongChain]);

  return (
    <div {...otherProps}>
      <div
        className={cn(
          'sm:flex sm:justify-between sm:gap-x-3 cursor-pointer',
          !isExecutable && 'flex justify-between gap-x-3',
        )}
        onClick={toggleAccordion}
      >
        <div className={cn('text-left flex-1', !description && 'flex flex-col justify-center')}>
          <div className="flex items-center gap-x-2">
            <img
              src={chainMetadata.logoSrc}
              alt={chainMetadata.name}
              className="w-5 max-w-none flex-none"
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
                'text-sm mt-3 md:pl-8 md:mt-1 text-grey',
                hasFailedExecution && 'text-red',
                isOnWrongChain && isExecutable && 'text-orange',
              )}
            >
              {description}
            </p>
          )}
        </div>

        <Cta
          className={cn(isExecutable && 'mt-3')}
          chainId={chainId}
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

      <AccordionAnimatedContent
        className="mt-3 text-sm md:ml-8 max-w-[700px] md:mt-2"
        isOpen={isOpen}
      >
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
      </AccordionAnimatedContent>
    </div>
  );
};
