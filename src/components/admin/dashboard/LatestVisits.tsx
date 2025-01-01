interface Appointment {
  name: string;
  specialty: string;
  time: string;
  status: string;
  avatar: string;
}

export const LatestVisits = ({ appointments }: { appointments: Appointment[] }) => {
  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Latest Visits</h3>
      <div className="space-y-6">
        {appointments.map((appointment, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={appointment.avatar}
                alt={appointment.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{appointment.name}</p>
                <p className="text-sm text-gray-500">{appointment.specialty}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">{appointment.time}</p>
              <p className="text-sm text-gray-500">{appointment.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};