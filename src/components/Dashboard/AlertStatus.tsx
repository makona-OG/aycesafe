import { WaterLevelData } from "@/lib/types";
import { AlertCircleIcon } from "lucide-react";
import { sendSMSAlert } from "@/services/smsService";
import { useEffect } from "react";

interface Props {
  status: WaterLevelData['status'];
}

export const AlertStatus = ({ status }: Props) => {
  useEffect(() => {
    if (status === 'danger') {
      sendSMSAlert('URGENT: Critical water levels detected in your area. Please take immediate action.');
    } else if (status === 'warning') {
      sendSMSAlert('WARNING: Water levels are rising in your area. Stay alert.');
    }
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