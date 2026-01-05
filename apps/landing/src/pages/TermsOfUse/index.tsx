import { Legal } from 'components/Legal';

const LAST_UPDATED_AT = 'September 18, 2025';

export const TermsOfUse: React.FC = () => (
  <Legal title="Terms of Use" lastUpdatedAt={new Date(LAST_UPDATED_AT)}>
    <h2 className="m-0">1. Acceptance of Terms</h2>

    <p className="m-0">
      These Terms of Use ("Terms") govern your access to and use of the Venus Protocol platform and
      all related services (collectively, the "Platform"). By accessing or using the Platform
      through https://venus.io/, any subdomains, mobile applications, APIs, or any other means
      provided by Venus Protocol, you acknowledge that you have read, understood, and agree to be
      bound by these Terms in their entirety. If you do not agree to these Terms, you are prohibited
      from accessing or using the Platform and must discontinue use immediately.
    </p>

    <h2 className="m-0">2. Description of the Platform</h2>

    <p className="m-0">
      Venus Protocol operates as a decentralized, non-custodial, algorithmic money market and
      synthetic stablecoin protocol deployed on public blockchain infrastructure. The Platform
      enables users to engage with lending, borrowing, minting, and other decentralized finance
      ("DeFi") activities via smart contracts.
    </p>

    <h2 className="m-0">3. Eligibility and Jurisdiction</h2>

    <p className="m-0">
      You are solely responsible for understanding and complying with any and all laws, rules, and
      regulations that may apply to you in connection with your use of the Platform. You may not
      access or use the Platform if you are a resident, citizen, or agent of, or incorporated in,
      any jurisdiction or territory where usage would be contrary to applicable laws or regulations,
      or prohibited for any reason.
    </p>

    <h2 className="m-0">4. User Representation and Warranties</h2>

    <p className="m-0">By using the Platform, you represent and warrant that:</p>

    <ul>
      <li>You are of legal age and capacity to enter into these Terms;</li>

      <li>Your use of the Platform is not prohibited by applicable laws or regulations;</li>

      <li>
        You have independently assessed and accepted all risks associated with your use of the
        Platform.
      </li>
    </ul>

    <h2 className="m-0">5. Anti-Money Laundering and Sanctions Compliance</h2>

    <h3 className="m-0">5.1 Prohibited Persons</h3>

    <p className="m-0">
      You represent that you are not: (a) subject to economic sanctions administered by OFAC, EU,
      UN, or other applicable authorities; (b) located in, or a resident of, any sanctioned
      jurisdiction; or (c) otherwise prohibited from accessing the Platform under applicable law.
    </p>

    <h3 className="m-0">5.2 Source of Funds</h3>

    <p className="m-0">
      You represent that any digital assets used on the Platform are obtained through lawful means
      and are not derived from illegal activities.
    </p>

    <h3 className="m-0">5.3 Monitoring</h3>

    <p className="m-0">
      Venus Protocol reserves the right to implement compliance measures, including transaction
      monitoring and blocking access from certain jurisdictions or addresses.
    </p>

    <h2 className="m-0">6. Prohibited Uses</h2>

    <p className="m-0">
      You may not use the Platform to engage in activities that are unlawful, fraudulent,
      threatening, or otherwise violate these Terms or the rights of others, or to circumvent
      sanctions, conduct money laundering, or any prohibited transaction under applicable law.
    </p>

    <h2 className="m-0">7. No Financial, Legal, or Tax Advice</h2>

    <p className="m-0">
      Nothing on the Platform constitutes, or is intended to constitute, financial, investment,
      legal, or tax advice. Venus Protocol does not act as your advisor or fiduciary. You are solely
      responsible for evaluating the merits and risks of any transaction and should consult your own
      professional advisors as appropriate.
    </p>

    <h2 className="m-0">8. Non-Custodial and Autonomous Nature</h2>

    <p className="m-0">
      Venus Protocol is a non-custodial, autonomous platform. Your interactions are directly with
      deployed smart contracts; neither Venus Protocol nor its developers, affiliates, or any
      associated party will ever take possession or control of your assets. You are solely
      responsible for safeguarding your wallets, private keys, and credentials. Venus Protocol
      cannot restore or recover lost assets or access.
    </p>

    <h2 className="m-0">9. Fees and Tax</h2>

    <h3 className="m-0">9.1 Non-Intermediary Status for Blockchain Transactions</h3>

    <p className="m-0">
      Venus Protocol does not serve as an intermediary, broker, agent, or custodian for blockchain
      transactions. Given the decentralized and non-custodial architecture of the underlying
      technology, we do not act as intermediaries, agents, advisors, or custodians, and we do not
      maintain any fiduciary relationship or obligation to you concerning any decisions, actions, or
      transactions you execute when utilizing the Platform. This includes, without limitation, any
      transactions you conduct with or through the Venus Protocol or any other decentralized
      protocol, application, or service accessible through the Platform. You bear sole
      responsibility for ensuring the accuracy, legality, and appropriateness of your interactions
      with any such third-party services, decentralized protocols, or smart contracts. We expressly
      disclaim any responsibility for the execution, settlement, or outcome of any transaction you
      initiate.
    </p>

    <h3 className="m-0">9.2 Limited Transaction Information</h3>

    <p className="m-0">
      You acknowledge that Venus Protocol does not possess information regarding all Venus Protocol
      transactions beyond what is publicly available or obtainable via the blockchain. However, we
      may collect certain information regarding users of the Platform in accordance with our Privacy
      Notice.
    </p>

    <h3 className="m-0">9.3 Blockchain Network Fees and Associated Costs</h3>

    <p className="m-0">
      Transactions executed via blockchain networks may incur various fees imposed by third parties
      for access to and utilization of such permissionless networks. These fees may include, without
      limitation:
    </p>

    <ul>
      <li>
        <span>Network Fees:</span> Gas fees and other network transaction fees paid to validators,
        block producers, or similar network participants for the processing, validation, and
        confirmation of transactions on the relevant blockchain network;
      </li>

      <li>
        <span>Protocol Fees:</span> Fees imposed by decentralized protocols, applications, or
        third-party services that you access through the Platform, including but not limited to swap
        fees, liquidity provider fees, borrowing fees, or fees associated with fiat on-ramp and
        off-ramp services;
      </li>

      <li>
        <span>Third-Party Service Fees:</span> Fees determined, levied, and collected solely by
        relevant third parties where a counterparty is involved.
      </li>
    </ul>

    <p className="m-0">
      You acknowledge and agree that certain blockchain network fees may be non-refundable under all
      circumstances, including but not limited to instances where a transaction is reverted, fails
      to execute, or is otherwise unsuccessful. You are solely responsible for understanding and
      bearing all costs, fees, and charges associated with your use of the Platform, including those
      imposed by decentralized protocols, smart contracts, or third-party service providers. We make
      no representations, warranties, or guarantees regarding the availability, accuracy,
      functionality, or suitability of any third-party services, fee structures, or transactions.
    </p>

    <h3 className="m-0">9.4 Tax Obligations and Responsibilities</h3>

    <p className="m-0">
      Transactions executed via blockchain networks may incur various fees imposed by third parties
      for access to and utilization of such permissionless networks. These fees may include, without
      limitation:
    </p>

    <ul>
      <li>
        <span>Network Fees:</span> Gas fees and other network transaction fees paid to validators,
        block producers, or similar network participants for the processing, validation, and
        confirmation of transactions on the relevant blockchain network;
      </li>

      <li>
        <span>Protocol Fees:</span> Fees imposed by decentralized protocols, applications, or
        third-party services that you access through the Platform, including but not limited to swap
        fees, liquidity provider fees, borrowing fees, or fees associated with fiat on-ramp and
        off-ramp services;
      </li>

      <li>
        <span>Third-Party Service Fees:</span> Fees determined, levied, and collected solely by
        relevant third parties where a counterparty is involved.
      </li>
    </ul>

    <p className="m-0">
      You acknowledge and agree that certain blockchain network fees may be non-refundable under all
      circumstances, including but not limited to instances where a transaction is reverted, fails
      to execute, or is otherwise unsuccessful. You are solely responsible for understanding and
      bearing all costs, fees, and charges associated with your use of the Platform, including those
      imposed by decentralized protocols, smart contracts, or third-party service providers. We make
      no representations, warranties, or guarantees regarding the availability, accuracy,
      functionality, or suitability of any third-party services, fee structures, or transactions.
    </p>

    <h2 className="m-0">10. Technology and Protocol Risks</h2>

    <p className="m-0">
      You acknowledge and accept substantial risks inherent in decentralized protocols and smart
      contracts, including but not limited to:
    </p>

    <h3 className="m-0">10.1 Smart Contract Risks</h3>

    <p className="m-0">
      Software vulnerabilities, exploits, bugs, unexpected behaviors, and potential economic attacks
      on protocol mechanisms.
    </p>

    <h3 className="m-0">10.2 Infrastructure Risks</h3>

    <p className="m-0">
      Blockchain network congestion, hard forks, validator failures, and potential network splits or
      reorganizations.
    </p>

    <h3 className="m-0">10.3 Oracle and Price Feed Risks</h3>

    <p className="m-0">
      Reliance on external price oracles that may be manipulated, delayed, or provide inaccurate
      data, potentially affecting liquidations and protocol operations.
    </p>

    <h3 className="m-0">10.4 Governance Risks</h3>

    <p className="m-0">
      Changes to protocol parameters through governance mechanisms that may adversely affect your
      positions or the protocol's operation.
    </p>

    <h3 className="m-0">10.5 Interoperability Risks</h3>

    <p className="m-0">
      Risks arising from interactions with other protocols, bridges, or cross-chain mechanisms.
    </p>

    <p className="font-semibold text-white m-0">
      The Platform is provided "AS IS" and "AS AVAILABLE," without any express or implied warranties
      of merchantability, fitness for a particular purpose, or non-infringement.
    </p>

    <h2 className="m-0">11. Market, Volatility, and Liquidation Risks</h2>

    <h3 className="m-0">11.1 Market Volatility</h3>

    <p className="m-0">
      Digital assets and stablecoins are inherently volatile and may experience rapid and
      substantial price fluctuations.
    </p>

    <h3 className="m-0">11.2 Liquidation Mechanics</h3>

    <p className="m-0">
      You understand that positions may be liquidated automatically when collateral ratios fall
      below required thresholds, potentially resulting in partial or total loss of collateral.
    </p>

    <h3 className="m-0">11.3 Slippage and MEV</h3>

    <p className="m-0">
      Transactions may be subject to slippage, front-running, or maximum extractable value (MEV)
      extraction by third parties.
    </p>

    <h3 className="m-0">11.4 Stablecoin Risks</h3>

    <p className="m-0">
      Synthetic stablecoins may depeg from their intended value due to market conditions, protocol
      mechanics, or external factors.
    </p>

    <h3 className="m-0">11.5 Impermanent Loss</h3>

    <p className="m-0">
      Certain activities may expose you to impermanent loss or other opportunity costs.
    </p>

    <p className="m-0">
      You are solely responsible for monitoring your positions, understanding protocol mechanics,
      and managing risk exposure at all times.
    </p>

    <h2 className="m-0">12. Regulatory Uncertainty</h2>

    <p className="m-0">
      The legal and regulatory environment for decentralized protocols and digital assets is
      unsettled and subject to significant change. Applicable laws, regulations, or enforcement
      actions may affect your access to, or use of, the Platform. Venus Protocol does not guarantee
      the legality or regulatory status of the Platform in any jurisdiction and disclaims all
      liability for your compliance with relevant laws and regulations.
    </p>

    <h2 className="m-0">13. No Guarantee of Platform Continuity</h2>

    <p className="m-0">
      Venus Protocol may upgrade, modify, suspend, or discontinue any aspect of the Platform at any
      time, with or without notice, and disclaims any liability for the unavailability or
      modification of the Platform.
    </p>

    <h2 className="m-0">14. Third-Party Services and Integrations</h2>

    <p className="m-0">
      The Platform may reference, integrate, or provide access to third-party protocols, services,
      or content ("Third-Party Services"). Venus Protocol does not endorse, control, or assume
      responsibility for any Third-Party Services, and you access or use them entirely at your own
      risk.
    </p>

    <h2 className="m-0">15. DAO and Governance</h2>

    <p className="m-0">
      Some aspects of the Platform may be governed or influenced by decentralized autonomous
      organization ("DAO") mechanisms and on-chain community proposals. Outcomes of protocol
      governance or DAO proposals are not controlled by Venus Protocol and are implemented
      automatically via smart contracts.
    </p>

    <h2 className="m-0">16. Privacy and Data Protection</h2>

    <h3 className="m-0">16.1 Data Collection</h3>

    <p className="m-0">
      While Venus Protocol operates as a decentralized protocol, certain information may be
      collected through interfaces, analytics, or third-party services. Our{' '}
      <a href="/privacy-policy">Privacy Notice</a>, incorporated by reference, governs such data
      collection and use.
    </p>

    <h3 className="m-0">16.2 Blockchain Transparency</h3>

    <p className="m-0">
      You acknowledge that blockchain transactions are publicly visible and permanent. Venus
      Protocol cannot control or modify blockchain data once recorded.
    </p>

    <h3 className="m-0">16.3 Compliance</h3>

    <p className="m-0">
      Users in jurisdictions with specific data protection laws (for example, GDPR, CCPA, etc.)
      should review our Privacy Notice for applicable rights and procedures.
    </p>

    <h2 className="m-0">17. Intellectual Property</h2>

    <p className="m-0">
      All Platform content, trademarks, logos, and materials are the property of Venus Protocol or
      their respective owners, and are protected by applicable intellectual property laws. You may
      not use any proprietary material without express authorization, except as necessary for
      legitimate use of the Platform.
    </p>

    <h2 className="m-0">18. Electronic Communications</h2>

    <p className="m-0">
      By using the Platform, you consent to receive communications electronically. You agree that
      all agreements, notices, disclosures, and other communications provided electronically satisfy
      any legal requirement that such communications be in writing.
    </p>

    <h2 className="m-0">19. Updates and Amendments</h2>

    <p className="m-0">
      Venus Protocol may update or amend these Terms at any time. Continued use of the Platform
      after changes become effective constitutes your acceptance of the revised Terms.
    </p>

    <h2 className="m-0">20. Limitation of Liability</h2>

    <p className="m-0">
      To the maximum extent permitted by law, in no event will Venus Protocol or its affiliates,
      developers, contributors, or operators be liable for any direct, indirect, incidental,
      special, exemplary, or consequential damages—arising from or related to your use or inability
      to use the Platform—including but not limited to lost profits, digital asset losses, data
      loss, or technical malfunctions—even if Venus Protocol has been advised of the possibility of
      such damages.
    </p>

    <h2 className="m-0">21. Indemnification</h2>

    <p className="m-0">
      You agree to indemnify, defend, and hold harmless Venus Protocol, its affiliates, developers,
      contributors, or operators from and against any and all claims, liabilities, damages, losses,
      costs, expenses, or fees arising from your violation of these Terms or your use of the
      Platform.
    </p>

    <h2 className="m-0">22. Force Majeure</h2>

    <p className="m-0">
      Venus Protocol shall not be liable for any failure or delay in performance due to
      circumstances beyond its reasonable control, including but not limited to blockchain network
      failures, regulatory actions, natural disasters, cyberattacks, or other force majeure events.
    </p>

    <h2 className="m-0">23. Dispute Resolution and Arbitration</h2>

    <h3 className="m-0">23.1 Governing Law</h3>

    <p className="m-0">
      These Terms shall be governed by and construed in accordance with the laws of Hong Kong,
      without regard to its conflict of law principles.
    </p>

    <h3 className="m-0">23.2 Mandatory Arbitration</h3>

    <p className="m-0">
      Subject to applicable law requirements or where you are provided with alternative legal
      choices, you and Venus Protocol agree that any dispute, claim, or controversy arising out of
      or relating to these Terms or your use of the Platform ("Dispute") shall be resolved through
      final and binding individual arbitration (not class arbitration) administered by the Hong Kong
      International Arbitration Centre ("HKIAC") under the HKIAC Administered Arbitration Rules then
      in effect, which are incorporated herein by reference.
    </p>

    <h3 className="m-0">23.3 Arbitration Venue</h3>

    <p className="m-0">Hong Kong shall serve as the seat of arbitration proceedings.</p>

    <h3 className="m-0">23.4 Arbitrator Selection</h3>

    <p className="m-0">
      The arbitral tribunal shall comprise one (1) arbitrator selected in accordance with the
      applicable HKIAC Administered Arbitration Rules.
    </p>

    <h3 className="m-0">23.5 Proceedings Language</h3>

    <p className="m-0">All arbitration proceedings shall be conducted in the English language.</p>

    <h3 className="m-0">23.6 Arbitrator Authority</h3>

    <p className="m-0">
      You and Venus Protocol acknowledge that the arbitrator shall possess exclusive authority to
      determine their own jurisdiction, including but not limited to any challenges regarding the
      existence, scope, or validity of this arbitration agreement, or the arbitrability of any
      Dispute.
    </p>

    <h3 className="m-0">23.7 Survival of Arbitration Provisions</h3>

    <p className="m-0">
      These arbitration provisions shall remain in effect following termination of these Terms.
    </p>

    <h3 className="m-0">23.8 Time Limitations for Claims</h3>

    <p className="m-0">
      Any arbitration proceeding against Venus Protocol must be initiated by filing and serving a
      Notice of Arbitration pursuant to HKIAC procedures within one (1) year from the date you first
      discovered or reasonably should have discovered the alleged act, omission, or default giving
      rise to your claim ("Filing Deadline"). This Filing Deadline encompasses any dispute
      resolution period referenced elsewhere in these Terms. Failure to file and serve a Notice of
      Arbitration on Venus Protocol within this Filing Deadline shall result in forfeiture of all
      rights to pursue such claim. Where the Filing Deadline conflicts with applicable law, you must
      bring any claim against Venus Protocol within the shortest time period permitted by such
      applicable law. Notice of Arbitration may be served on Venus Protocol in accordance with
      applicable laws and service rules.
    </p>

    <h3 className="m-0">23.9 Notice Requirements</h3>

    <p className="m-0">
      Should Venus Protocol initiate arbitration proceedings against you, notice will be provided to
      the email address or mailing address you have furnished to us. You acknowledge that any
      communication sent to such email or mailing address shall constitute effective notice for all
      purposes, including determinations regarding adequacy of service. You bear responsibility for
      maintaining current and accurate contact information with Venus Protocol.
    </p>

    <h2 className="m-0">24. Severability</h2>

    <p className="m-0">
      If any provision of these Terms is held to be invalid or unenforceable, such provision will be
      severed and the remainder of the Terms will remain in full force and effect.
    </p>

    <h2 className="m-0">25. Survival</h2>

    <p className="m-0">
      The following sections shall survive termination of these Terms: Sections 7-13, 16, 19-20,
      22-23, and any other provisions that by their nature should survive termination.
    </p>

    <h2 className="m-0">26. Entire Agreement</h2>

    <p className="m-0">
      These Terms constitute the entire agreement between you and Venus Protocol regarding your use
      of the Platform, superseding any prior agreements or understandings.
    </p>

    <h2 className="m-0">27. Contact Information</h2>

    <p className="m-0">
      If you have any questions about these Terms, please contact us at{' '}
      <a href="mailto:contact@venus.io">contact@venus.io</a>.
    </p>
  </Legal>
);
