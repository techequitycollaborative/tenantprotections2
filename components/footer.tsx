import styles from '@/styles/Home.module.css';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className={styles.footer}>
      <div>
        <p>
          {t('footer.text')}
          <Link href="/about">{t('footer.link-text')}</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
