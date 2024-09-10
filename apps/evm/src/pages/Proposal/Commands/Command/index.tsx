import { AccordionAnimatedContent, Icon } from 'components';
import { CHAIN_METADATA } from 'constants/chainMetadata';
import { ReadableActionSignature } from 'containers/ReadableActionSignature';
import { isAfter } from 'date-fns/isAfter';
import { useNow } from 'hooks/useNow';
import { useTranslation } from 'libs/translations';
import { useMemo, useState } from 'react';
import { type RemoteProposal, RemoteProposalState } from 'types';
import { cn } from 'utilities';
import TEST_IDS from '../../testIds';
import { Cta } from './Cta';
import { StepInfo } from './StepInfo';
import { useCommand } from './useCommand';

export type CommandProps = React.HTMLAttributes<HTMLDivElement> & RemoteProposal & {};

export const Command: React.FC<CommandProps> = ({
  chainId,
  state,
  proposalActions,
  bridgedDate,
  canceledDate,
  queuedDate,
  executionEtaDate,
  executedDate,
  expiredDate,
  ...otherProps
}) => {
  const chainMetadata = CHAIN_METADATA[chainId];
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleAccordion = () => setIsOpen(prevState => !prevState);
  const now = useNow();

  const { isOnWrongChain, isExecutable } = useCommand({
    chainId,
    state,
    executionEtaDate,
  });

  const description = useMemo(() => {
    switch (state) {
      case RemoteProposalState.Pending:
        return t('voteProposalUi.command.description.pending');
      case RemoteProposalState.Bridged:
        return t('voteProposalUi.command.description.bridged');
      case RemoteProposalState.Canceled:
        return t('voteProposalUi.command.description.canceled');
      case RemoteProposalState.Queued:
        if (!executionEtaDate || isAfter(executionEtaDate, now)) {
          return t('voteProposalUi.command.description.waitingToBeExecutable');
        }

        if (isOnWrongChain) {
          return t('voteProposalUi.command.description.wrongChain', {
            chainName: chainMetadata.name,
          });
        }
        break;
    }
  }, [t, state, executionEtaDate, now, chainMetadata, isOnWrongChain]);

  const accordionContentDom = (
    <div className="pt-3 text-sm md:ml-8">
      <div className="flex items-center">
        <Icon name="document" className="mr-2 w-5 h-5" />

        <p className="text-offWhite font-semibold">
          {t('voteProposalUi.command.operations.title')}
        </p>
      </div>

      <div className="mt-1 break-all text-grey md:pl-7">
        {proposalActions.map(action => (
          <ReadableActionSignature
            className="text-sm"
            key={`readable-action-signature-${action.signature}-${action.target}-${action.value}-${action.callData}`}
            action={action}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div data-testid={TEST_IDS.command} {...otherProps}>
      <div className={cn('flex justify-between sm:flex sm:justify-between')}>
        <div className={cn('flex-1', !description && 'flex flex-col justify-center')}>
          <div className="cursor-pointer pr-3 space-y-3 md:space-y-1" onClick={toggleAccordion}>
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
                  'text-sm md:pl-8 text-grey',
                  isOnWrongChain && isExecutable && 'text-orange',
                )}
              >
                {description}
              </p>
            )}
          </div>

          <AccordionAnimatedContent className="hidden lg:block" isOpen={isOpen}>
            {accordionContentDom}
          </AccordionAnimatedContent>
        </div>

        {isExecutable ? (
          <Cta
            className="hidden lg:block"
            chainId={chainId}
            state={state}
            bridgedDate={bridgedDate}
            canceledDate={canceledDate}
            queuedDate={queuedDate}
            executionEtaDate={executionEtaDate}
            executedDate={executedDate}
            expiredDate={expiredDate}
          />
        ) : (
          <StepInfo
            className="cursor-pointer"
            onClick={toggleAccordion}
            chainId={chainId}
            state={state}
            bridgedDate={bridgedDate}
            canceledDate={canceledDate}
            queuedDate={queuedDate}
            executionEtaDate={executionEtaDate}
            executedDate={executedDate}
            expiredDate={expiredDate}
          />
        )}
      </div>

      <AccordionAnimatedContent className="lg:hidden" isOpen={isOpen}>
        {accordionContentDom}
      </AccordionAnimatedContent>

      {isExecutable && (
        <Cta
          className="mt-3 w-full lg:hidden"
          chainId={chainId}
          state={state}
          bridgedDate={bridgedDate}
          canceledDate={canceledDate}
          queuedDate={queuedDate}
          executionEtaDate={executionEtaDate}
          executedDate={executedDate}
          expiredDate={expiredDate}
        />
      )}
    </div>
  );
};
