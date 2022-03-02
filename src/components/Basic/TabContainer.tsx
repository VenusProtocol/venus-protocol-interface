// a tab component with Venus style based on antd
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { uid } from 'react-uid';

import { Tabs } from 'antd';

const { TabPane } = Tabs;

const TabContainerWrapper = styled.div`
  background-color: var(--color-bg-primary);
  padding: 10%;
  margin-top: 24px;

  /* customized tab */
  .tab-header {
    display: flex;
    margin-bottom: 40px;
  }
  .tab {
    text-align: center;
    flex: 1;
    height: 37px;
    line-height: 37px;
    border-radius: 8px;
    color: #a1a1a1;
    cursor: pointer;
    &.active {
      color: #fff;
      background: var(--color-bg-active);
    }
  }
`;

export type TabContainerPropsType = {
  onChange?: (tabIndex: string) => void;
  children: React.ReactElement[];
  titles: string[];
  className?: string;
};

export default ({ onChange, children, titles, className }: TabContainerPropsType) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabKeys, setTabKeys] = useState(['0', '1']);

  // only need to calculate tabkeys for once, otherwise re
  useEffect(() => {
    setTabKeys(children.map(uid));
  }, []);

  return (
    <TabContainerWrapper className={className}>
      <Tabs
        activeKey={tabKeys[activeTabIndex]}
        renderTabBar={props => (
          <div className="tab-header">
            {titles.map((title, i) => (
              <div
                key={uid(title)}
                className={`tab ${activeTabIndex === i ? 'active' : ''}`}
                onClick={() => {
                  setActiveTabIndex(i);
                  if (props.onChange) {
                    props.onChange(`${i}`);
                  }
                }}
              >
                {title}
              </div>
            ))}
          </div>
        )}
        animated={false}
        defaultActiveKey={tabKeys[0]}
        onChange={onChange}
      >
        {children.map((child, i) => (
          <TabPane key={tabKeys[i]} tab={titles[i]}>
            {child}
          </TabPane>
        ))}
      </Tabs>
    </TabContainerWrapper>
  );
};
