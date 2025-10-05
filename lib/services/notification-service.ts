import { toast } from "@/hooks/use-toast"

export class NotificationService {
  static success(title: string, description?: string) {
    toast({
      title,
      description,
      variant: "default",
    })
  }

  static error(title: string, description?: string) {
    toast({
      title,
      description,
      variant: "destructive",
    })
  }

  static info(title: string, description?: string) {
    toast({
      title,
      description,
      variant: "default",
    })
  }

  static warning(title: string, description?: string) {
    toast({
      title,
      description,
      variant: "destructive",
    })
  }
}

export const Notifications = {
  LOGIN_SUCCESS: (message: string) => 
    NotificationService.success(message),
  
  LOGIN_ERROR: (message: string) => 
    NotificationService.error(message),
  
  LOGOUT_SUCCESS: (message: string) => 
    NotificationService.success(message),

  REQUEST_CREATED: (message: string) => 
    NotificationService.success(message),
  
  REQUEST_UPDATED: (message: string) => 
    NotificationService.success(message),
  
  STATUS_UPDATED: (message: string) => 
    NotificationService.success(message),
  
  MESSAGE_SENT: (message: string) => 
    NotificationService.success(message),

  GENERIC_ERROR: (message: string, description?: string) => 
    NotificationService.error(message, description),
  
  REQUEST_NOT_FOUND: (message: string) => 
    NotificationService.error(message),
  
  VALIDATION_ERROR: (message: string) => 
    NotificationService.error(message),

  ACCESS_DENIED: (message: string, description?: string) => 
    NotificationService.error(message, description),

  UNAUTHORIZED_REQUEST: (message: string) => 
    NotificationService.error(message, "You can only view your own requests"),

  NOT_AUTHENTICATED: (message: string) => 
    NotificationService.error(message, "Please log in to access this feature"),

  PERMISSION_DENIED: (message: string) => 
    NotificationService.error(message, "You don't have permission to perform this action"),
}
