import React, { useContext } from 'react';
import Dropdown from 'components/dropdown';
import { FiAlignJustify } from 'react-icons/fi';
import NavLink from 'components/link/NavLink';
import navbarimage from '/public/img/layout/Navbar.png';
import { BsArrowBarUp } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
// import { RiMoonFill, RiSunFill } from 'react-icons/ri';
// import Configurator from './Configurator';
import {
  IoMdNotificationsOutline,
  IoMdInformationCircleOutline,
} from 'react-icons/io';
import avatar from '/public/img/avatars/avatar4.png';
import Image from 'next/image';
import { useAuth } from 'contexts/AuthContext';
import { useRouter } from 'next/navigation';
import UserProfileModal from 'components/profile/UserProfileModal';
import { NotificationContext } from '../../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationSection from './Notification';

// Helper to get user initial
function getUserInitial(user) {
  if (user?.first_name) return user.first_name[0].toUpperCase();
  if (user?.email) return user.email[0].toUpperCase();
  return '?';
}

const Navbar = (props: {
  onOpenSidenav: () => void;
  brandText: string;
  secondary?: boolean | string;
  [x: string]: any;
}) => {
  const { onOpenSidenav, brandText, mini, hovered } = props;
  const [scroll, setScroll] = React.useState<boolean>(false);
  const [darkmode, setDarkmode] = React.useState(
    document.body.classList.contains('dark')
  )
  const { user, logout } = useAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = React.useState(false);
  const { notifications, markAllRead } = useContext(NotificationContext);

  React.useEffect(() =>{
    const scrollHandler= () =>{
      const threshold = window.innerWidth > 720 ? 90 : 150
      const isScrolled= window.scrollY> threshold
      if (isScrolled !== scroll) setScroll(isScrolled)
    }

    window.addEventListener("scroll", scrollHandler)
    return () =>{
      window.removeEventListener("scroll", scrollHandler)
    }
  }, [scroll])
  
  return (
    <>
      <nav
        className={`flex flex-col gap-2 z-50 w-full p-3 sm:p-4 md:flex-row md:items-center md:justify-between md:rounded-lg md:p-6`}
        style={{ position: 'relative', top: 0, left: 0, right: 0, background: 'inherit', backdropFilter: 'blur(8px)' }}
      >
        <div className={`text-navy-700 dark:text-white mb-2 md:mb-0`}>
          <span className="text-xs font-normal space-x-1 md:text-sm">
            <a
              href=""
              className="hover:underline"
            >
              Pages
            </a>
            <span>/</span>
            <NavLink
              href="#"
              className="capitalize hover:underline"
            >
              {brandText}
            </NavLink>
          </span>
          <p className="text-xl font-bold capitalize md:text-[33px]">
            <NavLink href="#">
              {brandText}
            </NavLink>
          </p>
        </div>

        <span className="flex h-12 items-center w-full gap-x-2 px-2 rounded-lg bg-white py-1 shadow-md shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none sm:w-fit md:h-14 md:rounded-full md:py-2 md:shadow-xl">
          <span className="flex h-full items-center rounded-lg px-2 space-x-1 bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white md:rounded-full md:space-x-2">
            <FiSearch className="size-4 text-gray-400"/>
            <input
              type="search"
              placeholder="Search..."
              className="rounded-lg w-20 bg-lightPrimary text-xs font-medium outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:placeholder:!text-white md:rounded-full md:w-24 md:text-sm"
            />
          </span>
          <FiAlignJustify
            onClick={onOpenSidenav}
            className="size-5 cursor-pointer text-gray-600 dark:text-white md:xl:hidden"
          />
          {/* start Notification */}
          <NotificationSection/>
          <button
            className="cursor-pointer size-4 text-gray-600 dark:text-white"
            onClick={() =>{
              if (darkmode) {
                document.body.classList.remove('dark');
                setDarkmode(false);
              }else {
                document.body.classList.add('dark');
                setDarkmode(true);
              }
            }}
          >
            {darkmode ? (
              <RiSunFill/>
            ) : (
              <RiMoonFill/>
            )}
          </button>
          {/* Profile & Dropdown */}
          <Dropdown
            button={
              user ? (
                <div className="rounded-full bg-green-500 w-8 h-8 flex items-center justify-center text-white text-base font-bold cursor-pointer md:w-10 md:h-10 md:text-lg">
                  {getUserInitial(user)}
                </div>
              ) : (
                <Image
                  width={32}
                  height={32}
                  src={avatar}
                  alt="Profile"
                  className="rounded-full object-cover cursor-pointer size-8 md:w-10 md:h-10"
                />
              )
            }
            classNames="top-8 -left-[120px] md:-left-[180px]"
          >
            <div className="w-40 rounded-xl px-3 py-2 space-y-2 bg-white shadow-md shadow-shadow-500 dark:!bg-navy-700 text-xs dark:text-white dark:shadow-none md:w-56 md:rounded-[20px] md:px-4 md:py-3 md:space-y-3 md:text-sm md:shadow-xl">
              <p className="font-bold text-navy-700 dark:text-white">
                👋 Hey, {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.first_name || user?.username || user?.email?.split('@')[0] || 'User'}
              </p>
              <hr/>
              <a
                href="#"
                className="text-gray-800 dark:text-white block"
                onClick={e => { e.preventDefault(); setTimeout(() => setProfileOpen(true), 100); }}
              >
                Profile Settings
              </a>
              <a
                href=""
                className="text-gray-800 dark:text-white block"
              >
                Newsletter Settings
              </a>
              <button
                onClick={() => {
                  logout();
                  router.push('/auth/sign-in');
                }}
                className="font-medium text-red-500 block w-full text-left"
              >
                Log Out
              </button>
            </div>
          </Dropdown>
        </span>
      </nav>
      <AnimatePresence>
        {scroll && (
          <motion.span
            key="fixed-avatar"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='bg-white p-2 shadow-lg fixed right-12 top-11 z-10 rounded-full'
            style={{ overflow: 'visible' }}
          >
            <Dropdown
              button={
                user ? (
                  <div className="rounded-full bg-green-500 w-10 h-10 flex items-center justify-center text-white text-lg font-bold cursor-pointer">
                    {getUserInitial(user)}
                  </div>
                ) : (
                  <Image
                    width={45}
                    height={45}
                    src={avatar}
                    alt="Profile"
                    className="rounded-full object-cover cursor-pointer"
                  />
                )
              }
              classNames="top-8 right-8"
            >
              <div className="w-56 rounded-[20px] px-4 py-3 space-y-3 bg-white shadow-xl shadow-shadow-500 dark:!bg-navy-700 text-sm dark:text-white dark:shadow-none">
                <p className="font-bold text-navy-700 dark:text-white">
                  👋 Hey, {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.first_name || user?.username || user?.email?.split('@')[0] || 'User'}
                </p>
                <hr/>
                <a
                  href="#"
                  className="text-gray-800 dark:text-white block"
                  onClick={e => { e.preventDefault(); setTimeout(() => setProfileOpen(true), 100); }}
                >
                  Profile Settings
                </a>
                <a
                  href=""
                  className="text-gray-800 dark:text-white block"
                >
                  Newsletter Settings
                </a>
                <button
                  onClick={() => {
                    logout();
                    router.push('/auth/sign-in');
                  }}
                  className="font-medium text-red-500 block w-full text-left"
                >
                  Log Out
                </button>
              </div>
            </Dropdown>
          </motion.span>
        )}
      </AnimatePresence>
      <UserProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} user={user} />
    </>
  )
}

export default Navbar