import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Eye, Download, Trash2 } from 'lucide-react';

const AppointmentForm = ({ appointment, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    comments: '',
    appointmentDate: new Date().toISOString().slice(0, 16),
    cost: '',
    treatment: '',
    status: 'scheduled',
    nextAppointmentDate: '',
    patientId: '',
    patientName: '',
    files: []
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        title: appointment.title || '',
        description: appointment.description || '',
        comments: appointment.comments || '',
        appointmentDate: appointment.appointmentDate ? 
          appointment.appointmentDate.slice(0, 16) : 
          new Date().toISOString().slice(0, 16),
        cost: appointment.cost || '',
        treatment: appointment.treatment || '',
        status: appointment.status || 'scheduled',
        nextAppointmentDate: appointment.nextAppointmentDate ? 
          appointment.nextAppointmentDate.slice(0, 16) : '',
        patientId: appointment.patientId || '',
        patientName: appointment.patientName || '',
        files: appointment.files || []
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => {
      
      let type = 'document';
      if (file.type.startsWith('image/')) {
        type = 'image';
      } else if (file.type === 'application/pdf') {
        type = 'pdf';
      }

      return {
        name: file.name,
        url: URL.createObjectURL(file),
        type: type,
        size: file.size
      };
    });
    
    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }));
  };

  const deletefile = (index) => {
    setFormData(prev => {
      const newFiles = [...prev.files];
      
      if (newFiles[index].url.startsWith('blob:')) {
        URL.revokeObjectURL(newFiles[index].url);
      }
      newFiles.splice(index, 1);
      return {
        ...prev,
        files: newFiles
      };
    });
  };

  const viewFile = (file) => {
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

  const downloadFile = (file) => {
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

  const geticon = (file) => {
    if (file.type === 'image' || file.name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
      return '🖼️';
    } else if (file.type === 'pdf' || file.name.match(/\.pdf$/i)) {
      return '📄';
    } else {
      return '📎';
    }
  };

  const filesize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...appointment,
      ...formData,
    });
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-2xl rounded bg-white p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">
              {appointment ? 'Edit Appointment' : 'Add New Appointment'}
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient ID*</label>
                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient Name*</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status*</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="follow-up">Follow-up Needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Comments</label>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Appointment Date & Time*</label>
                  <input
                    type="datetime-local"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Next Appointment Date</label>
                  <input
                    type="datetime-local"
                    name="nextAppointmentDate"
                    value={formData.nextAppointmentDate}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost</label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Treatment</label>
                  <input
                    type="text"
                    name="treatment"
                    value={formData.treatment}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Files (Invoices, Images, etc.)</label>
                
                {/* Display existing files */}
                {formData.files.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{geticon(file)}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            {file.size && (
                              <p className="text-xs text-gray-500">{filesize(file.size)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => viewFile(file)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="View file"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadFile(file)}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deletefile(index)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Remove file"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* File input */}
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-gray-500 
                    file:mr-4 file:py-2 file:px-4 
                    file:rounded-md file:border-0 
                    file:text-sm file:font-semibold 
                    file:bg-blue-50 file:text-blue-700 
                    hover:file:bg-blue-100
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: Images (JPG, PNG, GIF, etc.), PDF, Word documents
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {appointment ? 'Update Appointment' : 'Add Appointment'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AppointmentForm;