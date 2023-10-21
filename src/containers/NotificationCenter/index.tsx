import { Notice } from 'components';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { notificationStore } from 'stores/notifications';

import TEST_IDS from './testIds';

const ANIMATION_BASE_DURATION_S = 0.75;
const EASE = [0.23, 1, 0.32, 1];

const NotificationCenter: React.FC = () => {
  const notifications = notificationStore.use.notifications();

  return createPortal(
    <ul
      className="fixed right-4 top-4 z-[9999] ml-4 max-h-full w-full max-w-[500px] md:right-6 md:top-6"
      data-testid={TEST_IDS.container}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {notifications.map(({ id, ...otherNotificationProps }) => (
          <motion.li
            key={id}
            className="mb-2 last:mb-0"
            layout
            initial={{ opacity: 0, x: '100%' }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                x: {
                  ease: EASE,
                  duration: ANIMATION_BASE_DURATION_S,
                  delay: (ANIMATION_BASE_DURATION_S * 1) / 3,
                },
                opacity: {
                  ease: EASE,
                  duration: ANIMATION_BASE_DURATION_S,
                  delay: (ANIMATION_BASE_DURATION_S * 1) / 3,
                },
              },
            }}
            exit={{
              opacity: 0,
              y: 20,
            }}
            transition={{
              ease: EASE,
              duration: ANIMATION_BASE_DURATION_S,
            }}
          >
            <Notice {...otherNotificationProps} />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>,
    document.body,
  );
};

export default NotificationCenter;
