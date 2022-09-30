import styles from '@/styles/Home.module.css';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className={styles.footer + ' bg-blue'}>
      <div>
        <p className="text-white">{t('footer.text')}</p>
        <span className="font-black text-white">
          <Link href="/about">{t('footer.link-text')}</Link>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
