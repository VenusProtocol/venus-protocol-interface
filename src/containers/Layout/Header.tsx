import React from 'react';
import styled from 'styled-components';

import { RouteComponentProps, withRouter } from 'react-router-dom';
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

interface Props extends RouteComponentProps {
  title: string;
}

function Header({ title, history }: Props) {
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
      <div className="flex align-center pointer title-wrapper" onClick={handleRoute}>
        {(title === 'Overview' || title === 'Details' || title === 'Market') && (
          <img src={arrowRightImg} alt="arrow-left" />
        )}
        <p className={`${title === 'Overview' || title === 'Details' ? 'highlight' : ''}`}>
          {title}
        </p>
      </div>
    </HeaderWrapper>
  );
}

Header.defaultProps = {
  title: '',
};

export default withRouter(Header);
