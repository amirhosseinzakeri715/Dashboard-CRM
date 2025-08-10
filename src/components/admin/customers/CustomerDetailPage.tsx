'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Card from 'components/card';
import {
  getCustomer,
  CustomerResponse,
  deleteCustomer,
  updateCustomer,
  Customer,
} from 'utils/api';
import { getTasks, createTask, updateTask, deleteTask as deleteTaskAPI } from 'apis/tasks.api';
import { Task as APITask } from 'types/task';
import AddTaskModal from './AddTaskModal';
import AddMeetingModal from './AddMeetingModal';
import CustomerWizardModal from './CustomerWizardModal';
import ContactWizardModal, { ContactRow } from './ContactWizardModal';
import ContactInfoCard from './ContactInfoCard';
import { getContacts, createContact, updateContact, deleteContact } from 'apis/contacts.api';
import CustomerProductsSection from './CustomerProductsSection';
import CustomerInteractionsSection from './CustomerInteractionsSection';
import Upload from '../profile/Upload';
import ContactDetailModal from './ContactDetailModal';
import OpportunitiesSection from './OpportunitiesSection';
import FormMessage from 'components/fields/FormMessage';
import { extractApiErrorMessage } from 'utils/errorHandler';
import DeleteConfirmationModal from 'components/fields/DeleteConfirmationModal';
import { getMeetings, createMeeting, updateMeeting, deleteMeeting } from 'apis/meetings.api';
import { Meeting, MeetingCreateRequest, MeetingUpdateRequest } from 'types/meeting';
import MeetingDetailModal from 'components/admin/customers/MeetingDetailModal';
import MeetingEditModal from './MeetingEditModal';
import TaskDetailModal from './TaskDetailModal';
import { fetchUsersList } from 'apis/users.api';
// Use the local User interface for type assertion in this file
interface User {
  id: number;
  email: string;
  full_name: string;
  [key: string]: any;
}import { useQuery } from '@tanstack/react-query';
import { convertJsonToCsv } from 'utils/jsonToCsv';
import { CiExport } from "react-icons/ci";
import * as XLSX from 'xlsx'
import Pagination from 'components/common/Pagination';
import MeetingCards from './MeetingCards';
import { MdViewList, MdViewModule } from 'react-icons/md';
import TaskTable from './TaskTable';
import { exportCompaniesById } from 'apis/export.api';


interface CustomerDetailPageProps {
  customerId: number;
}



