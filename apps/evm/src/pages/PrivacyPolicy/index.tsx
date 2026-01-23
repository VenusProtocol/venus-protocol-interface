import { MAIN_PRODUCTION_HOST } from 'constants/production';
import { routes } from 'constants/routing';
import { Legal } from 'containers/Legal';
import { Link } from 'containers/Link';

const LAST_UPDATED_AT = 'September 18, 2025';

const PrivacyPolicy: React.FC = () => (
  <Legal title="Privacy Policy" lastUpdatedAt={new Date(LAST_UPDATED_AT)}>
    <p className="m-0">
      This Privacy Notice (“Notice”) describes how Venus (“Venus.io”, “we”, “us”, “our”,
      “ourselves”) collects and processes your Personal Data (“you”, “your”) through our websites (
      <Link to={routes.landing.path}>{MAIN_PRODUCTION_HOST}</Link>) and applications or other
      services (collectively, together with our websites and apps, our “Services”). In addition, we
      may also process your Personal Data for specific purposes, where applicable, such as
      processing your job applications or administering your employment with us. By using our
      Services or engaging with us, you consent to the collection, storage, processing, and transfer
      of your Personal Data as described in this Privacy Notice.
    </p>

    <p className="m-0">
      This Privacy Notice applies together with our Terms of Use, any terms of business or other
      contractual documents, including but not limited to any agreements we may have with you.
    </p>

    <h2 className="m-0">1. Our Relationship with You</h2>

    <p className="m-0">
      Your right to privacy and the protection of your Personal Data is important to us. Venus is
      committed to the best practices in privacy, and we will only collect data when it’s strictly
      necessary to provide our Services.
    </p>

    <p className="m-0">
      By using Venus’s Services, including, for example, visiting our website, using our
      application, interacting on social media or community forum, participating in our offline
      events (and this list is not exhaustive), you acknowledge and accept the use, disclosure, and
      procedures outlined in this Privacy Notice.
    </p>

    <p className="m-0">
      The following sections provide further details as to how we process your Personal Data through
      Venus as the Data Controller.
    </p>

    <h2 className="m-0">2. Collection and Use of Your Personal Data</h2>

    <p className="m-0">
      “Personal Data” is information that may identify an individual or relates to an identifiable
      individual. This includes information you provide voluntarily to us, information which is
      collected or created automatically in the natural course of provision of our Services, or
      otherwise when you contact us. Following best practices in privacy such as data minimisation,
      we endeavour to collect only the amount of Personal Data that is necessary to provide our
      Services to our users.
    </p>

    <h3 className="m-0">When You Use Our Services</h3>

    <p className="m-0">
      Surfing on our websites does not require you to create an account with us. When you choose to
      access additional Services provided by us, we collect and store some of your personal details
      to allow us providing and managing your use of our Services.
    </p>

    <p className="m-0">
      Below, we present a list that outlines the Personal Data that the Services use and the
      purposes for processing that information.
    </p>

    <ul>
      <li>
        Wallet information: This may include your wallet ID, public wallet address, and transaction
        details. We use this information to facilitate, execute, and manage the transactions you
        request.
      </li>

      <li>
        Social Media information: This may include details you choose to share during your
        interaction with us via channels such as X, Telegram, or Discord. We use this information to
        interact with you in our community, enable participation in events or campaigns, and keep
        you updated on announcements.
      </li>

      <li>
        Community Profile Information: This may include your email address, username, and optional
        profile photo or name. We use this information to authenticate and manage user accounts.
        Your username and profile photo may be displayed to other users to facilitate community
        interaction. Providing a photo or full name is entirely optional. Your email remains private
        and is never shown publicly. All profile information is submitted voluntarily.
      </li>
    </ul>

    <p className="m-0">
      We primarily rely on the legal basis of contract performance to process your Personal Data in
      connection with your use of our Services. For certain optional features, we may also rely on
      your consent or our legitimate interests, as appropriate.
    </p>

    <h3 className="m-0">Connect Using Third-Party Platforms</h3>

    <p className="m-0">
      We offer you a seamless connection to our Services through third-party platforms, such as
      MetaMask, Coinbase Wallet or Wallet Connect. You can easily access our Services using your
      existing wallet from these platforms. By using or continuing to use your third-party account
      to log in, you acknowledge and agree to our access and use of the information provided by such
      third-party platform.
    </p>

    <h3 className="m-0">Recruitment and Employment</h3>

    <p className="m-0">
      If you apply for a position with us or become employed by us, we collect and process your
      Personal Data for purposes including recruitment, onboarding, employment administration,
      compliance with legal obligations, and other employment-related activities. Personal Data may
      be collected directly from you, from third-party recruitment agencies, or from publicly
      available sources such as LinkedIn.
    </p>

    <p className="m-0">
      We process the following categories of Personal Data for recruitment and employment purposes:
    </p>

    <ul>
      <li>
        <span>Contact Information:</span> We will collect your name, email address, and other
        relevant contact details to communicate with you about your job application and, where
        applicable, your employment.
      </li>

      <li>
        <span>Education and Employment Information:</span> We collect your Curriculum Vitae (CV),
        resume, LinkedIn profile, academic certificates and transcripts, employment history, and
        (where relevant) salary and bonus details. We use this information to assess your
        suitability, process your application, conduct background checks, and manage your employment
        relationship.
      </li>
    </ul>

    <p className="m-0">
      During recruitment, we rely on your consent to process your Personal Data. Once employed, we
      rely on the necessity to perform your contract, comply with legal obligations, and our
      legitimate interests in managing the employment relationship.
    </p>

    <h3 className="m-0">Participation in Our Events</h3>

    <p className="m-0">
      When you register or attend our event, we collect some Personal Data to help manage your
      participation. This may include your name, contact details, company information, job title,
      industry, location, LinkedIn profile, payment details, and billing address.
    </p>

    <p className="m-0">We use this information to:</p>

    <ul>
      <li>Process your event registration and ticketing</li>

      <li>Communicate important updates about the event</li>

      <li>Analyze participation to improve future events</li>

      <li>Support appropriate marketing efforts by our event sponsors</li>
    </ul>

    <p className="m-0">
      We process your Personal Data based on the agreement you enter when registering, and on our
      legitimate interest in delivering and improving our events. Where required, we will seek your
      consent for marketing purposes or when sharing your details with sponsors.
    </p>

    <p className="m-0">
      We rely on the legal basis of contract performance to process your Personal Data for event
      registration and participation. In addition, we process certain data based on our legitimate
      interest in enhancing our services. Where required, we will obtain your consent for marketing
      activities and for sharing your information with event sponsors.
    </p>

    <p className="m-0">
      Please note that photography and videography may take place during the event for promotional
      and archival purposes. By attending our event, you agree that VENUS and our partners may use
      your image in marketing materials, social media posts, or future event promotions as part of
      our efforts to share and celebrate the event.
    </p>

    <h3 className="m-0">Personal Data collected automatically from you:</h3>

    <p className="m-0">
      In certain circumstances, we may collect Personal Data automatically from you when you use our
      Services, in accordance with applicable laws. This may include device, log, and usage data,
      which helps us enhance your experience, provide customer support, improve the performance of
      our sites and Services, and safeguard your account by detecting unauthorized access and
      preventing fraud.
    </p>

    <h3 className="m-0">Log and Usage Data</h3>

    <p className="m-0">
      When you access or use our Services, our servers automatically collect service-related,
      diagnostic, usage, and performance data, which is recorded in log files. This log data may
      include your IP address, device information, browser type, settings, and details about your
      activity within the Services (such as timestamps, pages and files viewed, searches performed,
      and features used). It may also include device event data like system activity, error reports
      (such as "crash dumps"), and hardware settings.
    </p>

    <p className="m-0">
      Our legal basis for processing this data is our legitimate interest in improving our Services,
      ensuring the security of our Services, and maintaining a safe environment for our users,
      including fraud monitoring and prevention.
    </p>

    <h3 className="m-0">Aggregated and Anonymized Data</h3>

    <p className="m-0">
      We also use aggregated or anonymized data to improve our Services. This involves analyzing
      general usage trends, gathering feedback, and conducting research without identifying
      individual users. For example, we may create overall usage reports for specific regions
      without containing Personal Data.
    </p>

    <p className="m-0">
      We will not use your Personal Data for purposes that are incompatible with the purposes of
      which you have been informed, unless it is required or authorized by law, or it is in your own
      vital interest to do so.
    </p>

    <h2 className="m-0">3. How and Why We Share Your Data</h2>

    <p className="m-0">
      Information about our users is an important part of our business and we are not in the
      business of selling our user’s Personal Data to others. We may transfer Personal Data to our
      service providers or third parties in connection with Venus’s operation of its business, as
      certain features on Venus rely on various third-party products and services (collectively
      “Third Party Services”), such as processing of web hosting, cloud storage, analytics, and
      improvement of website-related services and features, and performance of maintenance services.
    </p>

    <p className="m-0">
      Third Party Services providers must only process the Personal Data in accordance with our
      contractual agreements and only as permitted by applicable data protection laws.
    </p>

    <p className="m-0">
      We may also share Personal Data with the following persons or in the following circumstances:
    </p>

    <ul>
      <li>
        <span>Affiliates:</span> Personal Data that we process and collect may be transferred
        between companies, Services, and employees affiliated with us (collectively, our
        “Affiliates”) as a normal part of conducting business and offering our Services.
      </li>

      <li>
        <span>Business Transfers:</span> As we continue to develop our business, we might sell or
        buy other businesses or services. In such transactions, user information generally is one of
        the transferred business assets but remains subject to the promises made in any pre-existing
        Privacy Notice (unless, of course, the user consents otherwise). Also, in the unlikely event
        that Venus or substantially all of its assets are acquired, users' information will be one
        of the transferred assets.
      </li>

      <li>
        <span>Legal Authorities:</span> We may be required by law or by Court to disclose certain
        information which might cover Personal Data or any engagement we may have to relevant
        regulatory, law enforcement and/or other competent authorities. We will disclose Personal
        Data to legal authorities to the extent we are obliged to do so according to the law. We may
        also need to disclose Personal Data in order to enforce or apply our legal rights or to
        prevent fraud.
      </li>

      <li>
        <span>Protection of Us and Others:</span> We will share Personal Data outside of Venus if we
        have a reasonable belief that access, use, preservation, or disclosure of the information is
        reasonably necessary to comply with any applicable law, regulation, legal process, or
        enforceable governmental request; to cooperate with law enforcement; to enforce or apply our
        Terms of Use and other agreements; or to protect the rights, property, or safety of Venus,
        our employees, our users, or others. This includes exchanging information with other
        companies and organizations for fraud protection and credit risk reduction, and with
        regulatory agencies and law enforcement to comply with lawful requests.
      </li>
    </ul>

    <p className="m-0">
      Our Services and websites may contain links that enable you to connect with various
      third-party websites, applications, and other external platforms (referred to as "Third Party
      Platforms"). These Third Party Platforms act as independent data controllers and their
      processing of your Personal Data will be subject to their privacy notices and policies. This
      Privacy Notice does not cover the privacy practices of these Third Party Platforms. A link to
      a third-party site does not imply endorsement by us or our Affiliates. Your use of these Third
      Party Platforms and their handling of your Personal Data will be governed by their respective
      terms and privacy policies, and not by this Privacy Notice.
    </p>

    <h2 className="m-0">4. International Transfer of Personal Data</h2>

    <p className="m-0">
      We maintain servers hosted by our trusted service providers, and your information may be
      processed on servers located outside of your country of residence. Additionally, we may
      transfer your Personal Data to our Affiliates, third-party partners, and service providers
      located in various countries around the world.
    </p>

    <p className="m-0">
      In instances where we process your Personal Data on servers outside your country or transfer
      it to third countries or international organizations beyond your country of residence, we
      implement appropriate technical, organizational, and contractual safeguards to ensure that
      your Personal Data remains protected. This includes, but is not limited to, the use of
      Standard Contractual Clauses. These measures ensure that any such transfers comply with
      applicable data protection laws and maintain an adequate level of protection for your Personal
      Data as outlined in this Notice.
    </p>

    <h2 className="m-0">5. Data Security</h2>

    <p className="m-0">
      We recognize that information security is a crucial component of data privacy. We are
      committed to making sure your information is protected in accordance with applicable laws and
      our data privacy policies. Although no data transmission, including over the Internet or
      through any website, can be guaranteed to be entirely secure, we employ a range of
      commercially reasonable physical, technical, and procedural measures to protect Personal Data
      from unauthorized access, use, disclosure, alteration, or destruction.
    </p>

    <p className="m-0">
      The information you provide to us is stored on secure servers managed by us or our trusted
      service providers. Access to and use of this information are governed by our internal security
      policies and standards, or those agreed upon with our service providers, all in alignment with
      industry best practices.
    </p>

    <h2 className="m-0">6. Data Retention</h2>

    <p className="m-0">
      We keep your Personal Data to enable your continued use of our Services, for as long as it is
      required in order to fulfill the relevant purposes described in this Privacy Notice as may be
      required by law such as for tax and accounting purposes, or to resolve disputes and/or legal
      claims or as otherwise communicated to you.
    </p>

    <p className="m-0">
      When we have no ongoing legitimate business or legal requirement to retain your Personal Data,
      we will either delete or anonymise such information, or, if this is not possible (for example,
      because your Personal Data has been stored in backup archives), then we will securely store
      your Personal Data and isolate it from any further processing until deletion is possible.
    </p>

    <h2 className="m-0">7. What Privacy Rights Do You Have?</h2>

    <h3 className="m-0">Your Privacy Rights</h3>

    <ul>
      <li>
        <span>Right to access:</span> You have the right to obtain a copy of the Personal Data that
        we hold about you as well as certain information related to its processing.
      </li>

      <li>
        <span>Right to correct:</span> You can request the rectification of your Personal Data which
        are inaccurate, and also add to it. You can also change your Personal Data in your account
        at any time.
      </li>

      <li>
        <span>Request to erase your Personal Data:</span> You may request the erasure of your
        Personal Data, including where such Personal Data would no longer be necessary to achieve
        the purposes for which it was collected. Please note that Personal Data may still need to be
        retained for compliance with applicable legal obligations.
      </li>

      <li>
        <span>Right to object:</span> You can object, for reasons relating to your situation, to the
        processing of your Personal Data. For instance, you have the right to object where we rely
        on legitimate interest or where we process your data for direct marketing purposes.
      </li>

      <li>
        <span>Right to restrict processing:</span> You have the right, in certain cases, to
        temporarily restrict the processing of your Personal Data by us, provided there are valid
        grounds for doing so. We may continue to process your Personal Data if it is necessary for
        the defense of legal claims, or for any other exceptions permitted by applicable laws.
      </li>

      <li>
        <span>Right to withdraw / opt out your consent:</span> You have the right to withdraw your
        consent and request us to stop collecting, using and/or disclosing your Personal Data for
        any or all of the purposes listed above at any time. Exercising this right does not affect
        the lawfulness of the processing based on the consent given before the withdrawal of the
        latter.
      </li>

      <li>
        <span>Right to portability:</span> You can also request us to provide your information in a
        structured way so you can send it to another service provider.
      </li>
    </ul>

    <h3 className="m-0">Submit Privacy Request</h3>

    <p className="m-0">
      Alternatively, to exercise your rights, you can submit a request using our{' '}
      <a
        href="https://submit-irm.trustarc.eu/services/validation/2348950a-f5af-453c-b39b-9438f35181e3/?brandId=1cd7c934-f88e-4bad-80c6-e12951fc259b"
        target="_blank"
        rel="noreferrer"
      >
        online form
      </a>{' '}
      or contact us via email at privacy[at]venus.io.
    </p>

    <p className="m-0">
      We will respond as quickly as possible. If we are unable to respond within 30 days, we will
      inform you in writing of the timeline for our response. If we cannot fulfill your request, we
      will explain the reasons (unless prohibited by applicable laws).
    </p>

    <p className="m-0">
      If you have any questions or concerns about how we collect and process your Personal Data, or
      if you wish to withdraw your consent for any processing, please contact us.
    </p>

    <h2 className="m-0">8. Children</h2>

    <p className="m-0">
      We do not knowingly solicit data from or market to any persons under 18 years of age. By using
      the Services, you represent that you are at least 18 years old. If we become aware that we
      have collected Personal Data from someone under 18, we will deactivate the account in question
      and take reasonable measures to promptly delete all such data from our records unless we are
      legally required to keep it. If you become aware that any Personal Data we may have collected
      is from a user under the age of 18, please contact us using the contact information below.
    </p>

    <h2 className="m-0">9. Contact Information</h2>

    <p className="m-0">
      Our support team is available to direct any questions related to your Personal Data. You can
      contact us through our{' '}
      <a
        href="https://submit-irm.trustarc.eu/services/validation/2348950a-f5af-453c-b39b-9438f35181e3/?brandId=1cd7c934-f88e-4bad-80c6-e12951fc259b"
        target="_blank"
        rel="noreferrer"
      >
        online form
      </a>{' '}
      or contact us via email at <a href="mailto:privacy@venus.io">privacy@venus.io</a>., and we
      will ensure your inquiry reaches the appropriate team to address any concerns regarding the
      collection and processing of your Personal Data.
    </p>

    <h2 className="m-0">10. Conditions of Use, Notices and Revisions</h2>

    <p className="m-0">
      If you choose to use our Services, your use and any dispute over privacy is subject to this
      Privacy Notice and our Terms of Use. If you have any concerns about privacy at Venus, please
      contact us and we will try our best to resolve it. You also have the right to contact your
      local Data Protection Authority.
    </p>

    <p className="m-0">
      We reserve the right to update and revise this Notice at any time. We will review this Privacy
      Notice from time to time to make sure it complies with applicable laws and conforms to changes
      in our business. If we do revise this Privacy Notice, we will update the “Last Updated” date
      at the beginning of this Notice so that you can tell if it has changed since your last visit
      and will do our best to notify you.
    </p>

    <p className="m-0">
      Please review this Privacy Notice regularly to ensure that you are aware of its terms. Your
      continued use of our Services after an amendment to our Privacy Notice constitutes your
      acceptance to the amended terms.
    </p>
  </Legal>
);

export default PrivacyPolicy;
