import React, { useEffect, useState, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { Row, Col, Icon } from 'antd';
import styled from 'styled-components';
import MainLayout from 'containers/Layout/MainLayout';
import JobCard from '../../components/Career/JobCard';
import beImg from '../../assets/img/career-be.png';
import feImg from '../../assets/img/career-fe.png';
import contractImg from '../../assets/img/career-contract.png';

const CareerWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-left: 10%;
  padding-right: 10%;
  .title {
    font-size: 40px;
    line-height: 47px;
    color: #fff;
    margin-top: 39px;
    margin-bottom: 40px;
  }
  .container {
  }
  .job-card-wrapper {
    margin-bottom: 20px;
  }
`;

const jobData = [
  {
    icon: feImg,
    title: 'Frontend Developer - Typescript/Javascript + React',
    excerpt: {
      description: 'You will be responsible for developing the frontend UI for Venus Protocol dApps and related UI, and collaborate with' +
                   'cross functional partners to participate in the full lifecycle of contract development.',
      skills: [
        'Have 3+ years of relevant industry experience.',
        'Are proficient in frontend development.',
        'Are able to learn fast and focus on execution and problem-solving and work autonomously.'
      ]
    },
    generalInfos: [
      'Salary range: Negotiable',
      'Position: Full-time',
      'Location: Remote',
      'Time-zone preference: Any'
    ],
    responsibilities: [
      'Develop the frontend UI for Venus Protocol dApps and related UI',
      'Join the full lifecycle of contract development, including requirement gathering, dev, test, deployment and even monitoring.',
      'Collaborate with cross functional partners on all aspects of product development',
      'Identify and advocate for team-wide areas of improvement and best practices'
    ],
    skills: [
      '3+ years of industry experience in software engineering',
      'Bachelor’s and/or Master’s degree in CS or equivalent experience',

      {
        title: 'Proficient in frontend development, including:',
        items: [
          'best practice and standards in CI / CD',
          'solid experience on Typescript/Javascript and React',
          'familiar with reactive applications on across different browsers/platforms, including mobile'
        ]
      },
      'Knowledge on EVM based blockchain, dApps and DeFi, related work experience is a bonus',
      'Able to learn fast and focus on execution and problem-solving ',
      'Be able to work autonomously, great communication remotely and continuously get self-connected',
      'Independent enough to make important technical decisions on your own.'
    ]
  },
  {
    icon: beImg,
    title: 'Backend Engineer - Typescript / Javascript',
    excerpt: {
      description: 'You will be responsible for Venus Protocol backend infrastructure development,' +
                   'and work with DevOps on system deployment, monitoring and high availability..',
      skills: [
        'Have 3+ years of relevant industry experience.',
        'Have solid experience with Typescript/Javascript programming (especially for backend), DBMS.',
        'Are able to build and maintain a product at scale, experience in a cloud based production environment.'
      ]
    },
    generalInfos: [
      'Salary range: Negotiable',
      'Position: Full-time',
      'Location: Remote',
      'Time-zone preference: Any'
    ],
    responsibilities: [
      'Develop the backend infrastructure and services to support Venus Protocol UI and queries',
      'Join the full lifecycle of contract development, including requirement gathering, dev, test, and deployment',
      'work with DevOps on system deployment, monitoring and high availability',
      'Collaborate with cross functional partners on all aspects of product development',
      'Identify and advocate for team-wide areas of improvement and best practices'
    ],
    skills: [
      '3+ years of industry experience in software engineering',
      'Bachelor’s and/or Master’s degree in Computer Science or equivalent experience',
      'Solid experience with Typescript/Javascript programing, especially for backend',
      'Experience working with database management systems (SQL is a requirement, NoSQL is optional but nice to have)',
      'Knowledge with EVM based blockchain, Smart Contract and DeFi, related work experience is a bonus',
      'Able to learn fast and focus on execution and problem-solving ',
      'Be able to work autonomously, great communication remotely and continuously get self-connected',
      'Ability to build and maintain a product at scale, experience in a cloud based production environment.',
    ],
    goodToHave: [
      'Experience with NoSQL databases',
      'Experience with WebAssembly',
      'Experience with IPFS'
    ]
  },
  {
    icon: contractImg,
    title: 'Smart Contract Developer',
    excerpt: {
      description: 'You will collaborate with cross functional partners and participate in the full lifecycle'
                 + 'of the smart contract development and build corresponding toolings and infrastructure for Venus Protocol.',
      skills: [
        'Have 3+ years of relevant industry experience.',
        'Are proficient with EVM based smart contract development.',
        'Are able to learn fast and focus on execution and problem-solving and work autonomously.'
      ]
    },
    generalInfos: [
      'Salary range: Negotiable',
      'Position: Full-time',
      'Location: Remote',
      'Time-zone preference: Any'
    ],
    responsibilities: [
      'Build smart contracts and corresponding toolings and infrastructure for Venus Protocol',
      'Join the full lifecycle of contract development, including requirement gathering, dev, test, deployment and even monitoring.',
      'Collaborate with cross functional partners on all aspects of product development',
      'Identify and advocate for team-wide areas of improvement and best practices'
    ],
    skills: [
      '3+ years of industry experience in software engineering',
      'Bachelor’s and/or Master’s degree in CS or equivalent experience',
      {
        title:
          'Proficient or familiar with EVM based smart contract development, including:',
        items: [
          'best practice and standards in CI / CD',
          'good understanding about security concerns together with efficiency and performance',
          'aware of the economical implication and able to feedback ideas or raise alerts'
        ]
      },
      'Possesses exceptional judgment, problem-solving skills, and an analytical mindset',
      'Able to learn fast and focus on execution and problem-solving ',
      'Able to work autonomously, great communication remotely and continuously get self-connected',
      'Independent enough to make important technical decisions on your own.'
    ]
  }
];

export default function Career() {
  return (
    <MainLayout>
      <CareerWrapper>
        <div className="title">Career</div>
        <div className="container">
          <Row gutter={24}>
            {jobData.map((data, i) => (
              <Col className="job-card-wrapper" key={i} lg={{ span: Math.floor(24 / jobData.length) }}>
                <JobCard
                  key={i}
                  icon={data.icon}
                  title={data.title}
                  generalInfos={data.generalInfos}
                  responsibilities={data.responsibilities}
                  skills={data.skills}
                  excerpt={data.excerpt}
                />
              </Col>
            ))}
          </Row>
        </div>
      </CareerWrapper>
    </MainLayout>
  );
}
