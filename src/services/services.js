import api from './api';

export const eventService = {
  getEvents:    (params) => api.get('/events', { params }),
  getEvent:     (id)     => api.get(`/events/${id}`),
  createEvent:  (data)   => api.post('/events', data),
  updateEvent:  (id, data) => api.put(`/events/${id}`, data),
  deleteEvent:  (id)     => api.delete(`/events/${id}`),
  getSchedule:  (params) => api.get('/events/schedule', { params }),
  getCategories:()       => api.get('/events/categories'),
};

export const registrationService = {
  register:         (data)    => api.post('/registrations', data),
  getMyRegistrations:()       => api.get('/registrations/my'),
  cancelRegistration:(id)     => api.put(`/registrations/${id}/cancel`),
  getParticipants:  (eventId) => api.get(`/registrations/event/${eventId}`),
  exportParticipants:(eventId) => api.get(`/registrations/event/${eventId}/export`, { responseType: 'blob' }),
  checkIn:          (id)      => api.put(`/registrations/${id}/checkin`),
};

export const adminService = {
  getStats:        () => api.get('/admin/stats'),
  getUsers:       (params) => api.get('/admin/users', { params }),
  toggleUser:     (id)  => api.put(`/admin/users/${id}/toggle`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getFests:       () => api.get('/admin/fests'),
  upsertFest:     (data) => api.post('/admin/fests', data),
};
