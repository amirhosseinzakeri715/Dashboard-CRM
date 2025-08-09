import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"

interface ToastifyProviderProps {
  children: React.ReactNode;
}

export const ToastifyProvider: React.FC<{ children: React.ReactNode }>= ({ children }: ToastifyProviderProps) =>{
  return (
    <>
      {children}
      <ToastContainer/>
    </>
  )
}