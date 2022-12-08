import Head from 'next/head';

const Header = () => {
  return (
    <Head>
      <title>Tenant Protections</title>
      <meta
        name="description"
        content="A tool for California tenants to understand their rights under state and local rent control"
      />
      <meta
        name="twitter:image:alt"
        content="Tenant pressing buttons on calculator"
      />
      <meta
        name="twitter:image"
        content="https://tenantprotections.org/img/calculator.png"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Tenant Protections" />
      <meta
        property="og:description"
        content="A tool for California tenants to understand their rights under state and local rent control"
      />
      <meta
        property="og:image"
        content="https://tenantprotections.org/img/calculator.png"
      />
      <meta property="og:site_name" content="Tenant Protections" />
      <meta property="og:url" content="https://tenantprotections.org" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Tenant Protections" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Header;
