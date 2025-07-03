export const initializeMockData = () => {
  if (!localStorage.getItem('dental_patients')) {
    const patients = [
      {
        id: 'p1',
        name: 'John Doe',
        dob: '1990-05-10',
        contact: '1234567890',
        healthInfo: 'No allergies',
        visits: 1,

      },
    
    ];
    localStorage.setItem('dental_patients', JSON.stringify(patients));
  }

  if (!localStorage.getItem('dental_appointments')) {
    const appointments = [
      {
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
            url:'/assets/xray.png',
            type:'img'
          }
        ],
        createdAt: new Date().toISOString()
      },
      ...Array.from({ length: 0 }, (_, i) => ({
        id: `i${Date.now() + i}`,
        patientId: `p${i % 4 + 1}`,
        patientName: ['John Doe',][i % 4],
        title: ['Checkup',][i % 4],
        description: ['Regular dental checkup', ][i % 4],
        appointmentDate: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
        cost: [100, 80, 150, 200][i % 4],
        treatment: ['Examination', ][i % 4],
        status: 'scheduled',
        createdAt: new Date().toISOString()
      }))
    ];
    localStorage.setItem('dental_appointments', JSON.stringify(appointments));
  }

  if (!localStorage.getItem('dental_treatments')) {
    const treatments = [
      { id: 't1', patientId: 'p1', name: 'Root Canal', status: 'completed', cost: 500, date: '2025-06-20' },
      
    ];
    localStorage.setItem('dental_treatments', JSON.stringify(treatments));
  }
};