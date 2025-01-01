export const TodaySchedule = () => {
  return (
    <div className="bg-white rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Today's Schedule</h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <div>
              <p className="font-medium">Team Meeting</p>
              <p className="text-sm text-gray-500">10:00 AM</p>
            </div>
          </div>
          <button className="text-sm text-blue-600">View</button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div>
              <p className="font-medium">Staff Training</p>
              <p className="text-sm text-gray-500">2:00 PM</p>
            </div>
          </div>
          <button className="text-sm text-blue-600">View</button>
        </div>
      </div>
    </div>
  );
};