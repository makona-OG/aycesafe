import { WaterLevelData } from "@/lib/types";
import { AlertCircleIcon } from "lucide-react";
import { sendSMSAlert } from "@/services/smsService";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Using a sandbox testing number - this will work with Twilio's sandbox
const WHATSAPP_NUMBER = '14155238886';

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
          } else if (status === 'warning' && status !== lastStatus) {
            message = '⚠️ *WARNING*: Water levels are rising significantly. Current conditions require attention.';
          } else if (status === 'safe' && lastStatus !== 'safe') {
            message = '✅ *UPDATE*: Water levels have returned to safe levels.';
          }
          
          if (message) {
            await sendSMSAlert(message, WHATSAPP_NUMBER);
            toast.success('WhatsApp alert sent successfully!');
            setLastStatus(status);
            onAlertSent?.({
              timestamp: new Date().toISOString(),
              status,
              message
            });
          }
        } catch (error: any) {
          console.error('Failed to send alert:', error);
          toast.error('Failed to send WhatsApp alert. Make sure you have joined the Twilio WhatsApp sandbox.');
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
      <p className="mt-2 text-sm opacity-75">
        WhatsApp alerts are enabled. Join Twilio sandbox by sending "join plenty-drawn" to +1 415 523 8886
      </p>
    </div>
  );
};