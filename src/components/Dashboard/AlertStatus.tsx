import { WaterLevelData } from "@/lib/types";
import { AlertCircleIcon } from "lucide-react";
import { sendSMSAlert } from "@/services/smsService";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface Props {
  status: WaterLevelData['status'];
}

export const AlertStatus = ({ status }: Props) => {
  const lastAlertSent = useRef<string | null>(null);

  useEffect(() => {
    const sendAlert = async () => {
      // Only send if status changed and we haven't sent this type of alert yet
      if (status !== lastAlertSent.current) {
        try {
          if (status === 'danger') {
            await sendSMSAlert('🚨 *URGENT*: Critical water levels detected in your area. Please take immediate action.');
            lastAlertSent.current = 'danger';
          } else if (status === 'warning') {
            await sendSMSAlert('⚠️ *WARNING*: Water levels are rising in your area. Stay alert.');
            lastAlertSent.current = 'warning';
          } else {
            // Reset the last alert when status returns to safe
            lastAlertSent.current = null;
          }
        } catch (error) {
          console.error('Failed to send alert:', error);
          toast.error('Failed to send WhatsApp alert');
        }
      }
    };

    sendAlert();
  }, [status]);

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