import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import Sidebar from 'containers/Layout/Sidebar';
import Header from 'containers/Layout/Header';
import Footer from 'containers/Layout/Footer';
import { Row, Column } from 'components/Basic/Style';

const MainLayoutWrapper = styled.div`
  width: 100%;
  display: flex;
  background-color: var(--color-bg-main);

  .main {
    height: 100vh;
    overflow: auto;
    overflow-x: hidden;

    .main-content {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh - 150px);
      background-color: var(--color-bg-main);
    }

    /* width */
    &::-webkit-scrollbar {
      width: 7px;
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      -webkit-border-radius: 3px;
      background-color: var(--color-primary);
    }

    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
      background: #e53d52;
    }

    ::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    @media only screen and (max-width: 768px) {
      // height: calc(100% - 60px);
      height: unset;
      overflow: unset;
    }
  }
`;

function MainLayout({ title, isHeader, children }) {
  return (
    <MainLayoutWrapper>
      <Row>
        <Column xs="12" sm="1.5">
          <Sidebar />
        </Column>
        <Column xs="12" sm="10.5" className="main">
          <Row>
            {isHeader && (
              <Column xs="12">
                <Header title={title} />
              </Column>
            )}
            <Column xs="12">
              <div className="main-content">{children}</div>
            </Column>
            <Column xs="12">
              <Footer />
            </Column>
          </Row>
        </Column>
      </Row>
    </MainLayoutWrapper>
  );
}

MainLayout.propTypes = {
  title: PropTypes.string,
  isHeader: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

MainLayout.defaultProps = {
  title: '',
  isHeader: true,
  children: null
};

export default withTheme(MainLayout);
