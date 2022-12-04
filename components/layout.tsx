import { ReactNode } from 'react';
import Header from './header';
import Navbar from './navbar';
import Footer from './footer';
import Banner from './banner';
import styles from '@/styles/Home.module.css';

interface Props {
  children?: ReactNode;
  banner?: ReactNode;
}

export default function Layout({ children, banner, ...props }: Props) {
  return (
    <div className={styles.container}>
      <Header />
      <Navbar />
      {banner}

      <main
        className={
          styles.main +
          ' flex flex-col items-start mx-auto px-[5%] md:w-3/4 lg:max-w-3xl'
        }
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
