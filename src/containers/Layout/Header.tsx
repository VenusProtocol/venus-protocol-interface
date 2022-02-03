import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'styl... Remove this comment to see the full error message
import styled from 'styled-components';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reco... Remove this comment to see the full error message
import { compose } from 'recompose';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import { withRouter } from 'react-router-dom';
// import { Input } from 'antd';
import arrowRightImg from 'assets/img/arrow-right.png';

const HeaderWrapper = styled.div`
  height: 50px;
  margin: 20px 15px 0;
  .title-wrapper {
    img {
      transform: rotate(180deg);
      margin-right: 18px;
    }
    p {
      font-size: 20px;
      font-weight: 900;
      color: var(--color-text-main);
    }
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;


function Header({ title, history }: $TSFixMe) {
  const handleRoute = () => {
    if (title === 'Details') {
      history.go(-1);
    }
    if (title === 'Overview') {
      history.push('/vote');
    }
    if (title === 'Market') {
      history.push('/market');
    }
  };

  return (
    <HeaderWrapper className="flex align-center just-between">
      <div
        className="flex align-center pointer title-wrapper"
        onClick={handleRoute}
      >
        {(title === 'Overview' ||
          title === 'Details' ||
          title === 'Market') && <img src={arrowRightImg} alt="arrow-left" />}
        <p
          className={`${
            title === 'Overview' || title === 'Details' ? 'highlight' : ''
          }`}
        >
          {title}
        </p>
      </div>
    </HeaderWrapper>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  history: PropTypes.object
};

Header.defaultProps = {
  title: '',
  history: {}
};
export default compose(withRouter)(Header);
