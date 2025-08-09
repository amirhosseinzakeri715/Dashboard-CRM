export interface INotification{
    id: number
    title: string
    message: string
    created_at: string
    received: boolean
    seen: boolean
    type: "task_due_soon" | "meeting_due_soon" | "task_assigned"
    user: number
    content_type: any
}