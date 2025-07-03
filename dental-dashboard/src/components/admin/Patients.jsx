import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import PatientForm from './PatientForm';

const Patients = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    setIsLoading(true);
    try {
      const storedPatients = JSON.parse(localStorage.getItem('dental_patients')) || [];
      setPatients(storedPatients);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm) ||
    (patient.email && patient.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

 
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handleAddPatient = () => {
    setCurrentPatient(null);
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setCurrentPatient(patient);
    setShowModal(true);
  };

  const handleSavePatient = (patientData) => {
    let updatedPatients;
    
    if (patientData.id) {
    
      updatedPatients = patients.map(p => 
        p.id === patientData.id ? { ...p, ...patientData } : p
      );
    } else {
     
      const newPatient = {
        ...patientData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      updatedPatients = [...patients, newPatient];
    }

    setPatients(updatedPatients);
    localStorage.setItem('dental_patients', JSON.stringify(updatedPatients));
    setShowModal(false);
    loadPatients(); 
  };

  const deletePatient = (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      const updatedPatients = patients.filter(patient => patient.id !== id);
      setPatients(updatedPatients);
      localStorage.setItem('dental_patients', JSON.stringify(updatedPatients));
      loadPatients(); 
    }
  };

  const viewPatientDetails = (id) => {
    navigate(`/patients/${id}`);
  };

  if (!isAdmin()) {
    return <div className="p-8 text-center">You don't have permission to view this page.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Patient Management</h2>
        <button
          onClick={handleAddPatient}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Patient
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6 flex items-center bg-gray-50 rounded-lg px-4 py-2">
          <Search className="h-5 w-5 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search patients by name, email or contact..."
            className="bg-transparent w-full outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);  
            }}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm ? 'No patients match your search' : 'No patients found'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOB</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health Info</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => viewPatientDetails(patient.id)}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {patient.contact}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {patient.healthInfo || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditPatient(patient);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePatient(patient.id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Patient Form Modal */}
      {showModal && (
        <PatientForm
          patient={currentPatient}
          onSave={handleSavePatient}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Patients;