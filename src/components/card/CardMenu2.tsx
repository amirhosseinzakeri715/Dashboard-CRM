// components/card/CardMenu2.tsx
import React from 'react';
import Dropdown from 'components/dropdown';
import { AiOutlineUser } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { AiOutlineShop } from 'react-icons/ai';
import { TiLightbulb } from 'react-icons/ti';
import { BsThreeDotsVertical } from 'react-icons/bs';

function CardMenu2(props: { 
  transparent?: boolean; 
  vertical?: boolean;
  sort
  onSort: (key: 'country' | 'lead_score' | 'industry_category') => void;
}) {
  const { transparent, vertical, onSort, sort } = props;
  const [open, setOpen] = React.useState(false);
  
  return (
    <Dropdown
      button={
        <button
          onClick={() => setOpen(!open)}
          className={`flex items-center text-xl hover:cursor-pointer ${
            transparent
              ? 'bg-none text-white hover:bg-none active:bg-none'
              : vertical
              ? 'bg-none text-navy-700 dark:text-white'
              : 'bg-lightPrimary p-2 text-green-500 hover:bg-gray-100 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10'
          } linear justify-center rounded-lg font-bold transition duration-200`}
        >
          {vertical ? (
            <p className="text-[24px] hover:cursor-pointer">
              <BsThreeDotsVertical />
            </p>
          ) : (
            <BsThreeDots className="h-6 w-6" />
          )}
        </button>
      }
      animation={'origin-top-right transition-all duration-300 ease-in-out'}
      classNames={`${transparent ? 'top-8' : 'top-11'} right-0 w-max`}
    >
      <div className="z-50 w-max rounded-xl bg-white py-3 space-y-2 text-sm shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <p 
          className={`hover:text-black flex cursor-pointer px-4 items-center gap-2 text-gray-600 ${sort.key==="country" && "bg-gray-50"}`}
          onClick={() => {
            onSort('country');
            setOpen(false);
          }}
        >
          <span>
            <AiOutlineUser />
          </span>
          Country
        </p>
        <p 
          className={`hover:text-black flex cursor-pointer px-4 items-center gap-2 text-gray-600 ${sort.key==="lead_score" && "bg-gray-50"}`}
          onClick={() => {
            onSort('lead_score');
            setOpen(false);
          }}
        >
          <span>
            <AiOutlineShop />
          </span>
          Score
        </p>
        <p 
          className={`hover:text-black flex cursor-pointer px-4 items-center gap-2 text-gray-600 ${sort.key==="industry_category" && "bg-gray-50"}`}
          onClick={() => {
            onSort('industry_category');
            setOpen(false);
          }}
        >
          <span>
            <TiLightbulb />
          </span>
          Industry
        </p>
      </div>
    </Dropdown>
  );
}

export default CardMenu2;