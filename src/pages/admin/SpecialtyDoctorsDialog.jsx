import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DoctorService from '../../services/doctor.service';
import DoctorForm from './DoctorForm';
import { toast } from 'react-toastify';
import { EditIcon } from 'lucide-react';

const blue = '#2563eb';

const SpecialtyDoctorsDialog = ({ open, onClose, specialty }) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    doctor: null,
  });

  const fetchDoctors = async () => {
    if (!specialty) return;
    setLoading(true);
    try {
      const res = await DoctorService.getAllDoctors();
      const filtered = res.filter((doc) => doc.specialtyId === specialty.id);
      setDoctors(filtered);
    } catch (err) {
      console.log(err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchDoctors();
    // eslint-disable-next-line
  }, [open, specialty]);

  const handleCreate = () => {
    setSelectedDoctor(null);
    setOpenForm(true);
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenForm(true);
  };

  const handleView = (doctor) => {
    setViewDoctor(doctor);
  };

  const handleDelete = (doctor) => {
    setConfirmDelete({ open: true, doctor });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete.doctor) return;
    try {
      await DoctorService.deleteDoctor(confirmDelete.doctor.id);
      fetchDoctors();
    } catch (err) {
      console.log(err);
      toast.error('Xóa bác sĩ không thành công.');
    }
    setConfirmDelete({ open: false, doctor: null });
  };

  const handleFormSubmit = async (form, avatarFile) => {
    try {
      if (selectedDoctor) {
        await DoctorService.updateDoctor(
          selectedDoctor.id,
          { ...form, specialtyId: specialty.id },
          avatarFile
        );
      } else {
        await DoctorService.createDoctor(
          { ...form, specialtyId: specialty.id },
          avatarFile
        );
      }
      setOpenForm(false);
      fetchDoctors();
    } catch (err) {
      console.log(err);
      toast.error('Lưu thông tin bác sĩ không thành công.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ color: blue, fontWeight: 700, fontSize: 24 }}>
        Danh sách bác sĩ - {specialty?.specialtyName}
      </DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ background: blue, borderRadius: 2, fontWeight: 700 }}
            onClick={handleCreate}
          >
            Thêm bác sĩ
          </Button>
        </Box>
        <Box>
          {doctors.length === 0 ? (
            <Typography color="text.secondary">
              Chưa có bác sĩ nào cho chuyên khoa này.
            </Typography>
          ) : (
            doctors.map((doctor) => (
              <Box
                key={doctor.id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                mb={2}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 12px #e0e7ff',
                  background: '#f8fafc',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={
                      doctor.account?.userAvatar
                        ? `http://localhost:5000${doctor.account.userAvatar}`
                        : '/DoctorLogin.png'
                    }
                    alt={doctor.doctorName}
                    sx={{ width: 56, height: 56, border: `2px solid ${blue}` }}
                  />
                  <Box>
                    <Typography fontWeight={700} color={blue}>
                      {doctor.doctorName}
                    </Typography>
                    <Typography fontSize={14} color="text.secondary">
                      {doctor.doctorTitle}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Xem chi tiết">
                    <IconButton color="info" onClick={() => handleView(doctor)}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(doctor)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xoá">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(doctor)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: blue, fontWeight: 700 }}>
          Đóng
        </Button>
      </DialogActions>
      {/* Doctor Form Dialog */}
      <DoctorForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        doctor={selectedDoctor}
        specialties={[specialty]}
        loading={loading}
      />
      {/* View Doctor Dialog */}
      <Dialog
        open={!!viewDoctor}
        onClose={() => setViewDoctor(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: blue, fontWeight: 700 }}>
          Chi tiết bác sĩ
        </DialogTitle>
        <DialogContent>
          {viewDoctor && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
            >
              <Avatar
                src={
                  viewDoctor.account?.userAvatar
                    ? `http://localhost:5000${viewDoctor.account.userAvatar}`
                    : '/DoctorLogin.png'
                }
                alt={viewDoctor.doctorName}
                sx={{ width: 80, height: 80, border: `2px solid ${blue}` }}
              />
              <Typography fontWeight={700} fontSize={22} color={blue}>
                {viewDoctor.doctorName}
              </Typography>
              <Typography fontSize={16}>{viewDoctor.doctorTitle}</Typography>
              <Typography fontSize={15} color="text.secondary">
                {viewDoctor.doctorSortDesc}
              </Typography>
              <Typography fontSize={15} color="text.secondary">
                {viewDoctor.doctorDetailDesc}
              </Typography>
              <Typography fontSize={15} color={blue}>
                Giá khám: {Number(viewDoctor.examinationPrice).toLocaleString()}{' '}
                VNĐ
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setViewDoctor(null)}
            sx={{ color: blue, fontWeight: 700 }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, doctor: null })}
      >
        <DialogTitle>Xác nhận xoá bác sĩ</DialogTitle>
        <DialogContent>Bạn có chắc muốn xoá bác sĩ này?</DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDelete({ open: false, doctor: null })}
          >
            Huỷ
          </Button>
          <Button color="error" onClick={handleConfirmDelete}>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default SpecialtyDoctorsDialog;
