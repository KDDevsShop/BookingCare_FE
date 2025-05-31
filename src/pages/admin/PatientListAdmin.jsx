import { useEffect, useState } from 'react';
import DataTable from '../../components/DataTable';
import patientService from '../../services/patient.service';
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'patientName', headerName: 'Tên bệnh nhân', flex: 1.5 },
  { field: 'patientPhone', headerName: 'Số điện thoại', flex: 1 },
  { field: 'patientEmail', headerName: 'Email', flex: 1.5 },
  {
    field: 'gender',
    headerName: 'Giới tính',
    width: 100,
    renderCell: (params) => {
      return params.row.account?.userGender === true ? 'Nam' : 'Nữ';
    },
  },
  {
    field: 'dob',
    headerName: 'Ngày sinh',
    width: 120,
    renderCell: (params) => {
      return params.row.account?.userDoB
        ? new Date(params.row.account.userDoB).toLocaleDateString('vi-VN')
        : '';
    },
  },
  {
    field: 'address',
    headerName: 'Địa chỉ',
    flex: 1.5,
    renderCell: (params) => {
      return params.row.account?.userAddress || '';
    },
  },
];

function PatientListAdmin() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewPatient, setViewPatient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientService.getAllPatients();
      setPatients(res || []);
    } catch (e) {
      setPatients([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleView = (params) => {
    setViewPatient(params.row);
  };

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await patientService.deletePatient(confirmDelete.id);
      setConfirmDelete({ open: false, id: null });
      fetchPatients();
    } catch (e) {
      // handle error
    }
  };

  const actionColumns = [
    ...columns,
    {
      field: 'actions',
      headerName: 'Chức năng',
      width: 140,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton color="primary" onClick={() => handleView(params)}>
            <Visibility />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => setConfirmDelete({ open: true, id: params.row.id })}
          >
            <Delete />
          </IconButton>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2} color="primary.main">
        Danh sách bệnh nhân
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataTable
          columns={actionColumns}
          rows={patients.map((p) => ({ ...p, id: p.id }))}
          checkboxSelection={false}
        />
      )}

      {/* View Patient Dialog */}
      <Dialog
        open={!!viewPatient}
        onClose={() => setViewPatient(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Thông tin bệnh nhân</DialogTitle>
        <DialogContent>
          {viewPatient && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar
                  src={
                    viewPatient.account?.userAvatar
                      ? `http://localhost:5000${viewPatient.account.userAvatar}`
                      : undefined
                  }
                  sx={{ width: 64, height: 64 }}
                >
                  {viewPatient.patientName?.[0]}
                </Avatar>
                <Typography variant="h6">{viewPatient.patientName}</Typography>
              </Box>
              <Typography>
                <b>Email:</b> {viewPatient.patientEmail}
              </Typography>
              <Typography>
                <b>Số điện thoại:</b> {viewPatient.patientPhone}
              </Typography>
              <Typography>
                <b>Giới tính:</b>{' '}
                {viewPatient.account?.userGender === true ? 'Nam' : 'Nữ'}
              </Typography>
              <Typography>
                <b>Ngày sinh:</b>{' '}
                {viewPatient.account?.userDoB
                  ? new Date(viewPatient.account.userDoB).toLocaleDateString(
                      'vi-VN'
                    )
                  : ''}
              </Typography>
              <Typography>
                <b>Địa chỉ:</b> {viewPatient.account?.userAddress || ''}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPatient(null)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, id: null })}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa bệnh nhân này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })}>
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default PatientListAdmin;
