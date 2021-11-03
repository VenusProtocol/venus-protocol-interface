import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import closeImg from 'assets/img/close.png';

const JobCardModalWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 598px;
  display: flex;
  flex-direction: column;
  background-color: #181d38;
  overflow-y: scroll;
  padding-top: 56px;
  padding-left: 24px;
  border-radius: 16px;

  .close-btn {
    position: absolute;
    width: 16px;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }

  img {
    width: 50px;
  }

  .card-title {
    margin-top: 21px;
    margin-bottom: 24px;
    color: #fff;
    font-size: 24px;
    line-height: 28px;
  }

  .section-title {
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    margin-bottom: 16px;
  }

  ul {
    padding-left: 12px;
    font-size: 14px;
    line-height: 16px;
    color: #a1a1a1;
    li {
      margin-bottom: 12px;
    }
  }

  .skill-subitem {
    margin: 6px 0;
  }

  .responsibilities {
    margin-top: 24px;
  }

  .footer {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .apply-button {
    min-width: 300px;
    background: #ebbf6e;
    border-radius: 8px;
    line-height: 16px;
    font-size: 14px;
    text-align: center;
    color: #fff;
    cursor: pointer;
    padding: 9px 16px;
  }
`;

export default function JobCardModal({
  icon,
  title,
  generalInfos,
  responsibilities,
  skills,
  visible,
  onClose,
  onClickApplyButton
}) {
  return (
    <Modal
      className="connect-modal"
      width={700}
      visible={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      maskClosable
      centered
    >
      <JobCardModalWrapper>
        <img
          className="close-btn"
          src={closeImg}
          alt="close"
          onClick={onClose}
        />
        <div className="container">
          <div className="header">
            <img className="icon" src={icon} alt="noop" />
            <div className="card-title">{title}</div>
          </div>
          <div className="content">
            <div className="general">
              <div className="section-title">General Infomations</div>
              <ul className="general-infos">
                {generalInfos.map((info, i) => {
                  return (
                    <li key={i} className="general-infos-item">
                      {info}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="responsibilities">
              <div className="section-title">Your Responsibilities</div>
              <ul className="responsibilities-items">
                {responsibilities.map((res, i) => {
                  return (
                    <li key={i} className="responsibilities-item">
                      {res}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="skills">
              <div className="section-title">Skills & Qualifications</div>
              <ul className="skills-items">
                {skills.map((skill, i) => {
                  return typeof skill === 'string' ? (
                    <li key={i} className="skill-item">
                      {skill}
                    </li>
                  ) : (
                    <li key={i} className="skill-item">
                      {skill.title}
                      <ul>
                        {skill.items.map((item, j) => {
                          return (
                            <li
                              key={`${i}${j}`}
                              className="skill-item skill-subitem"
                            >
                              {item}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="footer" onClick={() => onClickApplyButton()}>
              <div className="apply-button">Apply for this job</div>
            </div>
          </div>
        </div>
      </JobCardModalWrapper>
    </Modal>
  );
}

JobCardModal.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  responsibilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  generalInfos: PropTypes.arrayOf(PropTypes.string).isRequired,
  skills: PropTypes.arrayOf(PropTypes.any).isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClickApplyButton: PropTypes.func.isRequired
};
