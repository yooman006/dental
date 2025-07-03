import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Clock, CheckCircle, AlertCircle, Edit, Trash2, FileText, Download, Eye } from 'lucide-react';
import AppointmentForm from './AppointmentForm';

const Appointments = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const defaultAppointment = {
    id: '',
    patientId: '',
    patientName: '',
    title: '',
    description: '',
    comments: '',
    appointmentDate: new Date().toISOString(),
    cost: 0,
    treatment: '',
    status: 'scheduled',
    nextAppointmentDate: '',
    files: [],
    createdAt: new Date().toISOString()
  };

  const getPredefinedAppointment = () => ({
    id: `i${Date.now()}`,
    patientId: 'p1',
    patientName: 'John Doe',
    title: 'Toothache',
    description: 'Upper molar pain',
    comments: 'Sensitive to cold',
    appointmentDate: new Date(Date.now() + 86400000).toISOString(), 
    cost: 150,
    treatment: 'Root canal treatment',
    status: 'scheduled',
    nextAppointmentDate: new Date(Date.now() + 7 * 86400000).toISOString(), 
    files: [
      {
        name: 'invoice.pdf',
        url: '/assets/invoice.pdf',
        type: 'pdf'
      },
      {
        name: 'xray.png',
        url: '/assets/xray.png',
        type: 'image'
      }
    ],
    createdAt: new Date().toISOString()
  });

  const initializeAppointments = () => {
    try {
      const storedAppointments = JSON.parse(localStorage.getItem('dental_appointments')) || [];
      if (storedAppointments.length === 0) {
        const initialAppointments = [getPredefinedAppointment()];
        localStorage.setItem('dental_appointments', JSON.stringify(initialAppointments));
        return initialAppointments;
      }
      return storedAppointments;
    } catch (error) {
      console.error('Error initializing appointments:', error);
      return [];
    }
  };

  const loadAppointments = () => {
    setIsLoading(true);
    try {
      const storedAppointments = initializeAppointments();
      setAppointments(storedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const saveAppointments = (updatedAppointments) => {
    localStorage.setItem('dental_appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);
  };

  const filterAppointments = appointments
    .filter(appt => {
      if (filter === 'all') return true;
      if (filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        return appt.appointmentDate?.split('T')[0] === today;
      }
      return appt.status?.toLowerCase() === filter.toLowerCase();
    })
    .filter(appt => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (appt.title?.toLowerCase() || '').includes(searchLower) ||
        (appt.description?.toLowerCase() || '').includes(searchLower) ||
        (appt.patientId?.toLowerCase() || '').includes(searchLower) ||
        (appt.comments?.toLowerCase() || '').includes(searchLower) ||
        (appt.treatment?.toLowerCase() || '').includes(searchLower) ||
        (appt.patientName?.toLowerCase() || '').includes(searchLower)
      );
    });

  const getStatusIcon = (status) => {
    if (!status) return <Clock className="h-4 w-4 text-yellow-600" />;

    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleAddAppointment = () => {
    setCurrentAppointment({ ...defaultAppointment });
    setShowModal(true);
  };

  const handleEditAppointment = (appt) => {
    setCurrentAppointment(appt);
    setShowModal(true);
  };

  const handleSaveAppointment = (apptData) => {
    let updatedAppointments;

    if (apptData.id && appointments.some(a => a.id === apptData.id)) {
      updatedAppointments = appointments.map(a =>
        a.id === apptData.id ? { ...a, ...apptData } : a
      );
    } else {
      const newAppointment = {
        ...defaultAppointment,
        ...apptData,
        id: `i${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      updatedAppointments = [...appointments, newAppointment];
    }

    saveAppointments(updatedAppointments);
    setShowModal(false);
  };

  const deleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updatedAppointments = appointments.filter(a => a.id !== id);
      saveAppointments(updatedAppointments);
    }
  };

  const viewAppointmentDetails = (id) => {
    navigate(`/appointments/${id}`);
  };

  const viewFile = (e, file) => {
    e.stopPropagation();

    try {
      if (file.type === 'image' || file.name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>${file.name}</title>
                <style>
                  body { margin: 0; padding: 20px; background: #f0f0f0; text-align: center; }
                  img { max-width: 100%; max-height: 90vh; object-fit: contain; border: 1px solid #ddd; background: white; }
                  .filename { margin-bottom: 20px; font-family: Arial, sans-serif; color: #333; }
                </style>
              </head>
              <body>
                <div class="filename">${file.name}</div>
                <img src="${file.url}" alt="${file.name}" />
              </body>
            </html>
          `);
          newWindow.document.close();
        }
      } else {
        window.open(file.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      window.open(file.url, '_blank');
    }
  };

  const downloadFile = (e, file) => {
    e.stopPropagation();

    try {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      window.open(file.url, '_blank');
    }
  };

  const getIcon = (file) => {
    if (file.type === 'image' || file.name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      return '🖼️';
    } else if (file.type === 'pdf' || file.name.match(/\.pdf$/i)) {
      return '📄';
    } else {
      return '📎';
    }
  };

  if (!isAdmin()) {
    return <div className="p-8 text-center">You don't have permission to view this page.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
        <button
          onClick={handleAddAppointment}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Appointment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 flex-1">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="bg-transparent w-full outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('today')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'today' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-3 py-1 text-sm rounded-md ${filter === 'cancelled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filterAppointments.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No appointments found
          </div>
        ) : (
          <div className="space-y-4">
            {filterAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => viewAppointmentDetails(appt.id)}
              >
                <div className="flex items-center mb-3 sm:mb-0">
                  <div className="mr-4">
                    {getStatusIcon(appt.status)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{appt.title || 'Untitled Appointment'}</h3>
                    <p className="text-sm text-gray-600">{appt.description || 'No description'}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {appt.patientName} (ID: {appt.patientId}) • Treatment: {appt.treatment || 'N/A'} • Cost: ${appt.cost || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'No date'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time'}
                    </span>
                  </div>
                  {appt.files?.length > 0 && (
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="h-4 w-4 mr-1" />
                      <div className="flex flex-wrap gap-2">
                        {appt.files.map((file, i) => (
                          <div key={i} className="flex items-center bg-white rounded border px-2 py-1">
                            <span className="mr-1">{getIcon(file)}</span>
                            <span className="text-xs mr-2">{file.name}</span>
                            <div className="flex space-x-1">
                              <button
                                onClick={(e) => viewFile(e, file)}
                                className="text-blue-600 hover:text-blue-800"
                                title="View file"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                              <button
                                onClick={(e) => downloadFile(e, file)}
                                className="text-green-600 hover:text-green-800"
                                title="Download file"
                              >
                                <Download className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAppointment(appt);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteAppointment(appt.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AppointmentForm
          appointment={currentAppointment}
          onSave={handleSaveAppointment}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Appointments;