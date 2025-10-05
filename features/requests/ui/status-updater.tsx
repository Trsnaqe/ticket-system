"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { useAppSelector } from "@/lib/store/hooks"
import { type RequestStatus } from "@/types/request"
import { useUpdateStatusMutation } from "@/features/requests/api/requests-api"
import { useTranslation } from "@/hooks/use-translation"
import { useIsMobile } from "@/hooks/use-mobile"
import { Notifications } from "@/lib/services/notification-service"
import { CheckCircle2, Circle, Clock, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusUpdaterProps {
  requestId: string
  currentStatus: RequestStatus
}

export function StatusUpdater({ requestId, currentStatus }: StatusUpdaterProps) {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)
  const isMobile = useIsMobile()
  const [updateStatus, { isLoading: isUpdatingApi }] = useUpdateStatusMutation()
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  if (user?.role !== "admin") {
    return null
  }

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) return

    setIsUpdating(true)

    try {
      await updateStatus({ id: requestId, status: selectedStatus }).unwrap()

      Notifications.STATUS_UPDATED(t("statusUpdated"))
      setIsDrawerOpen(false)
    } catch (error) {
      Notifications.GENERIC_ERROR(t("errorOccurred"), t("pleaseTryAgain"))
    } finally {
      setIsUpdating(false)
    }
  }

  const statusOptions: { 
    value: RequestStatus
    label: string
    icon: React.ReactNode
    color: string
    description: string
  }[] = [
    { 
      value: "open", 
      label: t("open"),
      icon: <Circle className="h-5 w-5" />,
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      description: t("openDescription")
    },
    { 
      value: "inProgress", 
      label: t("inProgress"),
      icon: <Clock className="h-5 w-5" />,
      color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
      description: t("inProgressDescription")
    },
    { 
      value: "closed", 
      label: t("closed"),
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-green-500 bg-green-500/10 border-green-500/20",
      description: t("closedDescription")
    },
  ]

  // Mobile drawer UI
  if (isMobile) {
    return (
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
            <Edit className="h-4 w-4" />
            <span className="text-sm">{t("status")}</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("updateStatus")}</DrawerTitle>
            <DrawerDescription>
              {t("selectStatus")} - {t("current")}: {statusOptions.find(s => s.value === currentStatus)?.label}
            </DrawerDescription>
          </DrawerHeader>
          
          <div className="px-4 pb-4 space-y-3">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setSelectedStatus(status.value)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 transition-all flex items-start gap-4 text-left",
                  selectedStatus === status.value
                    ? `${status.color} border-current shadow-lg scale-[1.02]`
                    : "bg-muted/30 border-transparent hover:border-muted-foreground/20"
                )}
              >
                <div className={cn(
                  "mt-0.5",
                  selectedStatus === status.value ? "" : "text-muted-foreground"
                )}>
                  {status.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-semibold text-base mb-1",
                    selectedStatus === status.value ? "" : "text-foreground"
                  )}>
                    {status.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {status.description}
                  </div>
                </div>
                {selectedStatus === status.value && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                )}
              </button>
            ))}
          </div>

          <DrawerFooter className="pt-2">
            <Button
              onClick={handleStatusUpdate}
              disabled={selectedStatus === currentStatus || isUpdating || isUpdatingApi}
              size="lg"
              className="w-full"
            >
              {isUpdating || isUpdatingApi ? t("loading") : t("updateStatus")}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" size="lg" className="w-full">
                {t("cancel")}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  // Desktop inline UI
  return (
    <div className="flex items-center gap-2">
      <Select 
        value={selectedStatus} 
        onValueChange={(value) => setSelectedStatus(value as RequestStatus)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              <div className="flex items-center gap-2">
                {status.icon}
                {status.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button
        onClick={handleStatusUpdate}
        disabled={selectedStatus === currentStatus || isUpdating || isUpdatingApi}
        size="sm"
      >
        {isUpdating || isUpdatingApi ? t("loading") : t("save")}
      </Button>
    </div>
  )
}



