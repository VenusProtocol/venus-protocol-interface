import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose } from 'recompose';
import { Form, Input, Modal, Icon, Collapse } from 'antd';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux';
import { connectAccount, accountActionCreators } from 'core';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { getVoteContract, methods } from 'utilities/ContractService';
import { encodeParameters, getArgs } from 'utilities/common';
import closeImg from 'assets/img/close.png';

const ModalContent = styled.div`
  border-radius: 20px;
  background-color: var(--color-bg-primary);

  .close-btn {
    position: absolute;
    top: 30px;
    right: 23px;
  }

  .header-content {
    width: 100%;
    height: 80px;
    background-color: var(--color-bg-primary);
    font-weight: bold;
    font-size: 20px;
    color: var(--color-text-main);
    border-radius: 20px;
  }

  .max-operations {
    color: var(--color-orange);
    font-size: 20px;
    margin-top: 10px;
  }

  .invalid_msg {
    color: var(--color-orange);
    font-size: 14px;
    margin-top: 10px;
  }

  .ant-collapse-header,
  .ant-collapse-content-box,
  .rc-md-navigation {
    background-color: var(--color-bg-main);
    color: var(--color-text-main) !important;
  }
  .ant-collapse > .ant-collapse-item:last-child,
  .ant-collapse > .ant-collapse-item:last-child > .ant-collapse-header,
  .ant-collapse-item:last-child > .ant-collapse-content {
    border-radius: 0px;
  }

  .ant-collapse,
  .ant-collapse-content,
  .ant-collapse-item,
  .ant-collapse > .ant-collapse-item,
  .rc-md-editor {
    border-color: var(--color-bg-main);
  }

  .proposal_form {
    width: 100%;
    margin-top: 20px;

    .proposal-data-list {
      max-height: 300px;
      overflow: auto;
      padding: 0 20px;
      margin-bottom: 20px;

      .proposal-content {
        width: 100%;
        padding: 0px 20px;
        .input-wrapper {
          input {
            width: 350px;
            border: none;
            height: 55px;
            font-size: 60px;
            color: var(--color-orange);
            text-align: center;
            &:focus {
              outline: none;
            }
          }
        }

        .add-btn-wrapper {
          width: 100%;
          .add-btn {
            height: 40px;
            background-image: linear-gradient(to right, #f2c265, #f7b44f);
            border-radius: 10px;
            .MuiButton-label {
              font-size: 16px;
              font-weight: bold;
              color: var(--color-text-main);
              text-transform: capitalize;
            }
            &:not(:last-child) {
              margin-right: 10px;
            }

            @media only screen and (max-width: 768px) {
              .MuiButton-label {
                font-size: 12px;
              }
            }
          }
        }
      }
    }

    .description-wrapper {
      padding: 0px 20px;
    }
    .btn-wrapper {
      margin-top: 47px;
      margin-bottom: 40px;
      .proposal-btn {
        width: 210px;
        height: 52px;
        background-image: linear-gradient(to right, #f2c265, #f7b44f);
        border-radius: 10px;
        .MuiButton-label {
          font-size: 16px;
          font-weight: bold;
          color: var(--color-text-main);
          text-transform: capitalize;
        }
      }
      .ant-btn[disabled] {
        color: var(--color-text-secondary);
        background-color: rgba(0, 145, 255, 0.05);
        box-shadow: unset;
      }
    }
  }
`;

const mdParser = new MarkdownIt();
const { Panel } = Collapse;

