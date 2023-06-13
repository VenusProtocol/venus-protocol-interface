import React from 'react';

const toggleCollateralMock = jest.fn();

export default () => ({
  toggleCollateral: toggleCollateralMock,
  CollateralModal: () => <></>,
});
