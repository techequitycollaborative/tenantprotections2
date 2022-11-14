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
        <Link href="/">
          <img
            src="/img/logo.png"
            alt="warning icon"
            className="p-2 pr-0 h-12 cursor-pointer"
          />
        </Link>
        <div className="pt-2 pb-2">
          <Link href="/">
            <h1 className="text-2xl font-black text-white cursor-pointer">
              CTP
            </h1>
          </Link>
        </div>
        <div className="hidden text-xl space-x-12 ml-auto mr-16 lg:mr-32 xl:mr-64 text-white md:flex pt-1">
          <Link href="/eligibility">{t('navbar.eligibility')}</Link>
          <Link href="/calculator">{t('navbar.calculator')}</Link>
          <Link href="/resources">{t('navbar.resources')}</Link>
          <Link href="/about">{t('navbar.about')}</Link>
          <select
            onChange={onSelect}
            defaultValue={i18n.language}
            className="text-blue text-lg outline-none border-2 border-white rounded bg-white px-2 text-blue"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>
        <div className="md:hidden">
          <select
            onChange={onSelect}
            defaultValue={i18n.language}
            className="absolute right-16 top-2 text-blue text-lg outline-none border-2 border-white rounded bg-white px-2 text-blue"
          >
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
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
      </div>

      <div className="md:hidden">
        <div
          id="menu"
          className={`absolute text-xl z-20 left-20 right-0 flex-col items-center space-y-6 self-end bg-gray-50 drop-shadow-xl py-8 sm:w-auto sm:self-center ${
            toggle ? 'flex' : 'hidden'
          }`}
        >
          <Link href="/eligibility">{t('navbar.eligibility')}</Link>
          <Link href="/calculator">{t('navbar.calculator')}</Link>
          <Link href="/resources">{t('navbar.resources')}</Link>
          <Link href="/about">{t('navbar.about')}</Link>
        </div>
      </div>
      <div
        className={`z-10 w-screen h-screen fixed left-0 ${
          toggle ? 'flex' : 'hidden'
        }`}
        onClick={() => setToggle(!toggle)}
      ></div>
    </nav>
  );
}

export default Navbar;
