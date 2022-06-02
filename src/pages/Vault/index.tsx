/** @jsxImportSource @emotion/react */
import React, { useContext } from 'react';

import { AuthContext } from 'context/AuthContext';
import { useGetVaults } from 'clients/api';

const VaultUi: React.FC = () => <div>Vault</div>;

const Vault: React.FC = () => {
  // DEV ONLY
  const { account } = useContext(AuthContext);
  useGetVaults({
    accountAddress: account?.address,
  });
  // END DEV ONLY

  return <VaultUi />;
};

export default Vault;
