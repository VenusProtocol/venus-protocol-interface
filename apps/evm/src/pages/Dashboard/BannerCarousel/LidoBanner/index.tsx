import { ButtonWrapper } from 'components';
import { Link } from 'containers/Link';

import { routes } from 'constants/routing';
import lidoLogo from './lidoLogo.svg';
import sun from './sun.svg';

const LIDO_POOL_LINK = routes.isolatedPool.path.replace(
  ':poolComptrollerAddress',
  '0xF522cd0360EF8c2FF48B648d53EA1717Ec0F3Ac3',
);

export const LidoBanner: React.FC = () => (
  <div className="relative py-6 sm:p-0 md:p-0 h-[220px] bg-gradient-to-b from-[rgb(243,130,123)] to-[rgb(234,235,161)]">
    <div className="sm:flex sm:flex-row">
      <img className="h-[2000px] absolute right-0 left-0 -top-[900px] m-auto" src={sun} alt="" />

      <img className="h-[160px] absolute right-20 top-0 bottom-0 m-auto" src={lidoLogo} alt="" />

      <div className="text-center mx-auto mt-7 z-10">
        <p className="mb-2 text-xl text-cards">Earn rewards while keeping liquidity</p>

        <p className="text-lightGrey mb-8 text-sm xl:text-base">
          Unlock the power of your assets with the Lido pool.
        </p>

        <ButtonWrapper variant="primary" className="w-full sm:w-auto" asChild>
          <Link to={LIDO_POOL_LINK} className="text-offWhite no-underline hover:no-underline">
            Stake in Lido pool
          </Link>
        </ButtonWrapper>
      </div>
    </div>
  </div>
);
