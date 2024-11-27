import { WaterLevelData } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { sendAlert } from "@/services/smsService";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Update with your WhatsApp number - make sure to include country code
const WHATSAPP_NUMBER = '254712961615';

interface Props {
  status: WaterLevelData['status'];
  onAlertSent?: (log: { timestamp: string; status: WaterLevelData['status']; message: string }) => void;
}

const getAlertMessage = (status: WaterLevelData['status'], lastStatus: string | null) => {
  const timestamp = new Date().toLocaleTimeString();
  
  if (status === 'danger' && status !== lastStatus) {
    return `URGENT ALERT [${timestamp}]: Water levels have reached CRITICAL levels! Immediate action required.`;
  } else if (status === 'warning' && status !== lastStatus) {
    return `WARNING ALERT [${timestamp}]: Water levels are rising and require attention.`;
  } else if (status === 'safe' && lastStatus !== 'safe') {
    return `STATUS UPDATE [${timestamp}]: Water levels have returned to safe levels.`;
  }
  return null;
};

const getStatusConfig = (status: WaterLevelData['status']) => {
  switch (status) {
    case 'safe':
      return {
        color: 'bg-alert-safe',
        message: 'All Clear - Normal Water Levels',
        animate: false
      };
    case 'warning':
      return {
        color: 'bg-alert-warning',
        message: 'Warning - Rising Water Levels',
        animate: true
      };
    case 'danger':
      return {
        color: 'bg-alert-danger',
        message: 'Danger - Critical Water Levels',
        animate: true
      };
    default:
      return {
        color: 'bg-gray-400',
        message: 'Status Unknown',
        animate: false
      };
  }
};

export const AlertStatus = ({ status, onAlertSent }: Props) => {
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const alertTimeout = useRef<NodeJS.Timeout | null>(null);

  const saveAlert = (newLog: { timestamp: string; status: WaterLevelData['status']; message: string }) => {
    const existingLogs = JSON.parse(localStorage.getItem('alertLogs') || '[]');
    const updatedLogs = [newLog, ...existingLogs];
    localStorage.setItem('alertLogs', JSON.stringify(updatedLogs));
    onAlertSent?.(newLog);
  };

  useEffect(() => {
    const sendAlertNotification = async () => {
      const message = getAlertMessage(status, lastStatus);
      
      if (message && !isRetrying) {
        setIsRetrying(true);
        try {
          console.log('Sending alert to:', WHATSAPP_NUMBER);
          const result = await sendAlert(message, WHATSAPP_NUMBER);

          if (result.success) {
            toast.success('WhatsApp alert sent successfully!');
            
            const newLog = {
              timestamp: new Date().toISOString(),
              status,
              message
            };
            
            saveAlert(newLog);
            setLastStatus(status);
          } else {
            toast.error(`Failed to send WhatsApp alert: ${result.error}`);
          }
        } catch (error: any) {
          console.error('Failed to send alert:', error);
          toast.error(`Failed to send WhatsApp alert: ${error.message}`);
        } finally {
          setIsRetrying(false);
        }
      }
    };

    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }

    alertTimeout.current = setTimeout(sendAlertNotification, 1000);

    return () => {
      if (alertTimeout.current) {
        clearTimeout(alertTimeout.current);
      }
    };
  }, [status, onAlertSent, lastStatus, isRetrying]);

  const config = getStatusConfig(status);

  return (
    <div className={`${config.color} p-6 rounded-lg text-white shadow-lg animate-fade-in`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Alert Status</h2>
        <AlertCircle className={config.animate ? 'animate-pulse' : ''} />
      </div>
      <p className="mt-2 text-lg font-bold">{config.message}</p>
      <p className="mt-2 text-sm opacity-75">
        Alerts will be sent via WhatsApp Business API
      </p>
    </div>
  );
};