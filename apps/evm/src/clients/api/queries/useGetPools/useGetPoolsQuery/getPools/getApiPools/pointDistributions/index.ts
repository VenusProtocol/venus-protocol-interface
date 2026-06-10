import type { ApiPointsDistribution, PointsProgram } from '..';
import asterPointsLogo from './asterPoints.svg';
import ethenaPointsLogo from './ethenaPoints.svg';
import etherfiPointsLogo from './etherfiPoints.svg';
import kelpMilesLogo from './kelpMiles.svg';
import solvPointsLogo from './solvPoints.svg';

const getPointDistributionLogo = (pointsProgram: PointsProgram) => {
  switch (pointsProgram) {
    case 'ethena':
      return ethenaPointsLogo;
    case 'etherfi':
      return etherfiPointsLogo;
    case 'kelp':
      return kelpMilesLogo;
    case 'solv':
      return solvPointsLogo;
    case 'aster':
      return asterPointsLogo;
  }
};

export const formatPointDistribution = (pointsDistribution: ApiPointsDistribution) => {
  const logoUrl = getPointDistributionLogo(pointsDistribution.pointsProgram);

  return {
    ...pointsDistribution,
    logoUrl,
  };
};
