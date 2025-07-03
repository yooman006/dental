import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const CalendarView = () => {
  const { isAdmin } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedAppointments = JSON.parse(localStorage.getItem('dental_appointments')) || [];
      setAppointments(storedAppointments);
      setIsLoading(false);
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const getDayMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDay = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const prevPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    }
  };

  const nextPeriod = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7));
    }
  };

  const getAppointmentDay = (day) => {
    const dateToCheck = day instanceof Date ? day : new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    
    return appointments.filter(appt => {
      if (!appt.appointmentDate) return false;
      const apptDate = new Date(appt.appointmentDate);
      return (
        apptDate.getDate() === dateToCheck.getDate() &&
        apptDate.getMonth() === dateToCheck.getMonth() &&
        apptDate.getFullYear() === dateToCheck.getFullYear()
      );
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDayMonth(year, month);
    const firstDayOfMonth = getFirstDay(year, month);

    const days = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      
      if (i === 0) {
        for (let j = 0; j < firstDayOfMonth; j++) {
          week.push(<div key={`empty-${j}`} className="h-24 p-1 border border-gray-200 bg-gray-50"></div>);
        }
      }

      for (let j = week.length; j < 7; j++) {
        if (day > daysInMonth) break;

        const dayAppointments = getAppointmentDay(day);
        const isToday = day === new Date().getDate() && 
                         month === new Date().getMonth() && 
                         year === new Date().getFullYear();
        
        week.push(
          <div 
            key={`day-${day}`} 
            className={`h-24 p-1 border border-gray-200 overflow-hidden cursor-pointer hover:bg-gray-50 ${
              isToday ? 'bg-blue-50' : ''
            } ${
              dayAppointments.length > 0 ? 'bg-green-50' : ''
            }`}
            onClick={() => handleDayClick(day)}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`text-sm font-medium ${
                isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''
              } ${
                dayAppointments.length > 0 ? 'text-green-800' : ''
              }`}>
                {day}
              </span>
              {isAdmin() && (
                <Link 
                  to={`/appointments/add?date=${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Plus className="h-3 w-3" />
                </Link>
              )}
            </div>
            <div className="space-y-1 max-h-16 overflow-y-auto">
              {dayAppointments.slice(0, 3).map(appt => (
                <div 
                  key={appt.id} 
                  className="text-xs p-1 bg-blue-50 text-blue-800 rounded truncate"
                  title={`${appt.patientName} - ${appt.treatment}`}
                >
                  {appt.time} - {appt.patientName}
                </div>
              ))}
              {dayAppointments.length > 3 && (
                <div className="text-xs text-gray-500">+{dayAppointments.length - 3} more</div>
              )}
            </div>
          </div>
        );
        day++;
      }

      while (week.length < 7) {
        week.push(<div key={`empty-end-${week.length}`} className="h-24 p-1 border border-gray-200 bg-gray-50"></div>);
      }

      days.push(
        <div key={`week-${i}`} className="grid grid-cols-7">
          {week}
        </div>
      );

      if (day > daysInMonth) break;
    }

    return days;
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    return (
      <div className="grid grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => {
          const day = new Date(startOfWeek);
          day.setDate(startOfWeek.getDate() + index);
          const dayAppointments = getAppointmentDay(day);
          const isToday = day.toDateString() === new Date().toDateString();
          
          return (
            <div 
              key={`weekday-${index}`} 
              className={`min-h-48 p-2 border border-gray-200 overflow-hidden cursor-pointer hover:bg-gray-50 ${
                isToday ? 'bg-blue-50' : ''
              } ${
                dayAppointments.length > 0 ? 'bg-green-50' : ''
              }`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${
                  isToday ? 'text-blue-600' : ''
                } ${
                  dayAppointments.length > 0 ? 'text-green-800' : ''
                }`}>
                  {dayNames[index]} {day.getDate()}
                </span>
                {isAdmin() && (
                  <Link 
                    to={`/appointments/add?date=${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`}
                    className="text-xs text-blue-600 hover:text-blue-800"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Plus className="h-3 w-3" />
                  </Link>
                )}
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {dayAppointments.map(appt => (
                  <div 
                    key={appt.id}
                    className="text-xs p-2 bg-blue-50 text-blue-800 rounded"
                  >
                    <div className="font-medium">{appt.time}</div>
                    <div className="truncate">{appt.patientName}</div>
                    <div className="text-xs text-gray-600 truncate">{appt.treatment}</div>
                  </div>
                ))}
                {dayAppointments.length === 0 && (
                  <div className="text-xs text-gray-400 italic">No appointments</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleDayClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
  };

  if (!isAdmin()) {
    return (
      <div className="p-8 text-center text-gray-600">
        You don't have permission to view this page.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Appointment Calendar</h2>
        <Link
          to="/appointments/add"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button 
                onClick={() => setViewMode('month')} 
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'month' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                }`}
              >
                Month
              </button>
              <button 
                onClick={() => setViewMode('week')} 
                className={`px-3 py-1 rounded-md ${
                  viewMode === 'week' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                }`}
              >
                Week
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={prevPeriod}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-semibold text-gray-900">
                {viewMode === 'month' 
                  ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                  : `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              </h3>
              <button
                onClick={nextPeriod}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="w-24"></div>
          </div>
        </div>

        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {dayNames.map(day => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : viewMode === 'month' ? (
          renderCalendar()
        ) : (
          renderWeekView()
        )}
      </div>

      {selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Appointments for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </h3>
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getAppointmentDay(selectedDate).length > 0 ? (
                getAppointmentDay(selectedDate).map(appt => (
                  <div key={appt.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="font-medium">{appt.patientName}</div>
                    <div className="text-sm text-gray-600">{appt.treatment}</div>
                    <div className="text-sm text-gray-500">{appt.time}</div>
                    <div className="text-xs text-gray-400 mt-1">Duration: {appt.duration || 'N/A'}</div>
                    {isAdmin() && (
                      <Link
                        to={`/appointments/edit/${appt.id}`}
                        className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
                      >
                        Edit Appointment
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No appointments scheduled</p>
              )}
            </div>
            {isAdmin() && (
              <div className="mt-4">
                <Link
                  to={`/appointments/add?date=${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  Add Appointment
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;