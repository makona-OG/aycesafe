import { WaterLevelData } from "@/lib/types";
import { AlertCircleIcon } from "lucide-react";
import { sendSMSAlert } from "@/services/smsService";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Configure the phone number here
const CONFIGURED_PHONE_NUMBER = '+1234567890'; // Replace with your actual phone number

interface Props {
  status: WaterLevelData['status'];
  onAlertSent?: (log: { timestamp: string; status: WaterLevelData['status']; message: string }) => void;
}

export const AlertStatus = ({ status, onAlertSent }: Props) => {
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const alertTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sendAlert = async () => {
      if (status !== lastStatus) {
        try {
          let message = '';
          if (status === 'danger' && status !== lastStatus) {
            message = '🚨 *URGENT*: Critical water levels detected! Current level exceeds safety threshold. Please take immediate action.';
            await sendSMSAlert(message, CONFIGURED_PHONE_NUMBER);
            setLastStatus('danger');
          } else if (status === 'warning' && status !== lastStatus) {
            message = '⚠️ *WARNING*: Water levels are rising significantly. Current conditions require attention.';
            await sendSMSAlert(message, CONFIGURED_PHONE_NUMBER);
            setLastStatus('warning');
          } else if (status === 'safe' && lastStatus !== 'safe') {
            message = '✅ *UPDATE*: Water levels have returned to safe levels.';
            await sendSMSAlert(message, CONFIGURED_PHONE_NUMBER);
            setLastStatus('safe');
          }
          
          if (message) {
            toast.success('Alert sent successfully!');
            onAlertSent?.({
              timestamp: new Date().toISOString(),
              status,
              message
            });
          }
        } catch (error) {
          console.error('Failed to send alert:', error);
          toast.error('Failed to send alert. Please check the system configuration.');
        }
      }
    };

    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }

    alertTimeout.current = setTimeout(sendAlert, 1000);

    return () => {
      if (alertTimeout.current) {
        clearTimeout(alertTimeout.current);
      }
    };
  }, [status, onAlertSent, lastStatus]);

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

  const config = getStatusConfig(status);

  return (
    <div className={`${config.color} p-6 rounded-lg text-white shadow-lg animate-fade-in`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Alert Status</h2>
        <AlertCircleIcon className={config.animate ? 'animate-pulse' : ''} />
      </div>
      <p className="mt-2 text-lg font-bold">{config.message}</p>
    </div>
  );
};