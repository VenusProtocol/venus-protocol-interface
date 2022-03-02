import React from 'react';
import { Input, Form, Dropdown, Menu } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import MainLayout from 'containers/Layout/MainLayout';
import { Button } from 'components';
import LoadingSpinner from 'components/Basic/LoadingSpinner';
import * as constants from 'utilities/constants';
import { Row, Column } from 'components/Basic/Style';
import { IRequestFaucetFundsInput } from 'clients/api';
import { BASE_BSC_SCAN_URL } from '../../config';
import { getVaiTokenAddress } from '../../utilities/addressHelpers';
import * as Styles from './styles';

export interface IFaucetProps extends FormComponentProps {
  isRequestFaucetFundsLoading: boolean;
  requestFaucetFunds: (params: IRequestFaucetFundsInput) => void;
}

const Faucet: React.FC<IFaucetProps> = ({
  requestFaucetFunds,
  isRequestFaucetFundsLoading,
  form,
}) => {
  const { getFieldDecorator } = form;

  const handleMenuClick = (e: $TSFixMe, symbol: $TSFixMe) => {
    form.validateFields((err: $TSFixMe, values: $TSFixMe) => {
      if (!err) {
        requestFaucetFunds({
          address: values.address,
          asset: symbol,
          amountType: e.key,
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
        <Styles.FaucetWrapper className="flex flex-column align-center just-center">
          <p className="header">Venus Binance Smart Chain Faucet</p>
          <Form className="forgot-pwd-form">
            <Form.Item>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: 'Address is required!',
                  },
                ],
              })(<Input placeholder="Input your Binance Smart Chain address..." />)}
            </Form.Item>
            {isRequestFaucetFundsLoading ? (
              <div className="flex flex-column">
                <LoadingSpinner size={60} />
              </div>
            ) : (
              <>
                <Row>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={bnbMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me BNB</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={sxpMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me SXP</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={xvsMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me XVS</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={busdMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me BUSD</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={usdtMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me USDT</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={usdcMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me USDC</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={btcbMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me BTCB</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={ethMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me ETH</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={ltcMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me LTC</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4" className="empty-menu">
                    <Styles.ButtonWrapper />
                  </Column>
                  <Column xs="6" sm="4">
                    <Styles.ButtonWrapper>
                      <Dropdown overlay={xrpMenu} placement="bottomCenter">
                        <Button className="fill-btn next-btn button">Give Me XRP</Button>
                      </Dropdown>
                    </Styles.ButtonWrapper>
                  </Column>
                  <Column xs="6" sm="4" className="empty-menu">
                    <Styles.ButtonWrapper />
                  </Column>
                </Row>
              </>
            )}
          </Form>
          <div className="flex flex-column align-center just-center bottom">
            <p className="title">How does this work?</p>
            <p className="description">
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${constants.CONTRACT_TOKEN_ADDRESS.sxp.address}`}
                target="_blank"
                rel="noreferrer"
              >
                SXP
              </a>
              {', '}
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${constants.CONTRACT_XVS_TOKEN_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
              >
                XVS
              </a>
              {', '}
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${constants.CONTRACT_TOKEN_ADDRESS.busd.address}`}
                target="_blank"
                rel="noreferrer"
              >
                BUSD
              </a>
              {', '}
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${constants.CONTRACT_TOKEN_ADDRESS.usdc.address}`}
                target="_blank"
                rel="noreferrer"
              >
                USDC
              </a>
              {', '}
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${constants.CONTRACT_TOKEN_ADDRESS.usdt.address}`}
                target="_blank"
                rel="noreferrer"
              >
                USDT
              </a>
              {', '}
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${getVaiTokenAddress()}`}
                target="_blank"
                rel="noreferrer"
              >
                VAI
              </a>
              {', '}
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${constants.CONTRACT_TOKEN_ADDRESS.btcb.address}`}
                target="_blank"
                rel="noreferrer"
              >
                BTCB
              </a>
              {', '}
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${constants.CONTRACT_TOKEN_ADDRESS.eth.address}`}
                target="_blank"
                rel="noreferrer"
              >
                ETH
              </a>
              {', '}
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${constants.CONTRACT_TOKEN_ADDRESS.ltc.address}`}
                target="_blank"
                rel="noreferrer"
              >
                LTC
              </a>
              {', '}
              <a
                href={`${BASE_BSC_SCAN_URL}/address/${constants.CONTRACT_TOKEN_ADDRESS.xrp.address}`}
                target="_blank"
                rel="noreferrer"
              >
                XRP
              </a>
              {' are issued as BEP20 token.'}
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
        </Styles.FaucetWrapper>
      </div>
    </MainLayout>
  );
};

export default Form.create<IFaucetProps>({ name: 'faucet-form' })(Faucet);
