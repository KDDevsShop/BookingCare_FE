import React, { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import FAQService from '../../services/faq.service';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { toast } from 'react-toastify';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'question', headerName: 'Câu hỏi', flex: 2 },
  { field: 'answer', headerName: 'Trả lời', flex: 3 },
  {
    field: 'isActive',
    headerName: 'Kích hoạt',
    width: 120,
    renderCell: (params) => (
      <span
        className={`px-2 py-1 rounded-lg text-xs font-semibold ${
          params.value
            ? 'bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        {params.value ? 'Hiện' : 'Ẩn'}
      </span>
    ),
  },
];

const initialForm = { question: '', answer: '', isActive: true };

function FAQListAdmin() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [viewFAQ, setViewFAQ] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await FAQService.getAllFAQs();
      setFaqs(res);
    } catch {
      toast.error('Không thể tải danh sách FAQ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleOpenForm = (faq = null) => {
    if (faq) {
      setForm({
        question: faq.question,
        answer: faq.answer,
        isActive: faq.isActive,
      });
      setEditId(faq.id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await FAQService.updateFAQ(editId, form);
        toast.success('Cập nhật FAQ thành công!');
      } else {
        await FAQService.createFAQ(form);
        toast.success('Tạo FAQ mới thành công!');
      }
      fetchFAQs();
      handleCloseForm();
    } catch {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleDelete = async () => {
    try {
      await FAQService.deleteFAQ(confirmDelete.id);
      toast.success('Xóa FAQ thành công!');
      fetchFAQs();
    } catch {
      toast.error('Không thể xóa FAQ.');
    } finally {
      setConfirmDelete({ open: false, id: null });
    }
  };

  const actionColumns = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Chức năng',
      width: 180,
      renderCell: (params) => (
        <div className="flex gap-2">
          <IconButton color="primary" onClick={() => setViewFAQ(params.row)}>
            <Visibility />
          </IconButton>
          <IconButton color="info" onClick={() => handleOpenForm(params.row)}>
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => setConfirmDelete({ open: true, id: params.row.id })}
          >
            <Delete />
          </IconButton>
        </div>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-6">
      <div className="max-w-8xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">Danh sách FAQs</h2>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenForm()}
            sx={{ background: 'linear-gradient(to right, #3b82f6, #1e40af)' }}
          >
            Thêm FAQ
          </Button>
        </div>
        <DataTable
          columns={actionColumns}
          rows={faqs}
          loading={loading}
          checkboxSelection={false}
          disableSelectionOnClick
          pageSize={8}
        />
      </div>

      {/* FAQ Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle className="text-blue-700 font-bold">
          {editId ? 'Chỉnh sửa FAQ' : 'Tạo FAQ mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className="flex flex-col gap-4">
            <TextField
              label="Câu hỏi"
              name="question"
              value={form.question}
              onChange={handleFormChange}
              required
              fullWidth
              variant="outlined"
              color="primary"
            />
            <TextField
              label="Trả lời"
              name="answer"
              value={form.answer}
              onChange={handleFormChange}
              required
              fullWidth
              multiline
              minRows={3}
              variant="outlined"
              color="primary"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={form.isActive}
                onChange={handleFormChange}
              />
              <label htmlFor="isActive" className="text-blue-700 font-medium">
                Hiển thị FAQ
              </label>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForm} color="secondary">
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {editId ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* View FAQ Dialog */}
      <Dialog
        open={!!viewFAQ}
        onClose={() => setViewFAQ(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle className="text-blue-700 font-bold">
          Chi tiết FAQ
        </DialogTitle>
        <DialogContent>
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Câu hỏi: </span>
            {viewFAQ?.question}
          </div>
          <div className="mb-2">
            <span className="font-semibold text-blue-700">Trả lời: </span>
            {viewFAQ?.answer}
          </div>
          <div>
            <span className="font-semibold text-blue-700">Trạng thái: </span>
            {viewFAQ?.isActive ? 'Hiện' : 'Ẩn'}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewFAQ(null)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      >
        <DialogTitle>Xác nhận xóa FAQ</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa FAQ này?</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete({ open: false, id: null })}
            color="secondary"
          >
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FAQListAdmin;
