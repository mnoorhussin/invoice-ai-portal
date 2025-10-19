const StatusBadge = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
  let colorClasses = "";
  switch (status) {
    case 'Paid': 
      colorClasses = 'bg-green-100 dark:!bg-green-900 text-green-800 dark:!text-green-100'; 
      break;
    case 'Pending': 
      colorClasses = 'bg-yellow-100 dark:!bg-yellow-900 text-yellow-800 dark:!text-yellow-100'; 
      break;
    case 'Overdue': 
      colorClasses = 'bg-red-100 dark:!bg-red-900 text-red-800 dark:!text-red-100'; 
      break;
    default: 
      colorClasses = 'bg-gray-100 dark:!bg-gray-900 text-gray-800 dark:!text-gray-100';
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
};