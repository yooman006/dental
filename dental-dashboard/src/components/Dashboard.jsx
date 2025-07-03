import React, { useState, useEffect } from 'react';
import {
  LogOut,
  User,
  Settings,
  Bell,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Home,
  CalendarDays,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, NavLink, Outlet } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, isAdmin, getSessionTimeRemaining } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sessionTime, setSessionTime] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patientTreatments, setPatientTreatments] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setSessionTime(getSessionTimeRemaining());
    }, 60000);

    return () => clearInterval(timer);
  }, [getSessionTimeRemaining]);

  useEffect(() => {
    if (!isAdmin()) {
      const appointments = JSON.parse(localStorage.getItem('dental_appointments') || '[]');
      const treatments = JSON.parse(localStorage.getItem('dental_treatments') || '[]');

      const patientApps = appointments.filter(appt =>
        appt.patientId === user.id || appt.patientName === user.name
      );

      const patientTreats = treatments.filter(treatment =>
        treatment.patientId === user.id
      );

      setPatientAppointments(patientApps);
      setPatientTreatments(patientTreats);
    }
  }, [user, isAdmin]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  const adminStats = [
    {
      title: "Today's Appointments",
      value: "1",
      icon: <Calendar className="h-6 w-6" />,
      color: "blue"
    },
    {
      title: "Total Patients",
      value: "1",
      icon: <Users className="h-6 w-6" />,
      color: "green"
    },
    {
      title: "Pending Treatments",
      value: "1",
      icon: <Clock className="h-6 w-6" />,
      color: "yellow"
    },
    {
      title: "Monthly Revenue",
      value: "100",
      color: "purple"
    }
  ];

  const getPatientStats = () => {
    const completedTreatments = patientTreatments.filter(t => t.status === 'completed');
    const pendingTreatments = patientTreatments.filter(t => t.status === 'pending');
    const totalSpent = completedTreatments.reduce((sum, t) => sum + (t.cost || 0), 0);

    const upcomingAppointments = patientAppointments
      .filter(appt => new Date(appt.appointmentDate) > new Date())
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

    const nextAppointment = upcomingAppointments[0];
    const lastCompleted = patientAppointments
      .filter(appt => appt.status === 'completed')
      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0];

    return [
      {
        title: "Next Appointment",
        value: nextAppointment ? new Date(nextAppointment.appointmentDate).toLocaleDateString() : 'None',
        subtitle: nextAppointment ?
          `${new Date(nextAppointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${nextAppointment.treatment || 'Treatment'}` :
          'No upcoming appointments',
        icon: <Calendar className="h-6 w-6" />,
        color: "blue"
      },
      {
        title: "Last Visit",
        value: lastCompleted ? new Date(lastCompleted.appointmentDate).toLocaleDateString() : 'None',
        subtitle: lastCompleted ?
          `${lastCompleted.treatment || 'Treatment'} - $${lastCompleted.cost || 0}` :
          'No previous visits',
        icon: <FileText className="h-6 w-6" />,
        color: "green"
      },
      {
        title: "Total Visits",
        value: patientAppointments.filter(appt => appt.status === 'completed').length,
        icon: <TrendingUp className="h-6 w-6" />,
        color: "purple"
      },
      {
        title: "Pending Treatments",
        value: pendingTreatments.length,
        subtitle: `$${pendingTreatments.reduce((sum, t) => sum + (t.cost || 0), 0)} estimated`,
        icon: <Clock className="h-6 w-6" />,
        color: "yellow"
      }
    ];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                className="md:hidden mr-2 p-1 text-gray-500 hover:text-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                  ENTNT Dental Center
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {isAdmin() ? 'Admin Dashboard' : 'Patient Portal'}
                </p>
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:block text-sm text-gray-600">
                {formatTime(currentTime)}
              </div>

              <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-1 sm:space-x-3">
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-600">{user.role}</p>
                </div>
              </div>

              <button className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>

              <button
                onClick={logout}
                className="flex items-center px-2 py-1 sm:px-3 sm:py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="space-y-1 p-4">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>

            {isAdmin() && (
              <>
                <NavLink
                  to="/patients"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  <Users className="h-5 w-5 mr-3" />
                  Patients
                </NavLink>
                <NavLink
                  to="/appointments"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Appointments
                </NavLink>
                <NavLink
                  to="/calendar"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  <CalendarDays className="h-5 w-5 mr-3" />
                  Calendar
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex">

        <div className="hidden md:block w-64 bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
              }
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </NavLink>

            {isAdmin() && (
              <>
                <NavLink
                  to="/patients"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  <Users className="h-5 w-5 mr-3" />
                  Patients
                </NavLink>
                <NavLink
                  to="/appointments"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Appointments
                </NavLink>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`
                  }
                >
                  <CalendarDays className="h-5 w-5 mr-3" />
                  Calendar
                </NavLink>
              </>
            )}
          </nav>
        </div>


        <div className="flex-1 overflow-auto">

          <Outlet />


          {window.location.pathname === '/' && (
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
             
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Welcome back, {user.name}!
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {isAdmin()
                    ? "Today Schedules."
                    : "Here's your appointment and treatment information."}
                </p>

               
                <div className="mt-2 flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500">
                  <span>Last login: {new Date(user.loginTime).toLocaleString()}</span>
                </div>
              </div>

          
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {(isAdmin() ? adminStats : getPatientStats()).map((stat, index) => (
                  <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                        {stat.icon}
                      </div>
                      {stat.change && (
                        <span className={`text-xs sm:text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">{stat.value}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{stat.title}</p>
                      {stat.subtitle && (
                        <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

           
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Appointments Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {isAdmin() ? "Upcoming Appointments" : "Your Appointments"}
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-3 sm:space-y-4">
                      {(isAdmin() ?
                        JSON.parse(localStorage.getItem('dental_appointments') || '[]')
                          .filter(app => new Date(app.appointmentDate) > new Date())
                          .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                          .slice(0, 5)
                        : patientAppointments
                      ).map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            {getStatusIcon(appointment.status)}
                            <div className="min-w-0">
                              <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                {appointment.patientName || appointment.patient}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{appointment.treatment}</p>
                              {isAdmin() ? (
                                <p className="text-xs text-gray-500 truncate">
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} - {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-500 truncate">
                                  {new Date(appointment.appointmentDate).toLocaleDateString()} - {new Date(appointment.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {appointment.cost && ` • $${appointment.cost}`}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right min-w-fit">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(appointment.status)}`}>
                              {appointment.status.replace('-', ' ')}
                            </span>
                            {!isAdmin() && appointment.files?.length > 0 && (
                              <p className="text-xs text-gray-500 mt-1">
                                {appointment.files.length} file{appointment.files.length !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link
                      to="/appointments"
                      className="w-full mt-3 sm:mt-4 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block text-center"
                    >
                      {isAdmin() ? 'View All Appointments' : 'View Appointment History'}
                    </Link>
                  </div>
                </div>

               
                {isAdmin() ? (
                  <>
                    {/* Top Patients */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="p-4 sm:p-6 border-b border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top Patients</h3>
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="space-y-3 sm:space-y-4">
                          {JSON.parse(localStorage.getItem('dental_patients') || [])
                            .sort((a, b) => (b.visits || 0) - (a.visits || 0))
                            .slice(0, 3)
                            .map((patient, index) => (
                              <div key={patient.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <div className="bg-blue-100 text-blue-800 p-1 sm:p-2 rounded-full">
                                    <User className="h-3 sm:h-4 w-3 sm:w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{patient.name}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{patient.contact}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs sm:text-sm font-medium text-gray-900">{patient.visits || 0} visits</p>
                                </div>
                              </div>
                            ))}
                        </div>
                        <Link
                          to="/patients"
                          className="w-full mt-3 sm:mt-4 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block text-center"
                        >
                          View All Patients
                        </Link>
                      </div>
                    </div>

                    {/* Treatments Summary */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="p-4 sm:p-6 border-b border-gray-200">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Treatments Summary</h3>
                      </div>
                      <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs sm:text-sm font-medium text-green-800">Completed</h4>
                              <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 text-green-600" />
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-green-900 mt-1 sm:mt-2">
                              {JSON.parse(localStorage.getItem('dental_treatments') || [])
                                .filter(t => t.status === 'completed').length}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              ${JSON.parse(localStorage.getItem('dental_treatments') || [])
                                .filter(t => t.status === 'completed')
                                .reduce((sum, t) => sum + (t.cost || 0), 0)} revenue
                            </p>
                          </div>
                          <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs sm:text-sm font-medium text-yellow-800">Pending</h4>
                              <Clock className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-600" />
                            </div>
                            <p className="text-xl sm:text-2xl font-bold text-yellow-900 mt-1 sm:mt-2">
                              {JSON.parse(localStorage.getItem('dental_treatments') || [])
                                .filter(t => t.status === 'pending').length}
                            </p>
                            <p className="text-xs text-yellow-600 mt-1">
                              ${JSON.parse(localStorage.getItem('dental_treatments') || [])
                                .filter(t => t.status === 'pending')
                                .reduce((sum, t) => sum + (t.cost || 0), 0)} potential
                            </p>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs sm:text-sm font-medium text-blue-800">Monthly Revenue</h4>

                          </div>
                          <p className="text-xl sm:text-2xl font-bold text-blue-900 mt-1 sm:mt-2">
                            ${JSON.parse(localStorage.getItem('dental_treatments') || [])
                              .filter(t => new Date(t.date).getMonth() === new Date().getMonth())
                              .reduce((sum, t) => sum + (t.cost || 0), 0)}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                          </p>
                        </div>
                        <Link
                          to="/treatments"
                          className="w-full mt-3 sm:mt-4 px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block text-center"
                        >
                          View All Treatments
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 sm:p-6 border-b border-gray-200">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Your Treatment History</h3>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        {patientTreatments
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .slice(0, 5)
                          .map((treatment, index) => (
                            <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                {treatment.status === 'completed' ?
                                  <CheckCircle className="h-3 sm:h-4 w-3 sm:w-4 text-green-600" /> :
                                  <Clock className="h-3 sm:h-4 w-3 sm:w-4 text-yellow-600" />
                                }
                                <div className="min-w-0">
                                  <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{treatment.name}</p>
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                                    {new Date(treatment.date).toLocaleDateString()} • ${treatment.cost || 0}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full capitalize ${treatment.status === 'completed' ?
                                  'bg-green-100 text-green-800' :
                                  'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {treatment.status}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-500">
                <p>© 2025 ENTNT Dental Management System. All rights reserved.</p>
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;