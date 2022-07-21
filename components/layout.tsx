import { ReactNode } from 'react';
import Header from './header';
import Navbar from './navbar';
import Footer from './footer';
import styles from '@/styles/Home.module.css';

interface Props {
  children?: ReactNode;
}

export default function Layout({ children, ...props }: Props) {
  return (
    <div className={styles.container}>
      <Header />
      <Navbar />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
