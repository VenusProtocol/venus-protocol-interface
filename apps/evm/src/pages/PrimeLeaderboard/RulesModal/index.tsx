import { Modal } from 'components';
import { useTranslation } from 'libs/translations';

import { BOOST_TIERS } from './constants';

export interface RulesModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, handleClose }) => {
  const { t, Trans } = useTranslation();

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
            <Trans
              i18nKey="primeLeaderboard.rulesModal.intro1"
              components={{ highlight: <span className="text-b1s text-white" /> }}
            />
          </p>

          <p>
            <Trans
              i18nKey="primeLeaderboard.rulesModal.intro2"
              components={{ highlight: <span className="text-b1s text-white" /> }}
            />
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
            {BOOST_TIERS.map(({ range, boost, isMax }) => (
              <tr key={range}>
                <td className="border-b border-dark-grey px-3 py-2 text-b1r text-white">
                  {t('primeLeaderboard.rulesModal.daysHeld', { range })}
                </td>

                <td className="border-b border-dark-grey px-3 py-2 text-b1r text-white">
                  {isMax ? t('primeLeaderboard.rulesModal.boostMax', { boost }) : boost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex flex-col gap-1">
          <p>
            <Trans
              i18nKey="primeLeaderboard.rulesModal.contribution"
              components={{ highlight: <span className="text-b1s text-white" /> }}
            />
          </p>

          <div>
            <p>{t('primeLeaderboard.rulesModal.thingsToKnowTitle')}</p>

            <ul className="list-disc pl-6">
              <li>
                <Trans
                  i18nKey="primeLeaderboard.rulesModal.point1"
                  components={{ highlight: <span className="text-b1s text-white" /> }}
                />
              </li>

              <li>
                <Trans
                  i18nKey="primeLeaderboard.rulesModal.point2"
                  components={{ highlight: <span className="text-b1s text-white" /> }}
                />
              </li>

              <li>
                <Trans
                  i18nKey="primeLeaderboard.rulesModal.point3"
                  components={{ highlight: <span className="text-b1s text-white" /> }}
                />
              </li>
            </ul>
          </div>

          <p>{t('primeLeaderboard.rulesModal.footer')}</p>
        </div>
      </div>
    </Modal>
  );
};
