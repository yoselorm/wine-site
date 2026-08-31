import React from 'react';
import SectionBanner from '../../components/public/shared/SectionBanner';

const Section = ({ title, children }) => (
  <div className="mb-10">
    <h2 className="font-serif text-2xl text-zinc-900 mb-4">{title}</h2>
    <div className="space-y-4 text-base text-zinc-600 font-light leading-relaxed">{children}</div>
  </div>
);

const TermsConditions = () => {
  return (
    <div className="bg-cream min-h-screen">
      <SectionBanner title="Terms & Conditions" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Terms & Conditions' }]} />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-4 text-base text-zinc-600 font-light leading-relaxed mb-10">
          <p className="text-center font-medium text-zinc-700">Welcome to wine2u.com!</p>
          <p>
            These terms and conditions outline the rules and regulations for the use of wine2u's website, located
            at wine2u.com.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use
            wine2u.com if you do not agree to take all of the terms and conditions stated on this page.
          </p>
          <p>
            The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer
            Notice and all Agreements: "Client", "You" and "Your" refers to you, the person logging on to this
            website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our"
            and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
            All terms refer to the offer, acceptance and consideration of payment necessary to undertake the
            process of our assistance to the Client in the most appropriate manner, whether by formal meetings of
            a fixed duration, or any other means, for the express purpose of meeting the Client's needs in respect
            of the provision of the Company's stated services, in accordance with and subject to prevailing law.
          </p>
        </div>

        <Section title="Cookies">
          <p>
            We employ the use of cookies. By accessing wine2u.com, you agreed to use cookies in agreement with
            wine2u's Privacy Policy.
          </p>
          <p>
            Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are
            used by our website to enable the functionality of certain areas to make it easier for people visiting
            our website. Some of our affiliate/advertising partners may also use cookies.
          </p>
        </Section>

        <Section title="License">
          <p>
            Unless otherwise stated, wine2u and/or its licensors own the intellectual property rights for all
            material on wine2u.com. All intellectual property rights are reserved. You may access this from
            wine2u.com for your own personal use subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Republish material from wine2u.com</li>
            <li>Sell, rent or sub-license material from wine2u.com</li>
            <li>Reproduce, duplicate or copy material from wine2u.com</li>
            <li>Redistribute content from wine2u.com</li>
          </ul>
          <p>
            Parts of this website offer an opportunity for users to post and exchange opinions and information in
            certain areas of the website. wine2u does not filter, edit, publish or review Comments prior to their
            presence on the website. Comments do not reflect the views and opinions of wine2u, its agents and/or
            affiliates. Comments reflect the views and opinions of the person who posts their views and opinions.
            To the extent permitted by applicable laws, wine2u shall not be liable for the Comments or for any
            liability, damages or expenses caused and/or suffered as a result of any use of and/or posting of
            and/or appearance of the Comments on this website.
          </p>
          <p>
            wine2u reserves the right to monitor all Comments and to remove any Comments which can be considered
            inappropriate, offensive or causes breach of these Terms and Conditions.
          </p>
          <p>You warrant and represent that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are entitled to post the Comments on our website and have all necessary licenses and consents to do so;</li>
            <li>The Comments do not invade any intellectual property right, including without limitation copyright, patent or trademark of any third party;</li>
            <li>The Comments do not contain any defamatory, libelous, offensive, indecent or otherwise unlawful material which is an invasion of privacy;</li>
            <li>The Comments will not be used to solicit or promote business or custom or present commercial activities or unlawful activity.</li>
          </ul>
          <p>
            You hereby grant wine2u a non-exclusive license to use, reproduce, edit and authorize others to use,
            reproduce and edit any of your Comments in any and all forms, formats or media.
          </p>
        </Section>

        <Section title="Hyperlinking to Our Content">
          <p>The following organizations may link to our website without prior written approval:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Government agencies;</li>
            <li>Search engines;</li>
            <li>News organizations;</li>
            <li>Online directory distributors may link to our website in the same manner as they hyperlink to the websites of other listed businesses; and</li>
            <li>System-wide accredited businesses, except soliciting non-profit organizations, charity shopping malls, and charity fundraising groups which may not hyperlink to our website.</li>
          </ul>
          <p>
            These organizations may link to our home page, to publications or to other website information so
            long as the link: (a) is not in any way deceptive; (b) does not falsely imply sponsorship, endorsement
            or approval of the linking party and its products and/or services; and (c) fits within the context of
            the linking party's site.
          </p>
          <p>We may consider and approve other link requests from the following types of organizations:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Commonly-known consumer and/or business information sources;</li>
            <li>Dot.com community sites;</li>
            <li>Associations or other groups representing charities;</li>
            <li>Online directory distributors;</li>
            <li>Internet portals;</li>
            <li>Accounting, law and consulting firms; and</li>
            <li>Educational institutions and trade associations.</li>
          </ul>
          <p>
            We will approve link requests from these organizations if we decide that: (a) the link would not make
            us look unfavorably to ourselves or to our accredited businesses; (b) the organization does not have
            any negative records with us; (c) the benefit to us from the visibility of the hyperlink compensates
            the absence of wine2u; and (d) the link is in the context of general resource information.
          </p>
          <p>
            If you are one of the organizations listed above and are interested in linking to our website, you
            must inform us by sending us a message including your name, your organization name, contact
            information, as well as the URL of your site, a list of any URLs from which you intend to link to our
            website, and a list of the URLs on our site to which you would like to link. Please allow 2–3 weeks
            for a response.
          </p>
          <p>Approved organizations may hyperlink to our website as follows:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>By use of our corporate name; or</li>
            <li>By use of the uniform resource locator being linked to; or</li>
            <li>By use of any other description of our website being linked to that makes sense within the context and format of content on the linking party's site.</li>
          </ul>
          <p>No use of wine2u's logo or other artwork will be allowed for linking absent a trademark license agreement.</p>
        </Section>

        <Section title="iFrames">
          <p>
            Without prior approval and written permission, you may not create frames around our webpages that
            alter in any way the visual presentation or appearance of our website.
          </p>
        </Section>

        <Section title="Content Liability">
          <p>
            We shall not be held responsible for any content that appears on your website. You agree to protect
            and defend us against all claims that arise on your website. No link(s) should appear on any website
            that may be interpreted as libelous, obscene or criminal, or which infringes, otherwise violates, or
            advocates the infringement or other violation of, any third-party rights.
          </p>
        </Section>

        <Section title="Your Privacy">
          <p>Please read our Privacy Policy for details on how we handle your data.</p>
        </Section>

        <Section title="Reservation of Rights">
          <p>
            We reserve the right to request that you remove all links or any particular link to our website. You
            approve to immediately remove all links to our website upon request. We also reserve the right to
            amend these terms and conditions and its linking policy at any time. By continuously linking to our
            website, you agree to be bound to and follow these linking terms and conditions.
          </p>
        </Section>

        <Section title="Removal of Links from Our Website">
          <p>
            If you find any link on our website that is offensive for any reason, you are free to contact and
            inform us at any time. We will consider requests to remove links, but we are not obligated to, or to
            respond to you directly.
          </p>
          <p>
            We do not ensure that the information on this website is correct; we do not warrant its completeness
            or accuracy, nor do we promise to ensure that the website remains available or that the material on
            the website is kept up to date.
          </p>
        </Section>

        <Section title="Disclaimer">
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties and
            conditions relating to our website and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Limit or exclude our or your liability for death or personal injury;</li>
            <li>Limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
            <li>Limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
            <li>Exclude any of our or your liabilities that may not be excluded under applicable law.</li>
          </ul>
          <p>
            The limitations and prohibitions of liability set out in this section and elsewhere in this
            disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under
            the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
          </p>
          <p>
            As long as the website and the information and services on the website are provided free of charge, we
            will not be liable for any loss or damage of any nature.
          </p>
        </Section>
      </div>
    </div>
  );
};

export default TermsConditions;
