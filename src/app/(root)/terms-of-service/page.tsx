import PageHero from "@/components/common/PageHero";

const sections = [
  {
    title: "Hyrje", // Introduction
    paragraphs: [
      "Mirë se vini në Testora, një platformë arsimore që ofron shërbime të mësimit online, aplikacione celulare dhe një treg online për burime arsimore.", // Welcome to Testora, an educational platform providing online learning services, mobile applications, and a marketplace for educational resources.
      "Duke hyrë në Testora ose duke e përdorur atë, ju pranoni këto Kushte. Nëse nuk jeni dakord me ndonjë pjesë të këtyre Kushteve, ju lutemi mos i përdorni shërbimet tona.", // By accessing or using Testora, you agree to these Terms. If you disagree with any part of these Terms, please do not use our services.
    ],
  },
  {
    title: "Pranimi i kushteve", // Acceptance of Terms
    paragraphs: [
      "Duke krijuar një llogari, duke hyrë në faqen tonë të internetit ose duke përdorur aplikacionet tona celulare, ju konfirmoni se i keni lexuar dhe kuptuar këto Kushte dhe Politikën tonë të Privatësisë, si dhe pranoni të jeni të detyruar prej tyre.", // By creating an account, accessing our website, or using our mobile applications, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
    ],
  },
  {
    title: "Përdorimi i platformës", // Use of the Platform
    paragraphs: [
      "Testora ju jep një licencë të kufizuar, joekskluzive dhe të patransferueshme për të hyrë në platformën tonë dhe për ta përdorur atë për qëllime personale arsimore.", // Testora grants you a limited, non-exclusive, non-transferable license to access and use our platform for personal educational purposes.
      "Ju nuk mund ta përdorni platformën tonë për qëllime të paligjshme ose të paautorizuara, apo në ndonjë mënyrë që mund të dëmtojë, çaktivizojë ose pengojë shërbimet tona.", // You may not use our platform for illegal or unauthorized purposes, or in any way that may damage, disable, or impair our services.
    ],
  },
  {
    title: "Përdorimi i faqes së internetit dhe aplikacionit celular", // Website and Mobile App Usage
    bullets: [
      "Duhet të përdorni një shfletues ose pajisje të mbështetur", // You must use a supported browser or device
      "Jeni përgjegjës për të siguruar lidhjen me internetin", // You are responsible for maintaining internet connectivity
      "Duhet ta mbani aplikacionin celular të përditësuar me versionin më të fundit", // You must keep your mobile app updated to the latest version
      "Veçoritë e platformës mund të ndryshojnë ndërmjet versionit në internet dhe atij celular", // Platform features may vary between web and mobile versions
    ],
  },
  {
    title: "Llogaritë dhe regjistrimi", // Accounts and Registration
    bullets: [
      "Duhet të jepni informacion të saktë dhe të plotë", // You must provide accurate and complete information
      "Jeni përgjegjës për sigurinë e llogarisë suaj", // You are responsible for maintaining account security
      "Duhet të na njoftoni menjëherë për çdo përdorim të paautorizuar të llogarisë", // You must notify us immediately of unauthorized account use
      "Nuk mund t'i ndani të dhënat tuaja të hyrjes me persona të tjerë", // You may not share your credentials with others
    ],
  },
  {
    title: "Paketat dhe qasja në aplikacionin celular", // Packages and Mobile App Access
    bullets: [
      "Qasja fillon pasi blerja juaj të konfirmohet", // Access starts after your purchase is confirmed
      "Kohëzgjatja e paketës dhe veçoritë e përfshira varen nga paketa që keni zgjedhur", // Package duration and included features depend on your selected package
      "Abonimet mund të rinovohen automatikisht, përveç rastit kur anulohen përpara rinovimit", // Subscriptions may auto-renew unless canceled before renewal
      "Rimbursimet janë subjekt i politikës sonë të rimbursimit", // Refunds are subject to our refund policy
    ],
  },
  {
    title: "Blerjet në tregun online", // Marketplace Purchases
    bullets: [
      "Transaksionet kryhen ndërmjet blerësve dhe shitësve", // Transactions are between buyers and sellers
      "Shitësit janë përgjegjës për cilësinë e produkteve dhe dorëzimin e tyre", // Sellers are responsible for product quality and delivery
      "Mosmarrëveshjet duhet të zgjidhen fillimisht me shitësin", // Disputes should first be resolved with the seller
      "Të gjitha shitjet i nënshtrohen kushteve specifike të shitësit", // All sales are subject to seller-specific terms and conditions
    ],
  },
  {
    title: "Përgjegjësitë e përdoruesit", // User Responsibilities
    bullets: [
      "Të jepni informacion të saktë dhe të vërtetë", // Provide accurate and truthful information
      "Të respektoni të drejtat e pronësisë intelektuale", // Respect intellectual property rights
      "Të ruani sjellje të përshtatshme gjatë ndërveprimeve në platformë", // Maintain appropriate behavior in platform interactions
      "Të raportoni shkeljet ose problemet e sigurisë", // Report violations or security issues
    ],
  },
  {
    title: "Përdorimi i ndaluar", // Prohibited Use
    bullets: [
      "Shkelja e ligjeve ose rregulloreve", // Violating laws or regulations
      "Shpërndarja e programeve keqdashëse ose kodeve të dëmshme", // Distributing malware or harmful code
      "Përpjekja për qasje të paautorizuar në sisteme ose të dhëna", // Attempting unauthorized access to systems or data
      "Publikimi i informacionit të rremë ose mashtrues", // Posting false or misleading information
    ],
  },
  {
    title: "Kufizimi i përgjegjësisë", // Limitation of Liability
    paragraphs: [
      "Në masën maksimale të lejuar nga ligji, Testora dhe subjektet e lidhura me të nuk mbajnë përgjegjësi për dëme të tërthorta, rastësore, të veçanta ose pasuese.", // To the maximum extent permitted by law, Testora and its affiliates shall not be liable for indirect, incidental, special, or consequential damages.
      "Përgjegjësia jonë totale nuk do të tejkalojë shumën që i keni paguar Testora-s gjatë dymbëdhjetë muajve përpara paraqitjes së kërkesës.", // Our total liability shall not exceed the amount you paid to Testora in the twelve months preceding the claim.
    ],
  },
  {
    title: "Përfundimi ose pezullimi i qasjes", // Termination or Suspension
    paragraphs: [
      "Ne mund ta pezullojmë ose ta përfundojmë qasjen në Testora në rast të shkeljes së këtyre Kushteve, veprimtarive mashtruese ose keqpërdorimit të shërbimeve tona.", // We may suspend or terminate access to Testora for violations of these Terms, fraudulent activities, or abuse of our services.
    ],
  },
  {
    title: "Ndryshimet në kushte", // Changes to the Terms
    paragraphs: [
      "Ne mund t'i përditësojmë këto Kushte herë pas here. Ndryshimet e rëndësishme do të publikohen në këtë faqe së bashku me datën e përditësuar të hyrjes në fuqi.", // We may update these Terms from time to time. Material changes will be posted on this page with the updated effective date.
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <section className="flex-1 bg-slate-50">
      <PageHero
        title="Kushtet e shërbimit" // Terms of Service
        description="Ju lutemi, lexoni me kujdes këto kushte përpara se të përdorni Testora." // Please read these terms carefully before using Testora.
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

         
        </article>
      </div>
    </section>
  );
}