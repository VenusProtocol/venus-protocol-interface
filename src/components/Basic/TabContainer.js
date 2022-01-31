// a tab component with Venus style based on antd
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Tabs } from 'antd';

const { TabPane } = Tabs;

const TabContainerWrapper = styled.div`
  background-color: var(--color-bg-primary);
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

function TabContainer({ styles, onChange, children, titles }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <TabContainerWrapper style={styles}>
      <Tabs
        activeKey={`${activeTabIndex}`}
        renderTabBar={props => {
          return (
            <div className="tab-header">
              {titles.map((title, i) => {
                return (
                  <div
                    key={i}
                    className={`tab ${activeTabIndex === i ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTabIndex(i);
                      props.onChange(`${i}`);
                    }}
                  >
                    {title}
                  </div>
                );
              })}
            </div>
          );
        }}
        animated={false}
        defaultActiveKey="0"
        onChange={onChange}
      >
        {children.map((child, i) => {
          return (
            <TabPane key={`${i}`} tab={titles[i]}>
              {child}
            </TabPane>
          );
        })}
      </Tabs>
    </TabContainerWrapper>
  );
}

TabContainer.propTypes = {
  styles: PropTypes.object,
  onChange: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  titles: PropTypes.arrayOf(PropTypes.string).isRequired
};

TabContainer.defaultProps = {
  styles: {},
  onChange: () => {}
};

export default TabContainer;
