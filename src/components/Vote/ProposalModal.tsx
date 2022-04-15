import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Form, Input, Modal, Icon, Collapse } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { connectAccount } from 'core';
import { PrimaryButton } from 'components';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { encodeParameters, getArgs } from 'utilities/common';
import closeImg from 'assets/img/close.png';
import { uid } from 'react-uid';
import { useGovernorBravoDelegateContract } from '../../clients/contracts/hooks';

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

  .ant-collapse,
  .ant-collapse-content,
  .ant-collapse-item,
  .ant-collapse > .ant-collapse-item,
  .rc-md-editor {
    border-color: var(--color-bg-main);
  }

  .ant-collapse > .ant-collapse-item:last-child,
  .ant-collapse > .ant-collapse-item:last-child > .ant-collapse-header,
  .ant-collapse-item:last-child > .ant-collapse-content {
    border-radius: 0;
  }

  .proposal_form {
    width: 100%;
    margin-top: 20px;

    .btn-wrapper {
      margin-top: 47px;
      margin-bottom: 40px;
    }

    .proposal-data-list {
      max-height: 300px;
      overflow: auto;
      padding: 0 20px;
      margin-bottom: 20px;

      .proposal-content {
        width: 100%;
        padding: 0 20px;
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
            background-color: var(--color-yellow);
            border-radius: 10px;
            span {
              font-size: 16px;
              font-weight: bold;
              color: var(--color-text-main);
              text-transform: capitalize;
            }
            &:not(:last-child) {
              margin-right: 10px;
            }

            @media only screen and (max-width: 768px) {
              span {
                font-size: 12px;
              }
            }
          }
        }
      }
    }

    .description-wrapper {
      padding: 0 20px;
    }
  }
