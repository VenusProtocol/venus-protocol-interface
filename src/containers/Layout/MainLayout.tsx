import React from 'react';
import styled, { withTheme } from 'styled-components';
import Sidebar from 'containers/Layout/Sidebar';
import Header from 'containers/Layout/Header';
import { Footer } from 'components/v2/Layout/Footer';
import { Row, Column } from 'components/Basic/Style';
import { useBlock } from '../../hooks/useBlock';

const MainLayoutWrapper = styled.div`
  width: 100%;
  display: flex;
  background-color: var(--color-bg-main);
  padding-top: 50px;
  .main {
    height: 100vh;

    .main-content {
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      height: calc(100vh - 125px);
      overflow: auto;
      overflow-x: hidden;

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
        background-color: #f7c408cc;
      }

      ::-webkit-scrollbar-corner {
        background-color: transparent;
      }
    }

    @media only screen and (max-width: 768px) {
      height: unset;
      overflow: unset;
    }
  }
  .ust-warning {
    background-color: rgba(233, 61, 68, 1);
    position: fixed;
    top: 0;
    height: 50px;
    width: 100vw;
    justify-content: center;
    align-items: center;
    display: inline-flex;
    p {
      color: rgba(255, 255, 255, 1);
    }
  }
`;

interface Props {
  title?: string;
  isHeader?: boolean;
  children: JSX.Element | JSX.Element[];
}

function MainLayout({ title = '', isHeader, children }: Props) {
  const currentBlockNumber = useBlock();

  return (
    <MainLayoutWrapper>
      <div className="ust-warning">
        <p>
          <span role="img" aria-label="warning">
            ⚠️
          </span>{' '}
          Wormhole UST on Venus is not recognized by CEXs. Please convert it to WrappedUST before
          using.
        </p>
      </div>
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
              <Footer currentBlockNumber={currentBlockNumber} />
            </Column>
          </Row>
        </Column>
      </Row>
    </MainLayoutWrapper>
  );
}

MainLayout.defaultProps = {
  title: '',
  isHeader: true,
  children: null,
};
// @ts-expect-error Argument of type 'typeof MainLayout' is not assignable to parameter of type 'never'.ts(2345)
export default withTheme(MainLayout);
