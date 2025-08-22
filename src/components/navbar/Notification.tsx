import Dropdown from "components/dropdown"
import { BsArrowBarUp } from "react-icons/bs"
import { useQuery } from "@tanstack/react-query"
import { INotification } from "types/notification"
import { IoMdNotificationsOutline } from "react-icons/io"
import { countUnSeenNotifications, fetchNotifications } from "apis/notifications.api"

export default function NotificationSection() {
  const { data, isError, isSuccess } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    refetchOnWindowFocus: false
  })

  // const unSeen= useQuery({
  //   queryKey: ["unseennotifications"],
  //   refetchOnWindowFocus: false,
  //   queryFn: countUnSeenNotifications
  // })

  const unseenNotifications= data?.filter((notification: INotification) => !notification.seen)

  return(
    <Dropdown
      button={
        <IoMdNotificationsOutline className="text-lg text-gray-600 dark:text-white cursor-pointer"/>
      }
      animation="transition-all duration-300 ease-in-out"
      classNames="top-4 -left-[120px] md:-left-[440px]"
    >
      <div
        className="space-y-2 rounded-xl bg-white p-3 shadow-md shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[300px] md:gap-3 md:rounded-[20px] md:p-4 md:shadow-xl md:sm:w-[460px]"
      >
        <span className="flex items-center justify-between font-bold text-navy-700 dark:text-white">
          <h3 className="text-sm md:text-base">
            Notification
          </h3>
          <button className="text-xs md:text-sm cursor-pointer">
            Mark all read
          </button>
        </span>
        {!isSuccess || unseenNotifications?.length=== 0 ? (
          <div className="text-gray-400 text-center py-2 md:py-4 text-xs md:text-sm">
            No notifications
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-2">
            {
              unseenNotifications?.map((notification: INotification) => (
                <div
                  key={notification.id}
                  className="flex items-center space-x-2 md:space-x-3 max-h-40 overflow-y-auto"
                >
                  <div
                    className="place-items-center rounded-lg bg-gradient-to-b from-brandLinear to-brand-500 py-2 px-3 text-lg text-white md:rounded-xl md:py-4 md:px-5 md:text-2xl"
                  >
                    <BsArrowBarUp/>
                  </div>
                  <div className="text-gray-900 dark:text-white text-left">
                    <h4 className="text-xs font-bold md:text-base">
                      {notification.title}
                    </h4>
                    <h5 className="text-[10px] font-base md:text-xs">
                      {notification.message || ''}
                    </h5>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </Dropdown>
  )
}