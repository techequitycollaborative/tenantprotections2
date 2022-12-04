import styles from '@/styles/Home.module.css';
import Image from 'next/image';
import { useState } from 'react';

interface Props {
  text: string;
  visible: boolean;
}

export default function Banner({ text, visible, ...props }: Props) {
  const [visibility, setVisibility] = useState(visible);
  const removeElement = () => {
    setVisibility(false);
  };
  return visibility ? (
    <div className={styles.banner}>
      <div className="flex items-center ml-auto">
        <div className="w-5 h-5 relative items-center mr-2">
          <Image
            src="/img/banner-icon.svg"
            alt="Information icon"
            layout="fill"
            objectFit="cover"
            width="24px"
          />
        </div>
        <p>{text}</p>
      </div>
      <div className="w-4 h-4 relative items-center ml-auto mr-6">
        <button onClick={removeElement}>
          <Image
            src="/img/banner-x.svg"
            alt="X button to close canner"
            layout="fill"
            objectFit="cover"
          />
        </button>
      </div>
    </div>
  ) : (
    <div></div>
  );
}
