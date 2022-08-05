import styles from '@/styles/Home.module.css';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';

function Navbar() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { pathname, asPath, query } = router;

  const onSelect: React.ChangeEventHandler<HTMLSelectElement> =
    function onSelectLocale(e) {
      router.push({ pathname, query }, asPath, { locale: e.target.value });
    };

  return (
    <div className={styles.navbar}>
      <Link href="/calculator">{t('navbar.calculator')}</Link>
      <Link href="/eligibility">{t('navbar.eligibility')}</Link>
      <Link href="/resources">{t('navbar.resources')}</Link>
      <Link href="/about">{t('navbar.about')}</Link>
      <select onChange={onSelect} defaultValue={i18n.language}>
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}

export default Navbar;
