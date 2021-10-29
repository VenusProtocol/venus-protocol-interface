import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Input, Form, Dropdown, Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import MainLayout from 'containers/Layout/MainLayout';
import { promisify } from 'utilities';
import Button from '@material-ui/core/Button';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import toast from 'components/Basic/Toast';
import * as constants from 'utilities/constants';
import { Row, Column } from 'components/Basic/Style';

const FaucetWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  height: 100%;
  flex: 1;
  padding: 20px;
  input {
    width: 100%;
    height: 42px;
  }

  .header {
    font-size: 36px;
    font-weight: 600;
    color: var(--color-text-main);
    margin-top: 100px;
    margin-bottom: 30px;
    text-align: center;

    @media only screen and (max-width: 768px) {
      font-size: 28px;
      margin-top: 0px;
    }
  }

  .bottom {
    color: var(--color-text-main);
    padding: 30px 0;

    .title {
      font-size: 24px;
      font-weight: 600;
    }

    .description {
      margin-top: 10px;
      font-size: 16px;
      font-weight: normal;
      text-align: center;
    }
  }

  .button-section {
    margin: 20px 0;
  }

  .empty-menu {
    opacity: 0;

    @media only screen and (max-width: 768px) {
      display: none;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
  .button {
    width: 150px;
    height: 40px;
    border-radius: 5px;
    background-image: linear-gradient(to right, #f2c265, #f7b44f);
    .MuiButton-label {
      font-size: 15px;
      font-weight: 500;
      color: var(--color-text-main);
      text-transform: capitalize;

      @media only screen and (max-width: 1440px) {
        font-size: 12px;
      }
    }
  }
`;

function Faucet({ form, getFromFaucet }) {
  const { getFieldDecorator } = form;
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuClick = (e, symbol) => {
    form.validateFields((err, values) => {
      if (!err) {
        setIsLoading(true);
        promisify(getFromFaucet, {
          address: values.address,
          asset: symbol,
          amountType: e.key
        })
          .then(() => {
            setIsLoading(false);
            let fromAddress;
            if (symbol === 'xvs') {
              fromAddress = constants.CONTRACT_XVS_TOKEN_ADDRESS;
            } else if (symbol === 'bnb') {
              fromAddress = constants.CONTRACT_XVS_TOKEN_ADDRESS;
            } else {
              fromAddress = constants.CONTRACT_TOKEN_ADDRESS[symbol].address;
            }
            toast.success({
              title: `Funding request for ${fromAddress} into ${values.address}`
            });
          })
          .catch(error => {
            if (error.data && error.data.message) {
              toast.error({
                title: error.data.message
              });
            }
            setIsLoading(false);
          });
      }
    });
  };

  const usdcMenu = (
    <Menu onClick={e => handleMenuClick(e, 'usdc')}>
      <Menu.Item key="low">1000 USDCs</Menu.Item>
      <Menu.Item key="medium">2000 USDCs</Menu.Item>
      <Menu.Item key="high">5000 USDCs</Menu.Item>
    </Menu>
  );

  const usdtMenu = (
    <Menu onClick={e => handleMenuClick(e, 'usdt')}>
      <Menu.Item key="low">1000 USDTs</Menu.Item>
      <Menu.Item key="medium">2000 USDTs</Menu.Item>
      <Menu.Item key="high">5000 USDTs</Menu.Item>
    </Menu>
  );

  const busdMenu = (
    <Menu onClick={e => handleMenuClick(e, 'busd')}>
      <Menu.Item key="low">1000 BUSDs</Menu.Item>
      <Menu.Item key="medium">2000 BUSDs</Menu.Item>
      <Menu.Item key="high">5000 BUSDs</Menu.Item>
    </Menu>
  );

  const bnbMenu = (
    <Menu onClick={e => handleMenuClick(e, 'bnb')}>
      <Menu.Item key="low">1 BNB</Menu.Item>
      <Menu.Item key="medium">2.5 BNBs</Menu.Item>
      <Menu.Item key="high">5 BNBs</Menu.Item>
    </Menu>
  );

  const sxpMenu = (
    <Menu onClick={e => handleMenuClick(e, 'sxp')}>
      <Menu.Item key="low">100 SXPs</Menu.Item>
      <Menu.Item key="medium">200 SXPs</Menu.Item>
      <Menu.Item key="high">500 SXPs</Menu.Item>
    </Menu>
  );

  const xvsMenu = (
    <Menu onClick={e => handleMenuClick(e, 'xvs')}>
      <Menu.Item key="low">100 XVSs</Menu.Item>
      <Menu.Item key="medium">200 XVSs</Menu.Item>
      <Menu.Item key="high">500 XVSs</Menu.Item>
    </Menu>
  );

  const btcbMenu = (
    <Menu onClick={e => handleMenuClick(e, 'btcb')}>
      <Menu.Item key="low">100 BTCBs</Menu.Item>
      <Menu.Item key="medium">200 BTCBs</Menu.Item>
      <Menu.Item key="high">500 BTCBs</Menu.Item>
    </Menu>
  );

  const ethMenu = (
    <Menu onClick={e => handleMenuClick(e, 'eth')}>
      <Menu.Item key="low">100 ETHs</Menu.Item>
      <Menu.Item key="medium">200 ETHs</Menu.Item>
      <Menu.Item key="high">500 ETHs</Menu.Item>
    </Menu>
  );

  const ltcMenu = (
    <Menu onClick={e => handleMenuClick(e, 'ltc')}>
      <Menu.Item key="low">100 LTCs</Menu.Item>
      <Menu.Item key="medium">200 LTCs</Menu.Item>
      <Menu.Item key="high">500 LTCs</Menu.Item>
    </Menu>
  );

  const xrpMenu = (
    <Menu onClick={e => handleMenuClick(e, 'xrp')}>
      <Menu.Item key="low">100 XRPs</Menu.Item>
      <Menu.Item key="medium">200 XRPs</Menu.Item>
      <Menu.Item key="high">500 XRPs</Menu.Item>
    </Menu>
  );

  return (
    <MainLayout isHeader={false}>
      <div className="flex just-center align-center">
        <FaucetWrapper className="flex flex-column align-center just-center">
          <p className="header">Venus Binance Smart Chain Faucet</p>
          <Form className="forgot-pwd-form">
            <Form.Item>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: 'Address is required!'
                  }
                ]
              })(
                <Input placeholder="Input your Binance Smart Chain address..." />
              )}
            </Form.Item>
            {isLoading ? (
              <div className="flex flex-column">
                <LoadingSpinner size={60} />
              </div>
            ) : (
              <>
                <Row>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={bnbMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me BNB
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={sxpMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me SXP
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={xvsMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me XVS
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={busdMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me BUSD
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={usdtMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me USDT
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={usdcMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me USDC
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={btcbMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me BTCB
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={ethMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me ETH
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={ltcMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me LTC
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4" className="empty-menu">
                    <ButtonWrapper />
                  </Column>
                  <Column xs="6" sm="4">
                    <ButtonWrapper>
                      <Dropdown overlay={xrpMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">
                          Give Me XRP
                        </Button>
                      </Dropdown>
                    </ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4" className="empty-menu">
                    <ButtonWrapper />
                  </Column>
                </Row>
              </>
            )}
          </Form>
          <div className="flex flex-column align-center just-center bottom">
            <p className="title">How does this work?</p>
            <p className="description">
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_TOKEN_ADDRESS.sxp.address}`}
                target="_blank"
                rel="noreferrer"
              >
                SXP
              </a>
              {`, `}
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_XVS_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
              >
                XVS
              </a>
              {`, `}
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_TOKEN_ADDRESS.busd.address}`}
                target="_blank"
                rel="noreferrer"
              >
                BUSD
              </a>
              {`, `}
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_TOKEN_ADDRESS.usdc.address}`}
                target="_blank"
                rel="noreferrer"
              >
                USDC
              </a>
              {`, `}
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_TOKEN_ADDRESS.usdt.address}`}
                target="_blank"
                rel="noreferrer"
              >
                USDT
              </a>
              {`, `}
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_VAI_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
              >
                VAI
              </a>
              {`, `}
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_TOKEN_ADDRESS.btcb.address}`}
                target="_blank"
                rel="noreferrer"
              >
                BTCB
              </a>
              {`, `}
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_TOKEN_ADDRESS.eth.address}`}
                target="_blank"
                rel="noreferrer"
              >
                ETH
              </a>
              {`, `}
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_TOKEN_ADDRESS.ltc.address}`}
                target="_blank"
                rel="noreferrer"
              >
                LTC
              </a>
              {`, `}
              <a
                href={`${process.env.REACT_APP_BSC_EXPLORER}/address/${constants.CONTRACT_TOKEN_ADDRESS.xrp.address}`}
                target="_blank"
                rel="noreferrer"
              >
                XRP
              </a>
              {` are issued as BEP20 token.`}
            </p>
            <p className="description">
              Click to get detail about{' '}
              <a
                href="https://github.com/binance-chain/BEPs/blob/master/BEP20.md"
                target="_blank"
                rel="noreferrer"
              >
                BEP20
              </a>
            </p>
          </div>
        </FaucetWrapper>
      </div>
    </MainLayout>
  );
}

Faucet.propTypes = {
  form: PropTypes.object.isRequired,
  getFromFaucet: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  const { getFromFaucet } = accountActionCreators;

  return bindActionCreators(
    {
      getFromFaucet
    },
    dispatch
  );
};

export default compose(
  withRouter,
  Form.create({ name: 'faucet-form' }),
  connectAccount(undefined, mapDispatchToProps)
)(Faucet);
