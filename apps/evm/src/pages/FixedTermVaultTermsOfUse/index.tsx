import { Legal } from 'containers/Legal';
import { AlphabeticalList } from './AlphabeticalList';

const LAST_UPDATED_AT = 'June 3, 2026';

const FixedTermVaultTermsOfUse: React.FC = () => (
  <Legal title="Venus Fixed-Term Vault Terms of Use" lastUpdatedAt={new Date(LAST_UPDATED_AT)}>
    <p className="m-0">
      These Terms of Use (the <strong>&quot;Terms&quot;</strong>) govern your access to and use of
      any Venus Fixed-Term Vault (the <strong>&quot;Vault&quot;</strong>). By supplying assets to a
      Vault, you agree to these Terms. If you do not agree, do not supply assets.
    </p>

    <h2 className="m-0">1. Definitions</h2>

    <p className="m-0">
      In these Terms, the following capitalised terms have the meanings set out below.
    </p>

    <AlphabeticalList>
      <li>
        <strong>&quot;Vault&quot;</strong> means any Venus Fixed-Term Vault smart contract.
      </li>

      <li>
        <strong>&quot;Vault Participant&quot;</strong> means any person who supplies assets to a
        Vault.
      </li>

      <li>
        <strong>&quot;Counterparty&quot;</strong> means the institutional counterparty designated to
        interact with a Vault under its parameters.
      </li>

      <li>
        <strong>&quot;Receipt Token&quot;</strong> means the on-chain token issued by the Vault on
        supply, representing the Vault Participant&apos;s pro-rata participation share.
      </li>

      <li>
        <strong>&quot;Restricted Jurisdiction&quot;</strong> means the United States of America
        (including its territories and possessions); the United Kingdom; Canada; the People&apos;s
        Republic of China (excluding the Hong Kong and Macau Special Administrative Regions); the
        Republic of Cuba; the Islamic Republic of Iran; the Democratic People&apos;s Republic of
        Korea; the Syrian Arab Republic; the Russian Federation; the Republic of Belarus; the
        Crimea, Donetsk, Luhansk, Zaporizhzhia and Kherson regions of Ukraine; and any other
        jurisdiction designated by Venus DAO governance from time to time.
      </li>

      <li>
        <strong>&quot;Sanctioned Person&quot;</strong> means any person listed on the OFAC Specially
        Designated Nationals and Blocked Persons List, or any consolidated sanctions list maintained
        by the United Nations, the European Union, the United Kingdom, or any other applicable
        sanctions authority; or any person owned or controlled, directly or indirectly, by such a
        person.
      </li>

      <li>
        <strong>&quot;Supply Period, Lock Period and Settlement&quot;</strong> have the meanings
        given on the relevant Vault detail page.
      </li>

      <li>
        <strong>&quot;U.S. Person&quot;</strong> has the meaning given under Regulation S of the
        United States Securities Act of 1933, as amended, regardless of the physical location of the
        relevant person.
      </li>

      <li>
        <strong>&quot;Venus DAO&quot;</strong> means the decentralised governance organisation
        responsible for administering the Venus Protocol.
      </li>
    </AlphabeticalList>

    <h2 className="m-0">2. The Vault</h2>

    <p className="m-0">
      The Vault is a rules-based smart-contract mechanism deployed on the Venus Protocol. On
      supplying assets, you receive a Receipt Token representing a pro-rata participation share in
      the Vault. The Receipt Token is loss-bearing and is redeemed at Settlement for your pro-rata
      share of the Vault&apos;s proceeds. Each Vault&apos;s parameters (asset, lock period, target
      rate, collateral type, Counterparty) are fixed at deployment and disclosed on the relevant
      Vault detail page. Rewards are not guaranteed, and your capital is at risk.
    </p>

    <h2 className="m-0">3. Failed Activation and Default</h2>

    <p className="m-0">
      If a Vault does not satisfy its activation conditions (for example, the minimum supply cap is
      not reached or the required collateral is not posted), the Vault will transition to a failed
      state and your supplied amount will be available for refund. Where the Vault design provides
      for a Counterparty margin and the Counterparty fails to meet activation conditions, you will
      receive your pro-rata share of any forfeited margin, distributed automatically by the smart
      contract.
    </p>

    <p className="m-0">
      If the Counterparty fails to perform at the end of the Lock Period and the realisation of
      collateral is insufficient to cover the amounts owed to the Vault, the shortfall is allocated
      pro-rata among Vault Participants in proportion to their share of the Vault&apos;s total
      supply. Any application of protocol reserves to address a shortfall is at the sole discretion
      of Venus DAO governance and is not guaranteed. No Vault Participant has any claim against such
      reserves.
    </p>

    <h2 className="m-0">4. Eligibility</h2>

    <p className="m-0">
      Use of the Vault is permitted only where lawful in your jurisdiction and only by persons who
      satisfy the eligibility criteria of these Terms. You may not access or use the Vault if you
      are located in, ordinarily resident in, organised under the laws of, or accessing the Vault
      from a Restricted Jurisdiction, or if you are a U.S. Person, if you are a Sanctioned Person,
      or if you are using a virtual private network, IP-masking service, proxy or any other means to
      circumvent any geographic, identity or eligibility restriction.
    </p>

    <p className="m-0">
      You must also be at least 18 years of age, or such higher age as is required to form a binding
      contract in your jurisdiction. You are responsible for ensuring that your access to and use of
      the Vault complies with all laws applicable to you, including any identity-verification,
      tax-reporting and licensing requirements.
    </p>

    <h2 className="m-0">5. User Representations</h2>

    <p className="m-0">
      By supplying assets to a Vault, you represent and warrant, on a continuing basis, that:
    </p>

    <AlphabeticalList>
      <li>
        you are not located in, ordinarily resident in, organised under the laws of, or accessing
        the Vault from a Restricted Jurisdiction;
      </li>

      <li>
        you are not a &quot;U.S. Person&quot; within the meaning of Regulation S under the U.S.
        Securities Act of 1933, as amended, regardless of physical location;
      </li>

      <li>
        you are not a Sanctioned Person and you are not acting for or on behalf of a Sanctioned
        Person;
      </li>

      <li>
        you are not using a virtual private network, proxy or other means to circumvent any
        geographic, identity or eligibility restriction;
      </li>

      <li>
        the assets you supply are not derived from, and will not be used in connection with, any
        unlawful activity, including money laundering, terrorist financing, sanctions evasion, tax
        evasion or fraud;
      </li>

      <li>
        you have sole control of the wallet you use to access the Vault, you are solely responsible
        for safeguarding its private keys and other credentials, and any transaction signed by that
        wallet is binding on you;
      </li>

      <li>
        if you access or use the Vault on behalf of any other person or entity, you have full
        authority to bind that person or entity to these Terms; and
      </li>

      <li>
        you have obtained any tax, regulatory or other advice you require before supplying assets.
      </li>
    </AlphabeticalList>

    <h2 className="m-0">6. Prohibited Uses</h2>

    <p className="m-0">You agree not to:</p>

    <AlphabeticalList>
      <li>
        use the Vault for any unlawful purpose or in breach of any applicable law or regulation;
      </li>

      <li>
        interact with the Vault or the Venus Protocol in any manner intended to disrupt the
        protocol, the smart contracts or any other person&apos;s access;
      </li>

      <li>impersonate any person or misrepresent your identity, affiliation or eligibility;</li>

      <li>engage in fraud, market manipulation or any deceptive or abusive practice;</li>

      <li>
        use any bot, scraper, automated tool or other device to interact with the Vault other than
        as permitted by the protocol; or
      </li>

      <li>
        attempt to gain unauthorised access to, interfere with, or otherwise compromise the proper
        operation of the Vault, the Venus Protocol interface or any related system.
      </li>
    </AlphabeticalList>

    <p className="m-0">
      Frontend operators may restrict or suspend your access to the Vault interface, at any time and
      without prior notice, if they reasonably believe that you have breached these Terms or
      applicable law.
    </p>

    <h2 className="m-0">7. Risks</h2>

    <p className="m-0">
      By supplying assets to a Vault, you accept the following risks. This is not an exhaustive
      list.
    </p>

    <AlphabeticalList>
      <li>
        <strong>Protocol and smart-contract risk.</strong> Smart-contract vulnerabilities, oracle
        failures, exploits or governance actions may affect your position. Audits do not eliminate
        this risk.
      </li>

      <li>
        <strong>Counterparty and collateral risk.</strong> The Counterparty may default. Collateral
        may lose value. Realisation may not fully recover the amounts owed. You may receive less
        than the amount you supplied, including zero.
      </li>

      <li>
        <strong>Custody and settlement risk.</strong> Off-chain custody and settlement processes are
        conducted by third parties outside Venus DAO&apos;s control. Settlement may be delayed.
        Where in-kind settlement applies, you may receive an asset of a different type than the
        supplied asset.
      </li>

      <li>
        <strong>Market and stablecoin risk.</strong> The supplied asset, the collateral or the
        Receipt Token may experience price volatility, illiquidity, regulatory restriction, freeze
        or de-peg events.
      </li>

      <li>
        <strong>Regulatory, sanctions and tax risk.</strong> The legal and regulatory status of
        decentralised finance products may change. You are solely responsible for compliance with
        applicable anti-money-laundering, sanctions and tax laws.
      </li>
    </AlphabeticalList>

    <h2 className="m-0">8. Nature of the Service</h2>

    <p className="m-0">
      The Vault, the Receipt Token and Venus DAO are not, and shall not be construed as: a bank,
      deposit-taker, e-money issuer, payment institution, broker, dealer, fund manager, trustee,
      custodian or fiduciary; nor a deposit account, savings or money-market product, security,
      swap, derivative, collective investment scheme, alternative investment fund or stored-value
      instrument. The Receipt Token is not intended to constitute, and should not be construed as, a
      debt instrument, security or financial instrument under the laws of any jurisdiction.
    </p>

    <p className="m-0">
      Nothing in these Terms creates a fiduciary, advisory, custodial or trust relationship between
      you and Venus DAO, Venus Protocol, any Counterparty or any custody partner. Any target rate
      displayed in connection with a Vault is the contractual obligation of the Counterparty under
      the Vault&apos;s parameters, conditional on Counterparty performance and successful
      Settlement, and is not a guarantee. Nothing in these Terms, on any Vault detail page or on any
      frontend interface constitutes investment, tax or legal advice.
    </p>

    <p className="m-0">
      Information published on the Venus Protocol interface, in community channels, by community
      contributors or by any third party is provided for general information only and may be
      inaccurate, incomplete or out of date. Any reliance you place on such information is at your
      own risk.
    </p>

    <h2 className="m-0">9. Disclaimer of Warranties and Limitation of Liability</h2>

    <p className="m-0">
      The Vault, the Receipt Token, the Venus Protocol interface and all related services are
      provided on an &quot;as is&quot; and &quot;as available&quot; basis. Venus DAO makes no
      representation or warranty, express or implied, including as to merchantability, fitness for
      purpose, non-infringement, accuracy or absence of errors.
    </p>

    <p className="m-0">
      Subject to applicable law, Venus DAO and any contributor are not liable for any indirect,
      incidental, special, consequential, punitive or exemplary loss, or for any loss of profit,
      revenue, business, goodwill, opportunity or expected return, arising out of or in connection
      with these Terms or the Vault.
    </p>

    <p className="m-0">
      Subject to applicable law, the aggregate liability of Venus DAO and any contributor in respect
      of any Vault shall not exceed the protocol fees, if any, received by the Protocol from you in
      respect of that Vault.
    </p>

    <h2 className="m-0">10. Indemnification</h2>

    <p className="m-0">
      You indemnify Venus DAO, Venus Protocol, their affiliates, contributors and service providers
      from and against any losses, liabilities, costs and reasonable legal expenses arising out of:
    </p>

    <AlphabeticalList>
      <li>your breach of these Terms;</li>

      <li>any false or misleading representation made by you under Section 5;</li>

      <li>
        your breach of the prohibited-use rules in Section 6 or the jurisdictional restrictions in
        Section 12;
      </li>

      <li>fraud or wilful misconduct by you; or</li>

      <li>
        your misuse of the Vault, including any attempt to circumvent access controls or to interact
        with the Vault in violation of applicable law.
      </li>
    </AlphabeticalList>

    <h2 className="m-0">11. Amendments</h2>

    <p className="m-0">
      Venus DAO may update these Terms through governance. No amendment may alter the economic terms
      of an active Vault, including the target rate, lock period, Counterparty and settlement
      option, except under sub-clause (c) below.
    </p>

    <AlphabeticalList>
      <li>
        <strong>Non-material operational updates.</strong> Take effect immediately on publication.
      </li>

      <li>
        <strong>Material changes.</strong> Take effect not less than 14 days after publication and
        apply only to Vaults deployed after the effective date.
      </li>

      <li>
        <strong>Emergency changes.</strong> May take effect immediately, including in respect of
        active Vaults, where required to comply with applicable law, to address a security or
        operational emergency, or to give effect to a regulator&apos;s order. Where applied to an
        active Vault, Venus DAO will publish a contemporaneous explanation.
      </li>
    </AlphabeticalList>

    <p className="m-0">
      Continued use of any Vault after an amendment takes effect constitutes your acceptance of the
      revised Terms.
    </p>

    <p className="m-0">
      Notwithstanding the foregoing, where a Vault Participant&apos;s assets are in the Lock Period
      at the time an amendment takes effect: (a) that Vault Participant is deemed to have accepted
      any non-material operational update under Section 11(a) and any emergency or regulatory
      compliance change under Section 11(c), provided in each case that such amendment does not
      alter the target rate, lock period, Counterparty or settlement terms applicable to their
      active Vault; and (b) that Vault Participant is not bound by any material change under Section
      11(b) in respect of their active participation in that Vault. Nothing in this paragraph limits
      Venus DAO&apos;s ability to apply emergency changes under Section 11(c) to an active Vault as
      permitted under that Section.
    </p>

    <h2 className="m-0">12. Governing Law, Dispute Resolution and Waivers</h2>

    <p className="m-0">
      These Terms are governed by the laws of Singapore, without regard to conflict-of-laws
      principles. Any dispute arising out of or relating to these Terms shall be finally resolved by
      binding arbitration administered by the Singapore International Arbitration Centre (SIAC) in
      accordance with the SIAC Rules then in force. The seat of arbitration is Singapore and the
      language is English. The arbitral tribunal shall consist of one arbitrator unless the parties
      agree otherwise.
    </p>

    <p className="m-0">
      To the fullest extent permitted by applicable law, any dispute will be conducted only on an
      individual basis and not as a class, consolidated or representative action. No arbitrator or
      court has the authority to consolidate claims under these Terms.
    </p>

    <p className="m-0">
      Any claim arising out of or relating to these Terms must be commenced within one (1) year
      after the cause of action accrues. After that period, the claim is permanently barred.
    </p>

    <p className="m-0">
      To the fullest extent permitted by applicable law, you agree not to seek, and waive any right
      to seek, an injunction or other equitable relief that would prevent, interrupt or interfere
      with the development, deployment or operation of the Vault, the Venus Protocol or any related
      smart contract.
    </p>

    <h2 className="m-0">13. Miscellaneous</h2>

    <h3 className="m-0">13.1 Force Majeure.</h3>

    <p className="m-0">
      Neither Venus DAO nor any contributor is liable for any failure or delay in performance
      arising from any event beyond its reasonable control, including smart-contract halt or
      exploit, oracle failure, chain reorganisation, bridge failure, stablecoin issuer action,
      custody partner failure, sanctions-related restriction, governmental order, cyber-attack,
      natural disaster or pandemic.
    </p>

    <h3 className="m-0">13.2 Severability and Entire Agreement.</h3>

    <p className="m-0">
      If any provision of these Terms is held invalid, illegal or unenforceable, the remaining
      provisions remain in full force, and the invalid provision shall be modified to the minimum
      extent necessary while preserving its intent. These Terms constitute the entire agreement
      between you and Venus DAO in respect of the Vaults.
    </p>

    <h3 className="m-0">13.3 Electronic Acceptance.</h3>

    <p className="m-0">
      You are bound by these Terms the moment you sign the on-chain transaction that supplies assets
      to a Vault. That signature is your binding act of acceptance and constitutes confirmation that
      you have read, understood and agreed to these Terms as in force at the time. Where a frontend
      operator additionally presents a click-through, checkbox or equivalent mechanism before that
      transaction, completing it is additional confirmation; the on-chain supply transaction binds
      you regardless of whether a click-through is presented.
    </p>

    <p className="m-0">
      By supplying assets to a Vault, you also consent in advance to the application of any
      non-economic regulatory compliance or emergency change under Section 11(c) to your active
      participation in that Vault during any Lock Period, including in circumstances where you are
      unable to withdraw your position at the time such change takes effect.
    </p>
  </Legal>
);

export default FixedTermVaultTermsOfUse;
