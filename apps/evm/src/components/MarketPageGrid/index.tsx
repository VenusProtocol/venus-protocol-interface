export interface MarketPageGridProps {
  form: React.ReactElement;
  content: React.ReactElement;
}

export const MarketPageGrid: React.FC<MarketPageGridProps> = ({ form, content }) => (
  <div className="space-y-6 lg:space-y-0 lg:gap-x-6 lg:grid lg:grid-cols-2 xl:grid-cols-[7fr_5fr]">
    <div className="w-auto self-start shrink-0 overflow-x-auto sm:p-6 sm:rounded-lg sm:border sm:border-blue sm:bg-dark-blue lg:order-2 lg:sticky lg:top-6 lg:max-h-[calc(100vh-128px)]">
      {form}
    </div>

    <div className="lg:order-1">{content}</div>
  </div>
);