function ProposalModal({
  form,
  address,
  visible,
  maxOperation,
  onCancel,
  getProposals,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { getFieldDecorator } = form;
  const [formData, setFormData] = useState([
    {
      targetAddress: '',
      value: '',
      signature: '',
      callData: []
    }
  ]);
  const [activePanelKey, setActivePanelKey] = useState(['0']);

  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setIsLoading(false);
      setErrorMsg('');
      setDescription('');
      setFormData([
        {
          targetAddress: '',
          value: '',
          signature: '',
          callData: []
        }
      ]);
    }
  }, [visible, form]);

  const handleSubmit = e => {
    e.preventDefault();
    const targetAddresses = [];
    const values = [];
    const signatures = [];
    const callDatas = [];
    if (description.trim().length === 0) {
      setErrorMsg('Description is required');
    } else {
      setErrorMsg('');
    }
    form.validateFields((err, formValues) => {
      if (!err) {
        try {
          for (let i = 0; i < formData.length; i += 1) {
            const callDataValues = [];
            let callDataTypes = [];
            targetAddresses.push(formValues[`targetAddress${i}`]);
            values.push(0); // Web3.utils.toWei(formValues[`value${i}`], 'ether')
            signatures.push(formValues[`signature${i}`]);
            callDataTypes = getArgs(formValues[`signature${i}`]);
            for (let j = 0; j < formData[i].callData.length; j += 1) {
              if (callDataTypes[j].toLowerCase() === 'bool') {
                callDataValues.push(
                  formValues[`calldata_${i}_${j}`].toLowerCase() === 'true'
                );
              } else if (callDataTypes[j].includes('[]')) {
                callDataValues.push(
                  formValues[`calldata_${i}_${j}`].split(',')
                );
              } else {
                callDataValues.push(formValues[`calldata_${i}_${j}`]);
              }
            }
            callDatas.push(encodeParameters(callDataTypes, callDataValues));
          }
        } catch (error) {
          setErrorMsg('Proposal parameters are invalid!');
          return;
        }
        setIsLoading(true);
        const appContract = getVoteContract();
        methods
          .send(
            appContract.methods.propose,
            [targetAddresses, values, signatures, callDatas, description],
            address
          )
          .then(() => {
            setErrorMsg('');
            setIsLoading(false);
            onCancel();
          })
          .catch(() => {
            setErrorMsg('Creating proposal is failed!');
            setIsLoading(false);
          });
      }
    });
  };

  const handleEditorChange = ({ text }) => {
    setDescription(text);
  };

  const handleAdd = (type, index) => {
    form.resetFields();
    if (type === 'next') {
      formData.splice(index + 1, 0, {
        targetAddress: '',
        value: '',
        signature: '',
        callData: []
      });
    } else {
      formData.splice(index, 0, {
        targetAddress: '',
        value: '',
        signature: '',
        callData: []
      });
    }
    setFormData([...JSON.parse(JSON.stringify(formData))]);
    setActivePanelKey(type === 'next' ? index + 1 : index);
  };

  const handleRemove = idx => {
    setFormData([
      ...formData.filter((_f, index) => index < idx),
      ...formData.filter((_f, index) => index > idx)
    ]);
  };

  const handleParseFunc = (funcStr, idx) => {
    if (
      (form.getFieldValue(`signature${idx}`) || '')
        .trim()
        .replace(/^s+|s+$/g, '')
    ) {
      const parsedStr = getArgs(funcStr);
      formData[idx].signature = funcStr;
      formData[idx].callData = [...parsedStr];
      setFormData([...formData]);
    }
  };
  const handleKeyUp = (type, idx, subIdx, v) => {
    if (type === 'targetAddress') {
      formData[idx].targetAddress = v;
    } else if (type === 'value') {
      formData[idx].value = v;
    } else if (type === 'calldata') {
      formData[idx].callData[subIdx] = v;
    }
    setFormData([...formData]);
  };
  return (
    <Modal
      className="connect-modal"
      {...props}
      width={900}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <ModalContent className="flex flex-column align-center just-center">
        <img
          className="close-btn pointer"
          src={closeImg}
          alt="close"
          onClick={onCancel}
        />
        <div className="flex align-center just-center header-content">
          Create Proposal
        </div>
        {maxOperation && (
          <p className="max-operations center">
            You can add {maxOperation} actions as maximum
          </p>
        )}
        <Form onSubmit={handleSubmit} className="proposal_form">
          <div className="proposal-data-list scrollbar">
            <Collapse
              defaultActiveKey={['0']}
              activeKey={activePanelKey}
              onChange={key => setActivePanelKey(key)}
              accordion
            >
              {formData.map((f, index) => (
                <Panel
                  header={
                    index === 0 ? (
                      'Action 1'
                    ) : (
                      <div className="flex align-center just-between">
                        <span>Action {index + 1}</span>
                        <Icon
                          type="close"
                          onClick={() => handleRemove(index)}
                        />
                      </div>
                    )
                  }
                  key={index}
                >
                  <div className="proposal-content">
                    <Form.Item>
                      {getFieldDecorator(`targetAddress${index}`, {
                        rules: [
                          { required: true, message: 'Address is required!' },
                          {
                            whitespace: true,
                            message: 'This field can not empty'
                          }
                        ],
                        initialValue: f.targetAddress
                      })(
                        <Input
                          placeholder="Address"
                          onKeyUp={() =>
                            handleKeyUp(
                              'targetAddress',
                              index,
                              null,
                              form.getFieldValue(`targetAddress${index}`)
                            )
                          }
                        />
                      )}
                    </Form.Item>
                    {/* <Form.Item>
                      {getFieldDecorator(`value${index}`, {
                        rules: [
                          { required: true, message: 'Value is required!' },
                          {
                            whitespace: true,
                            message: 'This field can not empty'
                          }
                        ],
                        initialValue: f.value
                      })(<Input type="number" placeholder="Eth" onKeyUp={() => handleKeyUp('value', index, null, form.getFieldValue(`value${index}`))} />)}
                    </Form.Item> */}
                    <Form.Item>
                      {getFieldDecorator(`signature${index}`, {
                        rules: [
                          { required: true, message: 'Signature is required!' },
                          {
                            whitespace: true,
                            message: 'This field can not empty'
                          }
                        ],
                        initialValue: f.signature
                      })(
                        <Input
                          placeholder="assumeOwnership(address,string,uint256)"
                          onKeyUp={() =>
                            handleParseFunc(
                              form.getFieldValue(`signature${index}`),
                              index
                            )
                          }
                        />
                      )}
                    </Form.Item>
                    {f.callData.map((c, cIdx) => (
                      <Form.Item key={cIdx}>
                        {getFieldDecorator(`calldata_${index}_${cIdx}`, {
                          rules: [
                            {
                              required: true,
                              message: 'Calldata is required!'
                            },
                            {
                              whitespace: true,
                              message: 'This field can not empty'
                            }
                          ],
                          initialValue: c
                        })(
                          <Input
                            placeholder={`${c}(calldata)`}
                            onKeyUp={() =>
                              handleKeyUp(
                                'calldata',
                                index,
                                cIdx,
                                form.getFieldValue(`calldata_${index}_${cIdx}`)
                              )
                            }
                          />
                        )}
                      </Form.Item>
                    ))}
                    {formData.length < +maxOperation && (
                      <div className="flex align-center just-end add-btn-wrapper">
                        {index !== 0 && (
                          <Button
                            className="add-btn"
                            onClick={() => handleAdd('previous', index)}
                          >
                            Add to previous
                          </Button>
                        )}
                        <Button
                          className="add-btn"
                          onClick={() => handleAdd('next', index)}
                        >
                          Add to next
                        </Button>
                      </div>
                    )}
                  </div>
                </Panel>
              ))}
            </Collapse>
          </div>
          <div className="description-wrapper">
            <MdEditor
              value={description}
              style={{ height: '200px' }}
              renderHTML={text => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          </div>
          {errorMsg && <p className="invalid_msg center">{errorMsg}</p>}
          <div className="flex align-center just-center btn-wrapper">
            <Button
              type="submit"
              className="proposal-btn"
              disabled={
                isLoading ||
                formData.length > maxOperation ||
                description.trim().length === 0
              }
            >
              {isLoading && <Icon type="loading" />} Create
            </Button>
          </div>
        </Form>
      </ModalContent>
    </Modal>
  );
}

ProposalModal.propTypes = {
  visible: PropTypes.bool,
  address: PropTypes.string,
  form: PropTypes.object,
  maxOperation: PropTypes.number,
  onCancel: PropTypes.func,
  getProposals: PropTypes.func.isRequired
};

ProposalModal.defaultProps = {
  visible: false,
  address: '',
  form: {},
  maxOperation: 0,
  onCancel: () => {}
};

const mapDispatchToProps = dispatch => {
  const { getProposals } = accountActionCreators;

  return bindActionCreators(
    {
      getProposals
    },
    dispatch
  );
};

export default compose(
  connectAccount(undefined, mapDispatchToProps),
  Form.create({ name: 'proposal_form' })
)(ProposalModal);
