import { useState, useEffect } from 'react';

interface LoginRecord {
  _id: string;
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
}

interface LoginHistoryProps {
  userId: string;
  records: LoginRecord[];
}

export default function LoginHistory({ userId, records }: LoginHistoryProps) {
  const [loginRecords, setLoginRecords] = useState<LoginRecord[]>(records || []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-white mb-4">Login History</h3>
      
      {loginRecords.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs uppercase bg-gray-700 text-gray-300">
              <tr>
                <th scope="col" className="px-4 py-3 rounded-tl-lg">Date & Time</th>
                <th scope="col" className="px-4 py-3">Device</th>
                <th scope="col" className="px-4 py-3 rounded-tr-lg">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loginRecords.slice().reverse().map((record) => (
                <tr key={record._id} className="bg-gray-600 border-b border-gray-700 hover:bg-gray-500">
                  <td className="px-4 py-3">{formatDate(record.timestamp)}</td>
                  <td className="px-4 py-3">{record.deviceInfo}</td>
                  <td className="px-4 py-3">{record.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8 bg-gray-700 rounded-lg">
          No login history available
        </div>
      )}
    </div>
  );
}