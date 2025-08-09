export const urls= {
  tasks: {
    list: "crm/tasks/"
  },
  companies: {
    list: "crm/companies/",
    export: "crm/companies/export/",
    byIdExport: (id: number) => `crm/companies/${id}/export/`
  },
  users: {
    list: "auth/users/",
    byId: (id: number) => `auth/users/${id}/dashboard/`
  },
  auth: {
    refresh: "auth/api/token/refresh/"
  },
  notifications: {
    list: "crm/api/notifications/unread/",
    unread: "crm/api/notifications/mark-as-seen/"
  }
}