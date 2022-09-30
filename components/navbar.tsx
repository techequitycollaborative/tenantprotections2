import styles from '@/styles/Home.module.css';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

function Navbar() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const [toggle, setToggle] = useState(false);

  const onSelect: React.ChangeEventHandler<HTMLSelectElement> =
    function onSelectLocale(e) {
      router.push({ pathname, query }, asPath, { locale: e.target.value });
    };

  return (
    <nav className="relative bg-blue">
      <div className="flex items-center justify-between">
        <img src="/img/logo.png" alt="warning icon" className="p-2 pr-0 h-12" />
        <div className="pt-2 pb-2">
          <Link href="/">
            <h1 className="text-2xl font-black text-white cursor-pointer">
              CTP
            </h1>
          </Link>
        </div>
        <div className="hidden text-xl space-x-12 ml-auto mr-16 lg:mr-32 xl:mr-64 text-white md:flex">
          <Link href="/calculator">{t('navbar.calculator')}</Link>
          <Link href="/eligibility">{t('navbar.eligibility')}</Link>
          <Link href="/resources">{t('navbar.resources')}</Link>
          <Link href="/about">{t('navbar.about')}</Link>
          <select
            onChange={onSelect}
            defaultValue={i18n.language}
            className="text-blue outline-none border-2 border-white rounded bg-white px-2 text-blue"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>
        <button
          id="menu-btn"
          className={`hamburger block focus:outline-none md:hidden ${
            toggle ? 'open' : ''
          }`}
          onClick={() => setToggle(!toggle)}
        >
          <span className="hamburger-top"></span>
          <span className="hamburger-middle"></span>
          <span className="hamburger-bottom"></span>
        </button>
      </div>

      <div className="md:hidden">
        <div
          id="menu"
          className={`absolute text-xl left-20 right-0 flex-col items-center space-y-6 self-end z-10 bg-gray-50 drop-shadow-xl py-8 sm:w-auto sm:self-center ${
            toggle ? 'flex' : 'hidden'
          }`}
        >
          <Link href="/calculator">{t('navbar.calculator')}</Link>
          <Link href="/eligibility">{t('navbar.eligibility')}</Link>
          <Link href="/resources">{t('navbar.resources')}</Link>
          <Link href="/about">{t('navbar.about')}</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
