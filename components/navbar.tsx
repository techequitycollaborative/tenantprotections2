import styles from '@/styles/Home.module.css';
import Image from 'next/image';
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
          <div className="p-2 pr-0 h-12 cursor-pointer">
            <Image
              src="/img/logo.png"
              alt="Tenant Protections logo"
              width="32"
              height="32"
            />
          </div>
        </Link>
        <div className="pt-1 pb-1 md:ml-2">
          <Link href="/">
            <h1 className="text-xl mr-4 md:text-2xl md:mr-0 font-black text-white cursor-pointer">
              Tenant Protections
            </h1>
          </Link>
        </div>
        <div className="hidden text-xl space-x-8 ml-auto mr-4 text-white pb-1 md:flex pt-1">
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
