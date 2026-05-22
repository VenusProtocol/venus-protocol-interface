import { QuaternaryButton, cn } from '@venusprotocol/ui';
import copyToClipboard from 'copy-to-clipboard';
import { useState } from 'react';

import { useTranslation } from 'libs/translations';

export interface ContractErrorNoticeProps {
  friendlyPhrase?: string;
  errorName: string;
  signature?: string;
  rawMessage: string;
}

export const ContractErrorNotice: React.FC<ContractErrorNoticeProps> = ({
  friendlyPhrase,
  errorName,
  signature,
  rawMessage,
}) => {
  const { t } = useTranslation();
  const [isRawVisible, setIsRawVisible] = useState(false);

  const hasFriendlyPhrase = !!friendlyPhrase;
  const headline = friendlyPhrase ?? t('contractErrors.notice.fallback');

  return (
    <div className="space-y-2">
      <p className="text-xs text-white md:text-sm">{headline}</p>

      {!hasFriendlyPhrase && (
        <div className="rounded-lg border border-dark-grey-hover bg-background/50 px-3 py-2 font-mono text-xs break-all">
          <span className="text-light-grey">{t('contractErrors.notice.errorLabel')}: </span>
          <span className="text-white">{errorName}</span>
          {signature && <span className="text-light-grey"> ({signature})</span>}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <QuaternaryButton size="xs" onClick={() => copyToClipboard(rawMessage)}>
          {t('contractErrors.notice.copyDetails')}
        </QuaternaryButton>
        <QuaternaryButton size="xs" onClick={() => setIsRawVisible(prev => !prev)}>
          {isRawVisible
            ? t('contractErrors.notice.hideRawError')
            : t('contractErrors.notice.showRawError')}
        </QuaternaryButton>
      </div>

      {isRawVisible && (
        <pre
          className={cn(
            'max-h-60 overflow-auto rounded-lg border border-dark-grey-hover bg-background/50 p-3',
            'font-mono text-xs text-white whitespace-pre-wrap break-all',
          )}
        >
          {rawMessage}
        </pre>
      )}
    </div>
  );
};
