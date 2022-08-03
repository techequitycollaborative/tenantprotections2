import Head from 'next/head';

const Header = () => {
  return (
    <Head>
      <title>Tenant Protections</title>
      <meta
        name="description"
        content="A tool for California tenants to understand their rights under state and local rent control"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Header;
