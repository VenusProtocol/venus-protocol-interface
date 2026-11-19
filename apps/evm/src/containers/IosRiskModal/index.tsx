import { useEffect, useId, useRef, useState } from 'react';

import { Button, ButtonWrapper, Icon, Modal, Notice, TextField } from 'components';
import { IOS_RISK_CONFIRM_PHRASE, IOS_UPDATE_GUIDE_URL } from 'constants/iosRisk';
import { useInterfaceMode } from 'hooks/useInterfaceMode';
import { useIosRiskModal } from 'hooks/useIosRiskModal';
import { useAnalytics } from 'libs/analytics';
import { useTranslation } from 'libs/translations';
import { useAccountAddress } from 'libs/wallet';
import { getIosBrowserName, isIosRiskPhraseMatch } from 'utilities';

const IosRiskModal: React.FC = () => {
  const { t, Trans } = useTranslation();
  const { risk, isUnreadable, isOpen, acknowledge } = useIosRiskModal();
  const { captureAnalyticEvent } = useAnalytics();
  const { mode } = useInterfaceMode();
  const { accountAddress } = useAccountAddress();
  const inputId = useId();
  const [value, setValue] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const openedAtMsRef = useRef<number | undefined>(undefined);
  const hasTrackedDetectFailedRef = useRef(false);

  const isMatch = isIosRiskPhraseMatch(value);
  const hasError = isTouched && !isMatch;

  useEffect(() => {
    if (!isOpen || !risk || openedAtMsRef.current !== undefined) {
      return;
    }

    openedAtMsRef.current = Date.now();

    captureAnalyticEvent('ios_risk_popup_shown', {
      kit: risk.kit,
      ios_version: risk.version,
      browser: getIosBrowserName(window.navigator.userAgent),
      layer: mode,
      wallet_connected: !!accountAddress,
    });
  });

  useEffect(() => {
    if (!isUnreadable || hasTrackedDetectFailedRef.current) {
      return;
    }

    hasTrackedDetectFailedRef.current = true;

    captureAnalyticEvent('ios_risk_detect_failed', {
      user_agent: window.navigator.userAgent,
    });
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  if (!isOpen || !risk) {
    return undefined;
  }

  const handleContinue = () => {
    if (!isMatch) {
      setIsTouched(true);
      return;
    }

    captureAnalyticEvent('ios_risk_acknowledged', {
      kit: risk.kit,
      ios_version: risk.version,
      time_to_ack_ms: Date.now() - (openedAtMsRef.current ?? Date.now()),
    });

    acknowledge();
  };

  const handleUpdateClick = () =>
    captureAnalyticEvent('ios_risk_update_clicked', {
      kit: risk.kit,
      ios_version: risk.version,
    });

  return (
    <Modal isOpen title={t('iosRiskModal.title')} className="border-danger">
      <div className="flex flex-col gap-y-6">
        <Notice
          variant="error"
          title={t('iosRiskModal.noticeTitle', { version: risk.version, kit: risk.kit })}
          description={
            <Trans
              i18nKey="iosRiskModal.noticeDescription"
              values={{ kit: risk.kit, from: risk.from, to: risk.to }}
              components={{
                LineBreak: <br />,
                Bold: <span className="font-semibold" />,
              }}
            />
          }
        />

        <div className="flex flex-col gap-y-2">
          <label className="text-b1r text-secondary" htmlFor={inputId}>
            <Trans
              i18nKey="iosRiskModal.confirmLabel"
              values={{ phrase: IOS_RISK_CONFIRM_PHRASE }}
              components={{
                Bold: <span className="font-semibold text-primary" />,
              }}
            />
          </label>

          <TextField
            id={inputId}
            value={value}
            placeholder={IOS_RISK_CONFIRM_PHRASE}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="done"
            hasError={hasError}
            aria-invalid={hasError}
            onChange={event => {
              setValue(event.currentTarget.value);
              setIsTouched(false);
            }}
            onBlur={() => setIsTouched(value.trim() !== '')}
            onKeyDown={event => {
              if (event.key === 'Enter') {
                handleContinue();
              }
            }}
            rightAdornment={
              isMatch ? <Icon name="checkInline" className="size-5 text-success" /> : undefined
            }
            description={
              hasError ? (
                <span className="text-danger" role="alert">
                  {t('iosRiskModal.mismatch', { phrase: IOS_RISK_CONFIRM_PHRASE })}
                </span>
              ) : undefined
            }
          />
        </div>

        <div className="flex flex-col gap-y-3">
          <Button disabled={!isMatch} onClick={handleContinue}>
            {t('iosRiskModal.continueButton')}
          </Button>

          <ButtonWrapper asChild variant="text" className="self-center">
            <a
              href={IOS_UPDATE_GUIDE_URL}
              target="_blank"
              rel="noreferrer"
              onClick={handleUpdateClick}
            >
              {t('iosRiskModal.updateButton')}
            </a>
          </ButtonWrapper>
        </div>
      </div>
    </Modal>
  );
};

export default IosRiskModal;
