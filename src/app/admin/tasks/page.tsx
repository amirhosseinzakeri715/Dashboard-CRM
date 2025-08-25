"use client"

import Card from 'components/card'
import { getTasks } from "apis/tasks.api"
import { useQuery } from "@tanstack/react-query"
import TasksTable from 'components/admin/tasks/Table'
import UsersTable from 'components/admin/tasks/UserTable'
import { useState } from 'react'
import CreateTaskModal from 'components/admin/tasks/CreateModal'

export default function TasksPage() {
  const { data } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    refetchOnWindowFocus: false
  })

  const [addModalOpen, setAddModalOpen] = useState(false);

  return (
    <>
      <div className='flex justify-end mb-10'>
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          + Add Task
        </button>
      </div>
      <Card extra="pb-10 p-8 my-5">
        <TasksTable status="ongoing" assign={true} tasks={data}/>
      </Card>
      <div className='flex justify-between gap-5'>
        <Card extra="pb-10 p-8 w-full">
          <TasksTable status="undone" assign={true} tasks={data}/>
        </Card>
        <Card extra="pb-10 p-8 w-full">
          <TasksTable status="completed" assign={true} tasks={data}/>
        </Card>
      </div>
      <Card extra="pb-10 my-5 p-8">
        <TasksTable status="ongoing" assign={false} tasks={data}/>
      </Card>
      <Card extra="pb-10 p-8">
        <UsersTable/>
      </Card>
      {addModalOpen && <CreateTaskModal close={() => setAddModalOpen(false)}/>}
    </>
  )
}