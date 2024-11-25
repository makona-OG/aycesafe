import { WaterLevelData } from "@/lib/types";
import { AlertCircleIcon } from "lucide-react";
import { sendSMSAlert } from "@/services/smsService";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface Props {
  status: WaterLevelData['status'];
  phoneNumber?: string;
  onAlertSent?: (log: { timestamp: string; status: WaterLevelData['status']; message: string }) => void;
}

export const AlertStatus = ({ status, phoneNumber, onAlertSent }: Props) => {
  const lastAlertSent = useRef<string | null>(null);

  useEffect(() => {
    const sendAlert = async () => {
      if (status !== lastAlertSent.current && phoneNumber) {
        try {
          let message = '';
          if (status === 'danger') {
            message = '🚨 *URGENT*: Critical water levels detected in your area. Please take immediate action.';
            await sendSMSAlert(message, phoneNumber);
            lastAlertSent.current = 'danger';
          } else if (status === 'warning') {
            message = '⚠️ *WARNING*: Water levels are rising in your area. Stay alert.';
            await sendSMSAlert(message, phoneNumber);
            lastAlertSent.current = 'warning';
          } else {
            lastAlertSent.current = null;
            return;
          }
          
          onAlertSent?.({
            timestamp: new Date().toISOString(),
            status,
            message
          });
        } catch (error) {
          console.error('Failed to send alert:', error);
          toast.error('Failed to send WhatsApp alert');
        }
      }
    };

    sendAlert();
  }, [status, phoneNumber, onAlertSent]);

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
        <AlertCircleIcon className={config.animate ? 'animate-pulse-slow' : ''} />
      </div>
      <p className="mt-2 text-lg">{config.message}</p>
    </div>
  );
};