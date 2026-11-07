export interface MarketPageGridProps {
  form: React.ReactElement;
  content: React.ReactElement;
}

export const MarketPageGrid: React.FC<MarketPageGridProps> = ({ form, content }) => (
  <div className="space-y-6 lg:space-y-0 lg:gap-x-6 lg:grid lg:grid-cols-2 xl:grid-cols-[7fr_5fr]">
    <div className="w-auto self-start shrink-0 overflow-x-auto sm:relative sm:isolate sm:p-6 sm:rounded-lg sm:border sm:border-blue sm:bg-surface-glass sm:shadow-glass sm:before:pointer-events-none sm:before:absolute sm:before:inset-0 sm:before:-z-10 sm:before:rounded-[inherit] sm:before:backdrop-blur-glass lg:order-2 lg:sticky lg:top-26 lg:max-h-[calc(100vh-208px)]">
      {form}
    </div>

    <div className="lg:order-1">{content}</div>
  </div>
);
