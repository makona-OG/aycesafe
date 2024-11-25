import { WaterLevelData } from "@/lib/types";
import { AlertCircleIcon } from "lucide-react";
import { sendSMSAlert } from "@/services/smsService";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  status: WaterLevelData['status'];
  phoneNumber?: string;
  onAlertSent?: (log: { timestamp: string; status: WaterLevelData['status']; message: string }) => void;
}

export const AlertStatus = ({ status, phoneNumber, onAlertSent }: Props) => {
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const alertTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const sendAlert = async () => {
      if (status !== lastStatus && phoneNumber) {
        if (!phoneNumber.startsWith('+')) {
          toast.error('Phone number must include country code (e.g., +1 for US numbers)');
          return;
        }

        try {
          let message = '';
          if (status === 'danger' && status !== lastStatus) {
            message = '🚨 *URGENT*: Critical water levels detected! Current level exceeds safety threshold. Please take immediate action.';
            await sendSMSAlert(message, phoneNumber);
            setLastStatus('danger');
          } else if (status === 'warning' && status !== lastStatus) {
            message = '⚠️ *WARNING*: Water levels are rising significantly. Current conditions require attention.';
            await sendSMSAlert(message, phoneNumber);
            setLastStatus('warning');
          } else if (status === 'safe' && lastStatus !== 'safe') {
            message = '✅ *UPDATE*: Water levels have returned to safe levels.';
            await sendSMSAlert(message, phoneNumber);
            setLastStatus('safe');
          }
          
          if (message) {
            toast.success('Alert sent successfully! If this is your first message, please join the Twilio sandbox.');
            onAlertSent?.({
              timestamp: new Date().toISOString(),
              status,
              message
            });
          }
        } catch (error) {
          console.error('Failed to send alert:', error);
          toast.error('Failed to send alert. Make sure you have joined the Twilio sandbox.');
        }
      }
    };

    // Clear any existing timeout
    if (alertTimeout.current) {
      clearTimeout(alertTimeout.current);
    }

    // Set a small delay to prevent rapid-fire alerts
    alertTimeout.current = setTimeout(sendAlert, 1000);

    return () => {
      if (alertTimeout.current) {
        clearTimeout(alertTimeout.current);
      }
    };
  }, [status, phoneNumber, onAlertSent, lastStatus]);

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
      {phoneNumber && (
        <div className="mt-2 space-y-2">
          <p className="text-sm opacity-90">
            WhatsApp alerts will be sent to: {phoneNumber}
          </p>
          <p className="text-xs opacity-75">
            First time? Send "join" to +14155238886 to receive alerts
          </p>
        </div>
      )}
    </div>
  );
};