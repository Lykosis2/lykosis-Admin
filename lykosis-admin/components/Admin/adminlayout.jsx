import { useMemo } from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }) {
  const sidebar = useMemo(() => {
    return <AdminSidebar />
  }, [])

  return (
        <div className="w-screen h-screen flex">
            {sidebar}
            <div className="w-full h-full overflow-y-auto p-10 relative">
                {children}
            </div>
        </div>
  )
}
