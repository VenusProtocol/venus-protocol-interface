import { AnimatePresence, motion } from 'motion/react';

import { Icon } from 'components';
import { useTranslation } from 'libs/translations';
import { useGetSelectedTradePosition } from '../useGetSelectedTradePosition';
import { Form } from './Form';
import { store } from './store';

const ANIMATION_BASE_DURATION_S = 0.75;
const EASE = [0.23, 1, 0.32, 1];

export const ClosePositionModal: React.FC = () => {
  const { t } = useTranslation();

  const { data } = useGetSelectedTradePosition();
  const selectedPosition = data?.position;

  const isModalShown = store.use.isModalShown();
  const hideModal = store.use.hideModal();

  return (
    <AnimatePresence initial={false}>
      {isModalShown && selectedPosition && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{
            x: 0,
            transition: {
              x: {
                ease: EASE,
                duration: ANIMATION_BASE_DURATION_S,
              },
            },
          }}
          exit={{
            x: '100%',
          }}
          transition={{
            ease: EASE,
            duration: ANIMATION_BASE_DURATION_S,
          }}
          className="fixed inset-0 z-10 bg-background-active top-20 overflow-y-auto px-8 py-6 xl:rounded-lg xl:border xl:border-dark-blue-hover xl:absolute xl:top-0"
        >
          <div className="relative py-1 mb-6">
            <button
              type="button"
              className="cursor-pointer absolute top-[50%] translate-y-[-50%] left-0"
              onClick={hideModal}
            >
              <Icon name="arrowRight" className="rotate-180 size-5" />
            </button>

            <h3 className="text-p3s text-center">{t('trade.closePositionModal.title')}</h3>
          </div>

          <Form />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
