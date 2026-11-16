import { useTranslation } from 'libs/translations';

export interface ZeroCollateralNoticeProps {
  tokenSymbol: string;
  onSupplyClick: () => void;
}

export const ZeroCollateralNotice: React.FC<ZeroCollateralNoticeProps> = ({
  tokenSymbol,
  onSupplyClick,
}) => {
  const { Trans } = useTranslation();

  return (
    <p className="text-b1r text-secondary">
      <Trans
        i18nKey="spokeForm.borrow.zeroCollateralNotice"
        values={{ tokenSymbol }}
        components={{
          SupplyLink: (
            <button
              type="button"
              className="text-brand cursor-pointer underline"
              onClick={onSupplyClick}
            />
          ),
        }}
      />
    </p>
  );
};
