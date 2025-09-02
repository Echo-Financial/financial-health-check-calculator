// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authHeaders } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import '../styles/adminDashboard.scss';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '4px',
  maxWidth: '600px',
  width: '90%',
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
};

const AdminDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionError, setActionError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reviews`,
          { headers: authHeaders() }
        );
        setReviews(response.data.reviews);
      } catch (err) {
        if (err?.response?.status === 401) {
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('adminToken');
          } catch (_) {}
          navigate('/admin/login');
          return;
        }
        setError(err.response?.data?.message || 'Failed to load reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleOpenDetails = (review) => {
    setSelectedReview(review);
  };

  const handleCloseDetails = () => {
    setSelectedReview(null);
    setActionError('');
  };

  const handleAction = async (reviewId, action, notes = '') => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reviews/${reviewId}/status`,
        { status: action, notes },
        { headers: authHeaders() }
      );
      setReviews((prev) =>
        prev.map((r) => (r._id === reviewId ? response.data.review : r))
      );
      handleCloseDetails();
    } catch (err) {
      console.error('Error updating review:', err);
      if (err?.response?.status === 401) {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('adminToken');
        } catch (_) {}
        navigate('/admin/login');
        return;
      }
      setActionError(err.response?.data?.message || 'Failed to update review.');
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#101828', color: '#fff', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Logout
      </Button>
      {loading && <Typography>Loading reviews...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {reviews.length === 0 && !loading && <Typography>No reviews found.</Typography>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reviews.map((review) => (
          <li key={review._id} className="admin-review-item">
            <Typography variant="subtitle1">
              <strong>{review.clientEmail}</strong> - {review.adviceType} - Status: {review.status}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => handleOpenDetails(review)} 
              className="view-details-button"
              style={{ backgroundColor: '#c68922', color: '#f4f7fa' }} // Brand accent for background, brand primary for text
            >
              View Details
            </Button>

          </li>
        ))}
      </ul>

      {/* Modal for Review Details */}
      <Modal open={!!selectedReview} onClose={handleCloseDetails}>
        <Box sx={modalStyle} className="admin-modal">
          {selectedReview && (
            <>
              <Typography variant="h5" className="admin-modal-header" gutterBottom>
                Review Details
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Client Email:</strong> {selectedReview.clientEmail}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Client Name:</strong> {selectedReview.clientName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Advice Type:</strong> {selectedReview.adviceType}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Status:</strong> {selectedReview.status}
              </Typography>
              <div className="modal-section">
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Original Advice:</strong>
                </Typography>
                <div className="admin-text-block">
                  <ReactMarkdown>{selectedReview.originalAdvice}</ReactMarkdown>
                </div>
              </div>
              <div className="modal-section">
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Recommendations:</strong>
                </Typography>
                <div className="admin-text-block">
                  <ReactMarkdown>
                    { "```json\n" + JSON.stringify(selectedReview.recommendations, null, 2) + "\n```" }
                  </ReactMarkdown>
                </div>
              </div>
              {actionError && <Typography color="error" mt={2}>{actionError}</Typography>}
              {selectedReview.status === 'pending' && (
                <div className="admin-modal-actions">
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleAction(selectedReview._id, 'approved', 'Reviewed and approved.')}
                  >
                    Approve
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => handleAction(selectedReview._id, 'rejected', 'Review rejected.')}
                  >
                    Reject
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => handleAction(selectedReview._id, 'modified', 'Review modified.')}
                  >
                    Modify
                  </Button>
                </div>
              )}
              <Button variant="text" onClick={handleCloseDetails} sx={{ marginTop: '1rem' }}>
                Close
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
