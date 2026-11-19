import { Icon } from 'components/Icon';
import { Modal } from 'components/Modal';
import { Link } from 'containers/Link';
import { useTranslation } from 'libs/translations';
import type { SpokePool } from 'types';
import { getLocalizedText } from './getLocalizedText';

export interface SpokePoolInfoModalProps {
  spokePool: Pick<SpokePool, 'name' | 'description' | 'infoTags'>;
  isOpen: boolean;
  handleClose: () => void;
}

export const SpokePoolInfoModal: React.FC<SpokePoolInfoModalProps> = ({
  spokePool,
  isOpen,
  handleClose,
}) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage ?? 'en';

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={spokePool.name}
      className="max-h-[85dvh] max-w-120 overflow-hidden"
      contentClassName="min-h-0 overflow-y-auto"
    >
      <div className="flex flex-col gap-y-4">
        {!!spokePool.description && (
          <p className="text-b1r text-secondary">{spokePool.description}</p>
        )}

        {spokePool.infoTags.map((infoTag, index) => {
          const title = getLocalizedText(infoTag.title, locale);
          const content = getLocalizedText(infoTag.content, locale);
          const urlLabel =
            getLocalizedText(infoTag.urlLabel, locale) || t('spokePoolInfo.learnMore');

          return (
            <div
              key={index}
              className="flex flex-col gap-y-2 rounded-lg border border-card bg-card p-4"
            >
              {!!title && (
                <div className="flex items-center gap-x-2">
                  <Icon name="info" className="size-4 shrink-0 text-secondary" />
                  <p className="min-w-0 break-words text-p2s">{title}</p>
                </div>
              )}

              <p className="whitespace-pre-line break-words text-b2r text-secondary">{content}</p>

              {!!infoTag.url && (
                <div className="flex flex-col gap-y-1">
                  <Link
                    href={infoTag.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-full items-center gap-x-1 self-start font-semibold"
                  >
                    <span className="min-w-0 break-words">{urlLabel}</span>
                    <Icon name="open" className="size-3 shrink-0 text-inherit" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
