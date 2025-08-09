import React from 'react'

// Admin Imports

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
  MdTaskAlt,
} from 'react-icons/md';

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: 'default',
    icon: <MdHome className="size-6" />,
  },
  // {
  //   name: 'NFT Marketplace',
  //   layout: '/admin',
  //   path: 'nft-marketplace',
  //   icon: <MdOutlineShoppingCart className="size-6"/>,

  //   secondary: true,
  // },
  // {
  //   name: 'Data Tables',
  //   layout: '/admin',
  //   icon: <MdBarChart className="size-6"/>,
  //   path: 'data-tables',
  // },
  {
    name: 'Profile',
    layout: '/admin',
    path: 'profile',
    icon: <MdPerson className="h-6 w-6"/>,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: 'sign-in',
    icon: <MdLock className="h-6 w-6" />,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: 'customers',
    icon: <MdPerson className="h-6 w-6" />,
  },
  {
    name: "Tasks",
    path: "tasks",
    layout: "/admin",
    icon: <MdTaskAlt className="size-6"/>
  },
  {
    name: "Task Manager",
    path: "task-manager",
    layout: "/admin",
    icon: <MdTaskAlt className="size-6"/>
  }
]
export default routes