export default function CustomerDetailPage({
  customerId,
}: CustomerDetailPageProps) {
  const [customer, setCustomer] = useState<CustomerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [meetingsLoading, setMeetingsLoading] = useState(true);
  const [meetingError, setMeetingError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<ContactRow[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactModalMode, setContactModalMode] = useState<'add' | 'edit'>('add');
  const [selectedContact, setSelectedContact] = useState<ContactRow | null>(null);
  const [showContactDetailModal, setShowContactDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedMeetingDetail, setSelectedMeetingDetail] = useState<Meeting | null>(null);
  const [editMeeting, setEditMeeting] = useState<Meeting | null>(null);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<APITask | null>(null);
  const router = useRouter();
  const [tasks, setTasks] = useState<APITask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<APITask | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [uiError, setUiError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ type: string, payload?: any } | null>(null);
  const [contactAddError, setContactAddError] = useState<string | null>(null);
  const [contactEditError, setContactEditError] = useState<string | null>(null);
  const [addTaskError, setAddTaskError] = useState<string | null>(null);
  const [deleteCustomerError, setDeleteCustomerError] = useState<string | null>(null);
  const [deleteContactError, setDeleteContactError] = useState<string | null>(null);
  const [deleteTaskError, setDeleteTaskError] = useState<string | null>(null);
  const [deleteCustomerLoading, setDeleteCustomerLoading] = useState(false);
  const [deleteContactLoading, setDeleteContactLoading] = useState(false);
  const [deleteTaskLoading, setDeleteTaskLoading] = useState(false);

  const { data } = useQuery({
    queryKey: ["exportById"],
    queryFn: () => exportCompaniesById(customerId),
    refetchOnWindowFocus: false
  })

  const handleExport = (section) => {
  return () => {
    if (!data) return;

    let csvData, fields, filename;

    switch (section) {
      case 'contacts':
        fields = ['id', 'full_name', 'position', 'company_email', 'phone_mobile', "address", "company_id", "customer_specific_conditions", "personal_email", "phone_office"];
        csvData = convertJsonToCsv(data.contacts, fields);
        filename = 'contacts.csv';
        break;
      case 'products':
        fields = ['id', 'category', 'target_price', 'payment_terms', "company_id", "delivery_terms", "packaging", "price_list", "price_list_expiry", "product_specifications", "volume_offered"];
        csvData = convertJsonToCsv(data.products, fields);
        filename = 'products.csv';
        break;
      case 'opportunities':
        fields = ['id', 'stage', 'expected_value', 'expected_close_date', "stage", "company_id"];
        csvData = convertJsonToCsv(data.opportunities, fields);
        filename = 'opportunities.csv';
        break;
      case "meetings":
        fields = ["attachment", "id", "date", "company", "report", "attendees"];
        csvData = convertJsonToCsv(data.meetings, fields);
        filename = 'meetings.csv';
        break;
        case "tasks":
        fields = ["created_at", "id", "created_by", "company", "description", "due_date", "interaction", "opportunity", "priority", "status", "title", "updated_at"];
        csvData = convertJsonToCsv(data.tasks, fields);
        filename = 'tasks.csv';
        break;
        case "interactions":
        fields = ["id", "assigned_to_id", "company_id", "contact_id", "date", "documents", "status", "summary", "type"];
        csvData = convertJsonToCsv(data.tasks, fields);
        filename = 'interactions.csv';
        break;
      default:
        return;
    }

    if (csvData) {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
  }
}

const handleExportAllToExcel = () => {
  if (!data) return;

  const wb = XLSX.utils.book_new();

  // تعریف ساختارهای پیش‌فرض برای هر بخش
  const defaultStructures = {
    contacts: [
      {
        id: '',
        full_name: '',
        position: '',
        company_email: '',
        phone_mobile: '',
        address: '',
        company_id: '',
        customer_specific_conditions: '',
        personal_email: '',
        phone_office: ''
      }
    ],
    products: [
      {
        id: '',
        category: '',
        target_price: '',
        payment_terms: '',
        company_id: '',
        delivery_terms: '',
        packaging: '',
        price_list: '',
        price_list_expiry: '',
        product_specifications: '',
        volume_offered: ''
      }
    ],
    opportunities: [
      {
        id: '',
        stage: '',
        expected_value: '',
        expected_close_date: '',
        company_id: ''
      }
    ],
    meetings: [
      {
        attachment: '',
        id: '',
        date: '',
        company: '',
        report: '',
        attendees: ''
      }
    ],
    tasks: [
      {
        created_at: '',
        id: '',
        created_by: '',
        company: '',
        description: '',
        due_date: '',
        interaction: '',
        opportunity: '',
        priority: '',
        status: '',
        title: '',
        updated_at: ''
      }
    ],
    interactions: [
      {
        id: '',
        assigned_to_id: '',
        company_id: '',
        contact_id: '',
        date: '',
        documents: '',
        status: '',
        summary: '',
        type: ''
      }
    ]
  };

  const sections = [
    { name: 'contacts', data: data.contacts?.length ? data.contacts : defaultStructures.contacts },
    { name: 'products', data: data.products?.length ? data.products : defaultStructures.products },
    { name: 'opportunities', data: data.opportunities?.length ? data.opportunities : defaultStructures.opportunities },
    { name: 'meetings', data: data.meetings?.length ? data.meetings : defaultStructures.meetings },
    { name: 'tasks', data: data.tasks?.length ? data.tasks : defaultStructures.tasks },
    { name: 'interactions', data: data.interactions?.length ? data.interactions : defaultStructures.interactions }
  ];

  sections.forEach(section => {
    if (section.data) {
      const ws = XLSX.utils.json_to_sheet(section.data);
      XLSX.utils.book_append_sheet(wb, ws, section.name.charAt(0).toUpperCase() + section.name.slice(1));
    }
  });

  XLSX.writeFile(wb, `Customer${customerId}-details.xlsx`);
};


  // Fetch meetings from API
  const fetchMeetings = async (companyId: number) => {
    try {
      setMeetingsLoading(true);
      const data = await getMeetings(companyId);
      setMeetings(data);
      setMeetingError(null);
    } catch (err: any) {
      setMeetingError('Failed to load meetings.');
      setMeetings([]);
    } finally {
      setMeetingsLoading(false);
    }
  };

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const allTasks = await getTasks();
      // Robust filter: ensure both are numbers
      const filtered = allTasks.filter(task => Number(task.company) === Number(customer?.id));
      // Hydrate assigned_to for each task
      const hydrated = filtered.map(task => {
        if ((!task.assigned_to || !task.assigned_to.full_name) && task.assigned_to_id && users.length > 0) {
          const user = users.find(u => u.id === task.assigned_to_id);
          if (user) {
            return {
              ...task,
              assigned_to: {
                id: user.id,
                email: user.email,
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
                company: user.company || null,
                company_name: (user as any).company_name || '',
              }
            };
          }
          return { ...task, assigned_to: null };
        }
        return task;
      });
      setTasks(hydrated);
    } catch (err) {
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const customerData = await getCustomer(customerId);
        setCustomer(customerData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch customer:', err);
        setError('Failed to load customer details.');
      } finally {
        setLoading(false);
      }
    };

    const fetchContacts = async () => {
      try {
        setContactsLoading(true);
        const contactsData = await getContacts(customerId);
        console.log('API contactsData:', contactsData); // Debug log
        // Filter contacts by company_id to ensure only this customer's contacts are shown
        const filteredContacts = contactsData.filter(
          (contact) => Number(contact.company_id) === Number(customerId)
        );
        setContacts(filteredContacts);
      } catch (err) {
        setContacts([]);
      } finally {
        setContactsLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const usersData = await fetchUsersList();
        setUsers(usersData);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    if (customerId) {
      fetchCustomer();
      fetchContacts();
      fetchUsers();
    }
  }, [customerId]);

  useEffect(() => {
    console.log('COMPANY BEFORE FETCH:', customer?.id);
    if (customer?.id) {
      fetchMeetings(customer.id);
    }
  }, [customer?.id]);

  useEffect(() => {
    if (customer?.id) {
      fetchTasks();
    }
  }, [customer?.id]);

  const handleBack = () => {
    router.push('/admin/customers');
  };

  const handleDeleteCustomer = async () => {
    if (!customer) return;
    setConfirmModal({ type: 'deleteCustomer' });
  };
  const confirmDeleteCustomer = async () => {
    try {
      setDeleteCustomerLoading(true);
      await deleteCustomer(customer.id);
      router.push('/admin/customers');
    } catch (err: any) {
      setDeleteCustomerError(err?.message || 'Failed to delete customer. Please try again.');
    } finally {
      setConfirmModal(null);
      setDeleteCustomerLoading(false);
    }
  };

  const handleEditCustomer = async (customerData: Customer) => {
    if (!customer) return;
    try {
      const updatedCustomer = await updateCustomer(customer.id, customerData);
      setCustomer(updatedCustomer);
      setShowEditModal(false);
    } catch (err: any) {
      setUiError(extractApiErrorMessage(err));
    }
  };

  // Meeting handlers
  const handleAddMeeting = async (modalData: { report: string; date: string; company: number; user_ids: number[]; }) => {
    if (!customer?.id) return;
    try {
      await createMeeting({
        company: customer.id,
        date: modalData.date,
        report: modalData.report,
        user_ids: modalData.user_ids,
      });
      setShowAddMeeting(false);
      setMeetingError(null);
      fetchMeetings(customer.id); // Always re-fetch from backend
    } catch (err: any) {
      setMeetingError('Failed to add meeting.');
    }
  };

  const handleEditMeeting = async (id: number, modalData: { report: string; date: string; company: number; user_ids: number[]; }) => {
    try {
      await updateMeeting(id, {
        date: modalData.date,
        report: modalData.report,
        user_ids: modalData.user_ids,
      });
      setEditMeeting(null); // Close modal on save
      setMeetingError(null);
      if (customer?.id) fetchMeetings(customer.id); // Always re-fetch from backend
    } catch (err: any) {
      setMeetingError('Failed to update meeting.');
    }
  };

  const handleDeleteMeeting = async (id: number) => {
    try {
      await deleteMeeting(id);
      setMeetings(prev => prev.filter(m => m.id !== id));
      setEditMeeting(null); // Close modal on delete
      setMeetingError(null);
    } catch (err: any) {
      setMeetingError('Failed to delete meeting.');
    }
  };

  // Contact handlers
  const handleAddContact = () => {
    setContactModalMode('add');
    setSelectedContact({
      id: undefined,
      company_id: customerId,
      full_name: '',
      position: '',
      company_email: '',
      personal_email: '',
      phone_office: '',
      phone_mobile: '',
      address: '',
      customer_specific_conditions: '',
    });
    setShowContactModal(true);
    setContactAddError(null);
  };
  const handleEditContact = (contact: ContactRow) => {
    setContactModalMode('edit');
    setSelectedContact(contact);
    setShowContactModal(true);
    setContactEditError(null);
  };
  const handleViewContact = (contact: ContactRow) => {
    setSelectedContact(contact);
    setShowContactDetailModal(true);
  };
  const handleDeleteContact = async (contact: ContactRow) => {
    setConfirmModal({ type: 'deleteContact', payload: contact });
  };
  const confirmDeleteContact = async () => {
    const contact = confirmModal?.payload;
    if (!contact) return;
    try {
      setDeleteContactLoading(true);
      await deleteContact(contact.id!);
      setContacts((prev) => prev.filter((c) => c.id !== contact.id));
    } catch (err: any) {
      setDeleteContactError(err?.message || 'Failed to delete contact.');
    } finally {
      setConfirmModal(null);
      setDeleteContactLoading(false);
    }
  };
  const handleSubmitContact = async (contact: ContactRow) => {
    try {
      if (contactModalMode === 'add') {
        const newContact = await createContact(contact);
        setContacts((prev) => [...prev, newContact]);
        setShowContactModal(false);
        setSelectedContact(null);
        setContactAddError(null);
      } else if (contactModalMode === 'edit' && contact.id) {
        const updated = await updateContact(contact.id, contact);
        setContacts((prev) => prev.map((c) => c.id === contact.id ? updated : c));
        setShowContactModal(false);
        setSelectedContact(null);
        setContactEditError(null);
      }
    } catch (err: any) {
      if (contactModalMode === 'add') {
        setContactAddError(extractApiErrorMessage(err));
      } else {
        setContactEditError(extractApiErrorMessage(err));
      }
    }
  };

  // Task handlers
  const handleEditTask = (task: APITask) => {
    setEditingTask(task);
    setShowAddTask(true);
  };
  const handleDeleteTask = async (taskId: number) => {
    setConfirmModal({ type: 'deleteTask', payload: taskId });
  };
  const confirmDeleteTask = async () => {
    const taskId = confirmModal?.payload;
    if (!taskId) return;
    try {
      setDeleteTaskLoading(true);
      await deleteTaskAPI(taskId);
      fetchTasks();
    } catch (err: any) {
      setDeleteTaskError(extractApiErrorMessage(err));
    } finally {
      setConfirmModal(null);
      setDeleteTaskLoading(false);
    }
  };
  const handleAddTask = async (taskData: any, assignedUser: any | null): Promise<boolean> => {
    try {
      let savedTask;
      if (editingTask) {
        savedTask = await updateTask(editingTask.id, {
          ...taskData,
          assigned_to_id: assignedUser?.id || taskData.assigned_to_id, // Always send assigned_to_id
        });
      } else {
        savedTask = await createTask({
          ...taskData,
          company: customer?.id,
          assigned_to_id: assignedUser?.id || taskData.assigned_to_id, // Always send assigned_to_id
        });
      }
      // Optimistic update: always set assigned_to to the full user object if available
      if (assignedUser) {
        savedTask.assigned_to = assignedUser;
      } else if (savedTask.assigned_to_id) {
        const user = users.find(u => u.id === savedTask.assigned_to_id);
        if (user) {
          savedTask.assigned_to = user;
        }
      }
      setEditingTask(null);
      setTasks(prevTasks => {
        const taskExists = prevTasks.some(t => t.id === savedTask.id);
        if (taskExists) {
          return prevTasks.map(t => t.id === savedTask.id ? savedTask : t);
        }
        return [...prevTasks, savedTask];
      });
      setAddTaskError(null);
      return true;
    } catch (err: any) {
      setAddTaskError(extractApiErrorMessage(err));
      return false;
    }
  };
  const handleCloseTaskModal = () => {
    setShowAddTask(false);
    setEditingTask(null);
  };

  // Meetings pagination state
  const [meetingsPage, setMeetingsPage] = useState(1);
  const meetingsPageSize = 2; // You can make this stateful if you want user to change it
  const meetingsTotalPages = Math.ceil(meetings.length / meetingsPageSize);
  const paginatedMeetings = useMemo(() => {
    const start = (meetingsPage - 1) * meetingsPageSize;
    return meetings.slice(start, start + meetingsPageSize);
  }, [meetings, meetingsPage, meetingsPageSize]);

  // Tasks pagination state
  const [tasksPage, setTasksPage] = useState(1);
  const tasksPageSize = 2;
  const tasksTotalPages = Math.ceil(tasks.length / tasksPageSize);
  const paginatedTasks = useMemo(() => {
    const start = (tasksPage - 1) * tasksPageSize;
    return tasks.slice(start, start + tasksPageSize);
  }, [tasks, tasksPage, tasksPageSize]);

  // Add viewMode state for meetings
  const [meetingsViewMode, setMeetingsViewMode] = useState<'table' | 'cards'>('table');
  const [tasksViewMode, setTasksViewMode] = useState<'table' | 'cards'>('table');

  // In the CustomerDetailPage component, add a handler for meeting delete that sets the confirm modal
  const handleDeleteMeetingWithConfirm = (meeting) => {
    setConfirmModal({ type: 'deleteMeeting', payload: meeting });
  };


  if (loading) {
    return (
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card extra="w-full h-full p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card extra="w-full h-full p-4">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Customer not found'}</p>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Back to Customers
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-8 gap-2 md:gap-4">
        <button
          onClick={handleExportAllToExcel}
          className="min-h-[36px] min-w-[36px] px-2 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center gap-1 md:px-4 md:py-2 md:text-sm md:rounded-lg"
        >
          <CiExport />
          <span className="hidden md:inline">Export All</span>
        </button>
        <button
          onClick={handleBack}
          className="min-h-[36px] min-w-[36px] px-2 py-1 text-xs mx-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition flex items-center gap-1 md:px-4 md:py-2 md:text-sm md:rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          <span className="hidden md:inline">Back</span>
        </button>
        <button
          onClick={() => setShowActionModal(true)}
          className="min-h-[36px] min-w-[36px] px-2 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-1 md:px-4 md:py-2 md:text-sm md:rounded-lg"
        >
          <span className="hidden md:inline">Action</span>
          <span className="md:hidden">...</span>
        </button>
      </div>
      {showActionModal && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.8)' }}
            onClick={() => setShowActionModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 animate-modalIn">
            <div className="bg-white rounded-xl shadow-lg p-10 m-10 flex flex-col gap-6 min-w-[260px] relative">
              <button
                className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-3xl font-bold"
                onClick={() => setShowActionModal(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <button
                onClick={e => { e.stopPropagation(); setShowEditModal(true); setShowActionModal(false); }}
                className="min-h-[36px] min-w-[36px] px-2 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center justify-center md:px-4 md:py-2 md:text-sm md:rounded-lg"
              >
                <span className="hidden md:inline">Edit</span>
                <span className="md:hidden">
                  <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z' /></svg>
                </span>
              </button>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  handleDeleteCustomer();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
      {/* Section 1: Info, Contacts, Opportunities */}
      <div className="flex flex-col md:flex-row gap-8 mb-8 min-h-[700px]">
        {/* Info (left, 1/2) */}
        <div className="w-full md:w-1/2">
          <Card extra="w-full h-full p-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-bold ">Info</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="hidden md:hidden lg:hidden px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 13.362-13.303ZM19 7l-2-2"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={handleDeleteCustomer}
                  className="hidden md:hidden lg:hidden  px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-6 items-start">
                <span className="font-semibold text-gray-600">ID:</span>
                <span className="text-gray-800">{customer.id}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-6 items-start">
                <span className="font-semibold text-gray-600">Name:</span>
                <span className="text-gray-800 font-medium">
                  {customer.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-6 items-start">
                <span className="font-semibold text-gray-600">Website:</span>
                <span className="text-gray-800">
                  {customer.website ? (
                    <a
                      href={
                        customer.website.startsWith('http')
                          ? customer.website
                          : `https://${customer.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {customer.website}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not provided</span>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-6 items-start">
                <span className="font-semibold text-gray-600">Country:</span>
                <span className="text-gray-800">
                  {customer.country || 'Not specified'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-6 items-start">
                <span className="font-semibold text-gray-600">
                  Industry Category:
                </span>
                <span className="text-gray-800">
                  {customer.industry_category || 'Not specified'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-6 items-start">
                <span className="font-semibold text-gray-600">
                  Activity Level:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium inline-block w-fit ${
                    customer.activity_level === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {customer.activity_level || 'Not specified'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-6 items-start">
                <span className="font-semibold text-gray-600">
                  Acquired Via:
                </span>
                <span className="text-gray-800">
                  {customer.acquired_via || 'Not specified'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-6 items-start">
                <span className="font-semibold text-gray-600">
                  Lead Score:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium inline-block w-fit ${
                    customer.lead_score >= 80
                      ? 'bg-green-100 text-green-800'
                      : customer.lead_score >= 60
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {customer.lead_score || 'Not specified'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-6 items-start">
                <span className="font-semibold text-gray-600">Notes:</span>
                <span className="text-gray-800 whitespace-pre-wrap">
                  {customer.notes || 'No notes available'}
                </span>
              </div>
            </div>
          </Card>
        </div>
        {/* Contacts (top right, 1/2 height) + Opportunities (bottom right, 1/2 height) */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className="flex-1 min-h-0">
            <Card extra="w-full h-full p-4 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-4  flex-shrink-0 overflow-x-hidden">
                <h3 className="text-2xl font-bold ">Contact Info</h3>
                <span className='flex items-center gap-x-2'>
                  <button
                    className="min-h-[36px] min-w-[36px] px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-md font-semibold md:text-xl md:rounded-lg md:p-1 md:min-h-0 md:min-w-0"
                    onClick={handleExport('contacts')}
                  >
                    <CiExport />
                  </button>
                  <button
                    className="min-h-[36px] min-w-[36px] px-2 py-1 text-xs bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition md:px-3 md:py-1 md:text-xs md:rounded-lg md:font-semibold md:min-h-0 md:min-w-0"
                    onClick={handleAddContact}
                  >
                    <span className="hidden md:inline">+ Add Contact</span>
                    <span className="md:hidden">+</span>
                  </button>
                </span>
              </div>
              <div className="flex-1 overflow-y-hidden">
                {contactsLoading ? (
                  <div className="text-gray-400 text-sm py-4">Loading...</div>
                ) : contacts.length === 0 ? (
                  <div className="text-gray-400 text-sm py-4">No contact info found.</div>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact.id} className="mb-3">
                      <ContactInfoCard
                        contact={contact}
                        onClick={() => handleViewContact(contact)}
                        onEdit={() => handleEditContact(contact)}
                        onDelete={() => handleDeleteContact(contact)}
                      />
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
          <div className="flex-1 min-h-0">
            <Card extra="w-full h-full p-6 flex flex-col">
              <OpportunitiesSection companyId={customerId} click={handleExport('opportunities')}/>
            </Card>
          </div>
        </div>
      </div>
      {/* Section 2: Meetings & Tasks */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="w-full md:w-1/2">
          <Card extra="w-full h-full p-6">
            <div className="flex items-center justify-between flex-shrink-0 pb-2">
              <h3 className="text-lg md:text-2xl font-bold ">Meetings</h3>
              <div className="flex items-center gap-2 pl-2">
                <button
                  onClick={() => setMeetingsViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${meetingsViewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Table View"
                >
                  <MdViewList className="h-2 w-2 md:h-5 md:w-5" />
                </button>
                <button
                  onClick={() => setMeetingsViewMode('cards')}
                  className={`p-2 rounded-lg transition-colors ${meetingsViewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Card View"
                >
                  <MdViewModule className="h-2 w-2 md:h-5 md:w-5" />
                </button>
                <button
                onClick={handleExport("meetings")}
                className="text-xl bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-lg p-1 font-semibold"
              >
                <CiExport className="h-4 w-4 "/>
              </button>
                <button
                  onClick={() => setShowAddMeeting(true)}
                  className="md:ml-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-2 md:px-3 py-1 text-xs flex items-center gap-1 transition"
                >
                +Add
                </button>
              </div>
            </div>
            {meetingsViewMode === 'table' ? (
              <div className="space-y-4 flex-1 overflow-y-auto pb-12 relative">
                {meetingsLoading ? (
                  <div className="text-gray-400 text-sm py-4">Loading...</div>
                ) : meetings.length === 0 ? (
                  <p className="text-gray-500 text-center py-2 text-sm">
                    No meetings scheduled
                  </p>
                ) : (
                  paginatedMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="min-h-[64px] flex justify-between items-center p-3 border border-gray-200 rounded-lg text-sm mb-2 cursor-pointer"
                      onClick={e => {
                        if ((e.target as Element).closest('.meeting-action-btn')) return;
                        setSelectedMeetingDetail(meeting);
                      }}
                    >
                      <div>
                        <div className="font-semibold text-gray-800">{meeting.report}</div>
                        {/* Attendees below the title */}
                        <div className="text-xs text-gray-500 font-medium">
                          Attendees: {Array.isArray(meeting.attendees) && meeting.attendees.length > 0
                            ? meeting.attendees.map(u => u.full_name || u.email).join(', ')
                            : 'None'}
                        </div>
                        <div className="text-xs text-gray-600">{meeting.report}</div>
                        <div className="text-xs text-gray-500">Date: {meeting.date ? new Date(meeting.date).toLocaleDateString() : 'N/A'}</div>
                        <div className="text-xs text-gray-500">Status: {new Date(meeting.date) > new Date() ? 'Upcoming' : 'Past'}</div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditMeeting(meeting); }} className="meeting-action-btn text-blue-600 hover:underline text-xs">Edit</button>
                        <button onClick={() => handleDeleteMeetingWithConfirm(meeting)} className="meeting-action-btn text-red-600 hover:underline text-xs">Delete</button>
                      </div>
                    </div>
                  ))
                )}
                {meetingError && <FormMessage type="error">{meetingError}</FormMessage>}
                {/* Pagination for meetings always at the bottom */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-full flex justify-center">
                  <Pagination
                    currentPage={meetingsPage}
                    totalPages={meetingsTotalPages}
                    onPageChange={page => setMeetingsPage(page)}
                  />
                </div>
              </div>
            ) : (
              <div className="relative min-h-[400px]">
                <div className="space-y-4 flex-1 overflow-y-auto pb-12">
                  <MeetingCards
                    meetings={paginatedMeetings}
                    onEdit={meeting => setEditMeeting(meeting)}
                    onView={meeting => setSelectedMeetingDetail(meeting)}
                    onDelete={handleDeleteMeetingWithConfirm}
                  />
                </div>
                {/* Pagination for meetings always at the bottom in card view */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-2 w-full flex justify-center">
                  <Pagination
                    currentPage={meetingsPage}
                    totalPages={meetingsTotalPages}
                    onPageChange={page => setMeetingsPage(page)}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>
        <div className="w-full md:w-1/2">
          <Card extra="w-full h-full p-6 overflow-hidden relative" style={{ minHeight: '420px' }}>
            <div className="flex items-center justify-between  flex-shrink-0 pb-2">
              <h3 className="text-xl md:text-2xl font-bold ">Tasks</h3>
              <div className="flex items-center gap-2 pl-2">
                <button
                  onClick={() => setTasksViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${tasksViewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Table View"
                >
                  <MdViewList className="h-2 w-2 md:h-5 md:w-5" />
                </button>
                <button
                  onClick={() => setTasksViewMode('cards')}
                  className={`p-2 rounded-lg transition-colors ${tasksViewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                  title="Card View"
                >
                  <MdViewModule className="h-2 w-2 md:h-5 md:w-5" />
                </button>
                <button
                onClick={handleExport("meetings")}
                className="text-xl bg-gray-50 hover:bg-gray-100 cursor-pointer rounded-lg p-1 font-semibold"
              >
                <CiExport className="h-4 w-4 "/>
              </button>
                <button
                  onClick={() => setShowAddTask(true)}
                  className="ml-2 bg-green-600 hover:bg-green-700 text-white rounded-lg px-2 md:px-3 py-1 text-xs flex items-center gap-1 transition"
                >
                  + Add
                </button>
              </div>
            </div>
            {tasksViewMode === 'table' ? (
              <div className="relative min-h-[400px]">
                <TaskTable
                  tasks={paginatedTasks}
                  onEdit={task => handleEditTask(task)}
                  onDelete={task => handleDeleteTask(task.id)}
                  onView={task => setSelectedTaskDetail(task)}
                />
                <Pagination
                  currentPage={tasksPage}
                  totalPages={tasksTotalPages}
                  onPageChange={page => setTasksPage(page)}
                  className="absolute left-1/2 -translate-x-1/2 bottom-4 z-10"
                />
              </div>
            ) : (
              <>
                <div className="space-y-4 flex-1 overflow-y-auto">
                  {tasksLoading ? (
                    <div className="text-gray-400 text-sm py-4">Loading...</div>
                  ) : tasks.length === 0 ? (
                    <div className="text-gray-400 text-sm py-4">No tasks found.</div>
                  ) : (
                    paginatedTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="min-h-[64px] flex justify-between items-center p-3 border border-gray-200 rounded-lg text-sm mb-2 cursor-pointer"
                        onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                          if ((e.target as Element).closest('.task-action-btn')) return;
                          setSelectedTaskDetail(task);
                        }}
                      >
                        <div>
                          <div className="font-semibold text-gray-800">{task.title}</div>
                          <div className="text-xs text-gray-600">{task.description}</div>
                          <div className="text-xs text-gray-500">Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</div>
                          <div className="text-xs text-gray-500">Status: {task.status}</div>
                          <div className="text-xs text-gray-500 font-medium">Assigned To: {task.assigned_to?.full_name || 'Unassigned'}</div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditTask(task)} className="task-action-btn text-blue-600 hover:underline text-xs">Edit</button>
                          <button onClick={() => handleDeleteTask(task.id)} className="task-action-btn text-red-600 hover:underline text-xs">Delete</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* Pagination for tasks always at the bottom in card view */}
                <div className="w-full flex justify-center mt-4">
                  <Pagination
                    currentPage={tasksPage}
                    totalPages={tasksTotalPages}
                    onPageChange={page => setTasksPage(page)}
                  />
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
      {/* Section 3: Products & Interactions */}
      <div className="flex flex-col gap-6 w-full mb-8">
        <div>
        <CustomerProductsSection customerId={customerId} click={() => {}} />        </div>
        <div>
          <CustomerInteractionsSection customerId={customerId} contacts={contacts} click={() => {}} />
        </div>
      </div>
      {/* Four upload boxes in a grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {['Business cards', 'Catalogs', 'Signed contracts', 'Correspondence'].map((label, i) => (
          <div key={i} className="flex flex-col items-center w-full">
            <Upload label={label} />
          </div>
        ))}
      </div>
      {showAddTask && (
        <AddTaskModal
          onClose={handleCloseTaskModal}
          onSubmit={async (taskData, assignedUser) => {
            const success = await handleAddTask(taskData, assignedUser);
            if (success) handleCloseTaskModal();
            // If not, the modal stays open and error is shown
          }}
          initialData={editingTask ? {
            ...editingTask,
            status: editingTask.status === 'open' ? 'open' : editingTask.status === 'closed' ? 'closed' : 'in_progress',
          } : undefined}
          customerId={customer?.id}
          error={addTaskError}
          onClearError={() => setAddTaskError(null)}
        />
      )}
      {showAddMeeting && customer && (
        <AddMeetingModal
          onClose={() => setShowAddMeeting(false)}
          onSubmit={handleAddMeeting}
          customerId={customer.id}
        />
      )}
      {uiError && <FormMessage type="error">{uiError}</FormMessage>}
      {showContactModal && selectedContact && (
        <ContactWizardModal
          open={showContactModal}
          mode={contactModalMode}
          initialData={selectedContact}
          onClose={() => {
            setShowContactModal(false);
            setSelectedContact(null);
            setContactAddError(null);
            setContactEditError(null);
          }}
          onSubmit={handleSubmitContact}
          error={contactModalMode === 'add' ? contactAddError : contactEditError}
          onClearError={() => {
            setContactAddError(null);
            setContactEditError(null);
          }}
        />
      )}
      
      {showContactDetailModal && selectedContact && (
        <ContactDetailModal
          open={showContactDetailModal}
          onClose={() => setShowContactDetailModal(false)}
          contact={selectedContact}
        />
      )}

      {showEditModal && customer && (
        <CustomerWizardModal
          open={showEditModal}
          mode="edit"
          initialData={{
            id: customer.id,
            name: customer.name,
            website: customer.website || '',
            country: customer.country || '',
            industry_category: customer.industry_category || 1,
            activity_level: customer.activity_level || '',
            acquired_via: customer.acquired_via || '',
            lead_score: customer.lead_score || 0,
            notes: customer.notes || '',
          }}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditCustomer}
          error={uiError}
          onClearError={() => setUiError(null)}
        />
      )}
      {/* Delete Confirmation Modals */}
      <DeleteConfirmationModal
        open={confirmModal?.type === 'deleteCustomer'}
        onCancel={() => setConfirmModal(null)}
        onConfirm={confirmDeleteCustomer}
        loading={deleteCustomerLoading}
        error={deleteCustomerError}
        title="Delete Customer"
        description={`Are you sure you want to delete customer "${customer?.name}"? This action cannot be undone.`}
      />
      <DeleteConfirmationModal
        open={confirmModal?.type === 'deleteContact'}
        onCancel={() => setConfirmModal(null)}
        onConfirm={confirmDeleteContact}
        loading={deleteContactLoading}
        error={deleteContactError}
        title="Delete Contact"
        description={`Are you sure you want to delete contact "${selectedContact?.full_name}"? This action cannot be undone.`}
      />
      <DeleteConfirmationModal
        open={confirmModal?.type === 'deleteTask'}
        onCancel={() => setConfirmModal(null)}
        onConfirm={confirmDeleteTask}
        loading={deleteTaskLoading}
        error={deleteTaskError}
        title="Delete Task"
        description={`Are you sure you want to delete task "${editingTask?.title}"? This action cannot be undone.`}
      />
      {selectedMeetingDetail && (
        <MeetingDetailModal
          meeting={selectedMeetingDetail}
          onClose={() => setSelectedMeetingDetail(null)}
        />
      )}
      {editMeeting && (
        <MeetingEditModal
          meeting={editMeeting}
          close={() => setEditMeeting(null)}
          onSave={data => handleEditMeeting(editMeeting.id, data)}
        />
      )}
      {selectedTaskDetail && (
        <TaskDetailModal 
          task={selectedTaskDetail}
          onClose={() => setSelectedTaskDetail(null)}
        />
      )}
      {/* Delete Confirmation Modals */}
      <DeleteConfirmationModal
        open={confirmModal?.type === 'deleteMeeting'}
        onCancel={() => setConfirmModal(null)}
        onConfirm={async () => {
          if (confirmModal?.payload) {
            await handleDeleteMeeting(confirmModal.payload.id);
          }
          setConfirmModal(null);
        }}
        loading={deleteTaskLoading}
        error={meetingError}
        title="Delete Meeting"
        description={`Are you sure you want to delete meeting "${confirmModal?.payload?.report}"? This action cannot be undone.`}
      />
    </>
  );
}
