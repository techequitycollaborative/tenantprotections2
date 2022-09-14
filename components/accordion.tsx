import { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface Props {
  title: string;
  content: string;
}

const Accordion: NextPage<Props> = function Accordion(props) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="my-8 mx-auto w-full">
      <div
        className={`flex flex-row justify-between cursor-pointer mx-auto py-4 px-5 bg-gray-lighter ${
          isActive ? 'rounded-t' : 'rounded'
        }`}
        onClick={() => setIsActive(!isActive)}
      >
        <h3 className="text-gray-darkest">{props.title}</h3>
        <div>
          {isActive ? (
            <FontAwesomeIcon
              icon={faChevronDown}
              className="rotate-360 ease-linear duration-150"
            />
          ) : (
            <FontAwesomeIcon
              icon={faChevronDown}
              className="rotate-180 ease-linear duration-150"
            />
          )}
        </div>
      </div>
      {isActive && (
        <div className="pb-4 px-5 text-gray-darkest bg-gray-lighter rounded-b">
          {props.content}
        </div>
      )}
    </div>
  );
};

export default Accordion;
