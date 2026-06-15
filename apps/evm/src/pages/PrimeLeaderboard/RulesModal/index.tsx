import { Modal } from 'components';
import { useTranslation } from 'libs/translations';

export interface RulesModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, handleClose }) => {
  const { t, Trans } = useTranslation();

  const highlight = <span className="text-b1s text-white" />;

  const daysLabel = t('primeLeaderboard.rulesModal.days');
  const maxLabel = t('primeLeaderboard.rulesModal.max');

  const boostTiers = [
    { range: '0 – 29', boost: '1.0×', isMax: false },
    { range: '30 – 59', boost: '1.3×', isMax: false },
    { range: '60 – 89', boost: '1.6×', isMax: false },
    { range: '90+', boost: '2.0×', isMax: true },
  ];

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      title={t('primeLeaderboard.rulesModal.title')}
      className="max-w-138"
    >
      <div className="flex flex-col gap-6 text-b1r text-light-grey">
        <div>
          <p>
            <Trans i18nKey="primeLeaderboard.rulesModal.intro1" components={{ highlight }} />
          </p>

          <p>
            <Trans i18nKey="primeLeaderboard.rulesModal.intro2" components={{ highlight }} />
          </p>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-dark-blue-active">
              <th className="w-1/2 px-3 py-2 text-left text-b1r text-white">
                {t('primeLeaderboard.rulesModal.daysHeldColumn')}
              </th>

              <th className="w-1/2 px-3 py-2 text-left text-b1r text-white">
                {t('primeLeaderboard.rulesModal.boostColumn')}
              </th>
            </tr>
          </thead>

          <tbody>
            {boostTiers.map(tier => (
              <tr key={tier.range}>
                <td className="border-b border-dark-grey px-3 py-2 text-b1r text-white">
                  {`${tier.range} ${daysLabel}`}
                </td>

                <td className="border-b border-dark-grey px-3 py-2 text-b1r text-white">
                  {tier.isMax ? `${tier.boost} (${maxLabel})` : tier.boost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col gap-1">
          <p>
            <Trans i18nKey="primeLeaderboard.rulesModal.contribution" components={{ highlight }} />
          </p>

          <div>
            <p>{t('primeLeaderboard.rulesModal.thingsToKnowTitle')}</p>

            <ul className="list-disc pl-6">
              <li>
                <Trans i18nKey="primeLeaderboard.rulesModal.point1" components={{ highlight }} />
              </li>

              <li>
                <Trans i18nKey="primeLeaderboard.rulesModal.point2" components={{ highlight }} />
              </li>

              <li>
                <Trans i18nKey="primeLeaderboard.rulesModal.point3" components={{ highlight }} />
              </li>
            </ul>
          </div>

          <p>{t('primeLeaderboard.rulesModal.footer')}</p>
        </div>
      </div>
    </Modal>
  );
};