`;

const mdParser = new MarkdownIt();
const { Panel } = Collapse;

interface Props extends FormComponentProps {
  address: string;
  visible: boolean;
  maxOperation: number;
  onCancel: () => void;
}

function ProposalModal({ form, address, visible, maxOperation, onCancel, ...props }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { getFieldDecorator } = form;
  const [formData, setFormData] = useState([
    {
      targetAddress: '',
      value: '',
      signature: '',
      callData: [],
    },
  ]);
  const [activePanelKey, setActivePanelKey] = useState<number | string[]>(['0']);
  const governorBravoContract = useGovernorBravoDelegateContract();

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
          callData: [],
        },
      ]);
    }
  }, [visible, form]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const targetAddresses: string[] = [];

    const values: number[] = [];

    const signatures: string[] = [];

    const callDatas: string[] = [];
    if (description.trim().length === 0) {
      setErrorMsg('Description is required');
    } else {
      setErrorMsg('');
    }

    form.validateFields(async (err: $TSFixMe, formValues: $TSFixMe) => {
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
                callDataValues.push(formValues[`calldata_${i}_${j}`].toLowerCase() === 'true');
              } else if (callDataTypes[j].includes('[]')) {
                callDataValues.push(formValues[`calldata_${i}_${j}`].slice(1, -1).split(','));
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
        try {
          await governorBravoContract.methods
            .propose(targetAddresses, values, signatures, callDatas, description)
            .send({ from: address });
          setErrorMsg('');
          onCancel();
        } catch (error) {
          setErrorMsg('Creating proposal is failed!');
          console.log('create proposal error :>> ', error);
        }
        setIsLoading(false);
      }
    });
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setDescription(text);
  };

  const handleAdd = (type: 'next' | 'previous', index: number) => {
    form.resetFields();
    if (type === 'next') {
      formData.splice(index + 1, 0, {
        targetAddress: '',
        value: '',
        signature: '',
        callData: [],
      });
    } else {
      formData.splice(index, 0, {
        targetAddress: '',
        value: '',
        signature: '',
        callData: [],
      });
    }
    setFormData([...JSON.parse(JSON.stringify(formData))]);
    setActivePanelKey(type === 'next' ? index + 1 : index);
  };

  const handleRemove = (idx: number) => {
    setFormData([
      ...formData.filter((_f, index) => index < idx),
      ...formData.filter((_f, index) => index > idx),
    ]);
  };

  const handleParseFunc = (funcStr: $TSFixMe, idx: number) => {
    if ((form.getFieldValue(`signature${idx}`) || '').trim().replace(/^s+|s+$/g, '')) {
      const parsedStr = getArgs(funcStr);
      formData[idx].signature = funcStr;
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'never[]'.
      formData[idx].callData = [...parsedStr];
      setFormData([...formData]);
    }
  };
  const handleKeyUp = (
    type: 'value' | 'targetAddress' | 'signature' | 'calldata',

    idx: number,

    subIdx: number | null,

    v: string,
  ) => {
    if (type === 'targetAddress') {
      formData[idx].targetAddress = v;
    } else if (type === 'value') {
      formData[idx].value = v;
    } else if (type === 'calldata') {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
      formData[idx].callData[subIdx] = v;
    }
    setFormData([...formData]);
  };
  return (
    <Modal
      className="venus-modal"
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
        <img className="close-btn pointer" src={closeImg} alt="close" onClick={onCancel} />
        <div className="flex align-center just-center header-content">Create Proposal</div>
        {maxOperation && (
          <p className="max-operations center">
            You can add
            {maxOperation} actions as maximum
          </p>
        )}
        <Form onSubmit={handleSubmit} className="proposal_form">
          <div className="proposal-data-list scrollbar">
            <Collapse
              defaultActiveKey={['0']}
              activeKey={activePanelKey}
              // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | string[]' is not assign... Remove this comment to see the full error message
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
                        <span>
                          Action
                          {index + 1}
                        </span>
                        <Icon type="close" onClick={() => handleRemove(index)} />
                      </div>
                    )
                  }
                  key={uid(f)}
                >
                  <div className="proposal-content">
                    <Form.Item>
                      {getFieldDecorator(`targetAddress${index}`, {
                        rules: [
                          { required: true, message: 'Address is required!' },
                          {
                            whitespace: true,
                            message: 'This field can not empty',
                          },
                        ],
                        initialValue: f.targetAddress,
                      })(
                        <Input
                          placeholder="Address"
                          onKeyUp={() =>
                            handleKeyUp(
                              'targetAddress',
                              index,
                              null,
                              form.getFieldValue(`targetAddress${index}`),
                            )
                          }
                        />,
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
                            message: 'This field can not empty',
                          },
                        ],
                        initialValue: f.signature,
                      })(
                        <Input
                          placeholder="assumeOwnership(address,string,uint256)"
                          onKeyUp={() =>
                            handleParseFunc(form.getFieldValue(`signature${index}`), index)
                          }
                        />,
                      )}
                    </Form.Item>
                    {f.callData.map((c, cIdx) => (
                      <Form.Item key={uid(c)}>
                        {getFieldDecorator(`calldata_${index}_${cIdx}`, {
                          rules: [
                            {
                              required: true,
                              message: 'Calldata is required!',
                            },
                            {
                              whitespace: true,
                              message: 'This field can not empty',
                            },
                          ],
                          initialValue: c,
                        })(
                          <Input
                            placeholder={`${c}(calldata)`}
                            onKeyUp={() =>
                              handleKeyUp(
                                'calldata',
                                index,
                                cIdx,
                                form.getFieldValue(`calldata_${index}_${cIdx}`),
                              )
                            }
                          />,
                        )}
                      </Form.Item>
                    ))}
                    {formData.length < +maxOperation && (
                      <div className="flex align-center just-end add-btn-wrapper">
                        {index !== 0 && (
                          <PrimaryButton
                            className="add-btn"
                            onClick={() => handleAdd('previous', index)}
                          >
                            Add to previous
                          </PrimaryButton>
                        )}
                        <PrimaryButton className="add-btn" onClick={() => handleAdd('next', index)}>
                          Add to next
                        </PrimaryButton>
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
            <PrimaryButton
              type="submit"
              className="proposal-btn"
              disabled={
                isLoading || formData.length > maxOperation || description.trim().length === 0
              }
              loading={isLoading}
            >
              Create
            </PrimaryButton>
          </div>
        </Form>
      </ModalContent>
    </Modal>
  );
}

ProposalModal.defaultProps = {
  visible: false,
  address: '',
  maxOperation: 0,
  onCancel: () => {},
};

export default connectAccount()(Form.create({ name: 'proposal_form' })(ProposalModal));
