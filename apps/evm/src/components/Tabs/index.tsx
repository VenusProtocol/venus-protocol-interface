/** @jsxImportSource @emotion/react */
import { type Tab, type TabNavType, useTabs } from 'hooks/useTabs';
import { ButtonGroup } from '../ButtonGroup';
import { useStyles } from './styles';

export interface TabsProps {
  tabs: Tab[];
  onTabChange?: (newIndex: number) => void;
  navType?: TabNavType;
  initialActiveTabId?: string;
  className?: string;
}

export const Tabs = ({
  tabs,
  onTabChange,
  initialActiveTabId,
  className,
  navType = 'state',
}: TabsProps) => {
  const styles = useStyles();
  const { activeTab, setActiveTab } = useTabs({
    tabs,
    navType,
    initialActiveTabId,
  });

  const handleChange = (index: number) => {
    const id = tabs[index].id;
    setActiveTab({ id });

    // Only call onTabChange callback if tab clicked isn't currently active
    if (id !== activeTab.id && onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div className={className}>
      <ButtonGroup
        buttonLabels={tabs.map(({ title }) => title)}
        css={styles.buttonsContainer}
        activeButtonIndex={tabs.findIndex(tab => activeTab.id === tab.id)}
        onButtonClick={handleChange}
        fullWidth
      />

      {activeTab.content}
    </div>
  );
};
