import { useContext } from 'react';

import { SuccessfulTransactionModalContext } from 'context/SuccessfulTransactionModalContext';

export type { OpenSuccessfulTransactionModalInput } from 'context/SuccessfulTransactionModalContext';

const useSuccessfulTransactionModal = () => useContext(SuccessfulTransactionModalContext);
export default useSuccessfulTransactionModal;
