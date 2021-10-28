import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import JobCardModal from './JobCardModal';

const JobCardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 567px;
  display: flex;
  flex-direction: column;
  background-color: #181d38;
  overflow: hidden;
  padding-top: 29px;
  border-radius: 8px;

  .header {
    text-align: center;
  }

  img {
    width: 50px;
  }

  .card-title {
    margin-top: 30px;
    color: #fff;
    font-size: 24px;
    line-height: 28px;
    padding: 0 24px 24px;
    border-bottom: 1px solid #262b48;
  }

  .content {
    padding: 24px;
  }

  .section-title {
    font-size: 16px;
    line-height: 19px;
    color: #ffffff;
    margin-bottom: 16px;
  }

  ul {
    padding: 0;
    font-size: 14px;
    line-height: 16px;
    color: #a1a1a1;
    li {
      margin-bottom: 12px;
    }
  }

  .responsibilities {
    margin-top: 24px;
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #181d38;
    color: #a1a1a1;
    font-size: 14px;
    line-height: 16px;

    .view-more {
      margin: 24px;
      background: #ebbf6e;
      border-radius: 8px;
      line-height: 36px;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
  }
`;

export default function JobCard({
  icon,
  title,
  generalInfos,
  responsibilities,
  skills
}) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <JobCardWrapper>
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
              <li className="responsibilities-item">{responsibilities[0]}</li>
              <li>...</li>
            </ul>
          </div>
        </div>
        <div className="footer">
          <div className="view-more" onClick={() => setOpenModal(true)}>
            View More
          </div>
        </div>
      </div>
      <JobCardModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
        icon={icon}
        title={title}
        generalInfos={generalInfos}
        responsibilities={responsibilities}
        skills={skills}
      />
    </JobCardWrapper>
  );
}

JobCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  responsibilities: PropTypes.arrayOf(PropTypes.string).isRequired,
  generalInfos: PropTypes.arrayOf(PropTypes.string).isRequired,
  skills: PropTypes.arrayOf(PropTypes.any).isRequired
};
