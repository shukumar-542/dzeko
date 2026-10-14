import PageHero from "@/components/common/PageHero";

const sections = [
  {
    title: "Hyrje", // Introduction
    paragraphs: [
      "Mirë se vini në Testora. Ne jemi të përkushtuar për mbrojtjen e privatësisë suaj dhe ruajtjen e sigurisë së informacionit tuaj personal.", // Welcome to Testora. We are committed to protecting your privacy and safeguarding your personal information.
      "Kjo Politikë e Privatësisë shpjegon se si mbledhim, përdorim dhe mbrojmë të dhënat tuaja kur përdorni faqen tonë të internetit, aplikacionet celulare dhe shërbimet e tregut online.", // This Privacy Policy explains how we collect, use, and protect your data when you use our website, mobile applications, and marketplace services.
    ],
  },
  {
    title: "Informacioni që mbledhim", // Information We Collect
    bullets: [
      "Informacion personal identifikues (emri, email-i, numri i telefonit)", // Personal identification information (name, email, phone)
      "Të dhënat e hyrjes në llogari dhe të autentifikimit", // Account credentials and authentication data
      "Të dhënat mbi përparimin arsimor dhe përdorimin e platformës", // Educational progress and usage data
      "Informacioni mbi pagesat dhe faturimin", // Payment and billing information
      "Komunikimet me shërbimin e mbështetjes së klientit", // Customer support communications
    ],
  },
  {
    title: "Si e përdorim informacionin tuaj", // How We Use Your Information
    bullets: [
      "Për të ofruar dhe mirëmbajtur shërbimet tona arsimore", // To provide and maintain our educational services
      "Për të përpunuar pagesat dhe menaxhuar llogarinë tuaj", // To process payments and manage your account
      "Për të dërguar përditësime të shërbimit dhe njoftime arsimore", // To send service updates and educational notifications
      "Për të përmirësuar veçoritë dhe përvojën e përdoruesit", // To improve features and user experience
      "Për të përmbushur detyrimet ligjore", // To comply with legal obligations
    ],
  },
  {
    title: "Të dhënat e llogarisë dhe hyrjes", // Account and Login Data
    paragraphs: [
      "Kur krijoni një llogari, ne ruajmë në mënyrë të sigurt informacionin e hyrjes, si adresën e email-it dhe fjalëkalimin e enkriptuar.", // When you create an account, we securely store login information such as email and encrypted password.
      "Ju jeni përgjegjës për ruajtjen e konfidencialitetit të të dhënave tuaja të hyrjes në llogari.", // You are responsible for maintaining the confidentiality of your account credentials.
    ],
  },
  {
    title: "Informacioni mbi paketat dhe blerjet", // Package and Purchase Information
    bullets: [
      "Detajet e mënyrës së pagesës të përpunuara nga partnerë të besuar të pagesave", // Payment method details processed by trusted payment partners
      "Adresa e faturimit dhe të dhënat e blerjeve", // Billing address and purchase records
      "Statusi i abonimit dhe datat e rinovimit", // Subscription status and renewal dates
    ],
  },
  {
    title: "Informacioni mbi tregun online dhe porositë", // Marketplace and Order Information
    bullets: [
      "Detajet e dërgesës dhe dorëzimit", // Shipping and delivery details
      "Informacioni mbi porositë dhe transaksionet", // Order and transaction information
      "Komunikimi ndërmjet blerësve dhe shitësve lidhur me porositë", // Buyer and seller communication related to orders
      "Statusi i gjurmimit dhe përmbushjes së porosive", // Tracking and fulfillment status
    ],
  },
  {
    title: "Cookies dhe analitika", // Cookies and Analytics
    bullets: [
      "Cookies thelbësore për funksionimin e platformës", // Essential cookies for platform functionality
      "Cookies të performancës për të përmirësuar cilësinë e shërbimit", // Performance cookies to improve service quality
      "Cookies të preferencave për të ruajtur cilësimet tuaja", // Preference cookies to remember settings
      "Mjete analitike për të kuptuar mënyrën e përdorimit të platformës", // Analytics tools to understand platform usage
    ],
  },
  {
    title: "Ndarja e të dhënave dhe palët e treta", // Data Sharing and Third Parties
    bullets: [
      "Ofruesit e shërbimeve që ndihmojnë në funksionimin e platformës sonë", // Service providers who help operate our platform
      "Partnerët e pagesave dhe të infrastrukturës", // Payment and infrastructure partners
      "Autoritetet ligjore kur kjo kërkohet me ligj", // Legal authorities when required by law
      "Partnerët arsimorë për programet bashkëpunuese", // Educational partners for collaborative programs
    ],
  },
  {
    title: "Siguria e të dhënave", // Data Security
    bullets: [
      "Enkriptimi i të dhënave gjatë transmetimit dhe ruajtjes", // Encryption of data in transit and at rest
      "Kontrollet e qasjes dhe mekanizmat e autentifikimit", // Access controls and authentication mechanisms
      "Kontrolle dhe monitorim të rregullt të sigurisë", // Regular security reviews and monitoring
      "Procedura të sigurta për ruajtjen dhe kopjet rezervë të të dhënave", // Secure storage and backup procedures
    ],
  },
  {
    title: "Të drejtat dhe zgjedhjet tuaja", // Your Rights and Choices
    bullets: [
      "Të qaseni dhe të shqyrtoni të dhënat tuaja personale", // Access and review your personal data
      "Të kërkoni korrigjimin e informacionit të pasaktë", // Request correction of inaccurate information
      "Të kërkoni fshirjen e të dhënave kur kjo është e zbatueshme", // Request deletion where applicable
      "Të tërhiqni pëlqimin dhe të menaxhoni preferencat e komunikimit", // Withdraw consent and manage communication preferences
    ],
  },
  {
    title: "Ndryshimet në këtë politikë", // Changes to This Policy
    paragraphs: [
      "Ne mund ta përditësojmë periodikisht këtë Politikë të Privatësisë për të pasqyruar ndryshimet ligjore ose operacionale.", // We may update this Privacy Policy periodically to reflect legal or operational changes.
      "Versioni i përditësuar do të publikohet në këtë faqe dhe vazhdimi i përdorimit të shërbimeve tona nënkupton pranimin e këtyre ndryshimeve.", // The updated version will be posted on this page and your continued use means acceptance of those changes.
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="flex-1 bg-slate-50">
      <PageHero
        title="Politika e Privatësisë" // Privacy Policy
        description="Mësoni se si Testora mbledh, përdor dhe mbron informacionin tuaj." // Learn how Testora collects, uses, and protects your information.
        className="from-primary/8"
      />

      <div className="app-container py-10">
        <article className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-8">
          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-3xl font-semibold text-slate-900">
                  {section.title}
                </h2>

                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mb-3 text-sm leading-relaxed text-slate-600"
                  >
                    {paragraph}
                  </p>
                ))}

                {!!section.bullets?.length && (
                  <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-xl border border-gray-200 bg-slate-50 p-4 sm:p-5">
            <h2 className="mb-3 text-2xl font-semibold text-slate-900">
              Informacioni i kontaktit
              {/* Contact Information */}
            </h2>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Email-i:</span>{" "}
              {/* Email: */}
              privacy@testora.com
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Mbështetja:</span>{" "}
              {/* Support: */}
              support@testora.com
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Adresa:</span>{" "}
              {/* Address: */}
              Testora Legal Department, 123 Education Street, Suite 400, San
              Francisco, CA 94105
            </p>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Telefoni:</span>{" "}
              {/* Phone: */}
              +1 (555) 123-4567
            </p>
          </section>
        </article>
      </div>
    </section>
  );
}