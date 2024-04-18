import { Breadcrumbs } from './Breadcrumbs';
import { MdUpControls } from './MdUpControls';
import { XsControls } from './XsControls';

export const TopBar: React.FC = () => (
  <>
    <XsControls />

    <div className="px-4 pb-6 pt-8 md:flex md:justify-between md:px-6 md:py-8 xl:px-10">
      <div className="flex flex-1 items-center">
        <Breadcrumbs />
      </div>

      <MdUpControls />
    </div>
  </>
);
