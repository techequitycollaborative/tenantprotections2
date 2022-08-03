import styles from '@/styles/Home.module.css';
import { useTranslation } from 'next-i18next';

function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className={styles.footer}>
      <div>
        <p>{t('footer')}</p>
      </div>
    </footer>
  );
}

export default Footer;
