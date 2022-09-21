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
      <main className="flex flex-col items-start mx-auto px-[5%] md:w-3/4 lg:max-w-3xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
