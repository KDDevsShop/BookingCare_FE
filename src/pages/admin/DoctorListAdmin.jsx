import React, { useEffect, useState } from "react";
import DoctorService from "../../services/doctor.service";
import DataTable from "../../components/DataTable";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DoctorForm from "./DoctorForm";
import SpecialtyService from "../../services/specialty.service";
import AuthService from "../../services/auth.service";
import { ToVietnamCurrencyFormat } from "../../utils/ToVietnamCurrencyFormat";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "avatar",
    headerName: "Ảnh đại diện",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Avatar
        src={
          params.row.account?.userAvatar
            ? `http://localhost:5000${params.row.account.userAvatar}`
            : "/DoctorLogin.png"
        }
        alt={params.row.doctorName}
        sx={{ width: 48, height: 48, margin: "auto" }}
      />
    ),
    sortable: false,
    filterable: false,
  },
  {
    field: "doctorName",
    headerName: "Tên bác sĩ",
    flex: 1.2,
    minWidth: 160,
  },
  {
    field: "doctorSortDesc",
    headerName: "Mô tả ngắn",
    flex: 1.5,
    minWidth: 180,
  },
  {
    field: "examinationPrice",
    headerName: "Giá khám (VNĐ)",
    flex: 1,
    minWidth: 120,
    valueFormatter: (params) => {
      console.log(params);
      return params ? Number(params).toLocaleString() : "-";
    },
  },
  // {
  //   field: "specialtyName",
  //   headerName: "Chuyên khoa",
  //   flex: 1,
  //   minWidth: 120,
  //   valueGetter: (params) => params.row.specialty?.specialtyName || "-",
  // },
];

const DoctorListAdmin = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editDoctor, setEditDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [specialties, setSpecialties] = useState([]);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    doctor: null,
  });

  const fetchDoctors = async () => {
    try {
      const res = await DoctorService.getAllDoctors();
      console.log(res);
      setDoctors(res || []);
    } catch {
      setError("Không thể tải danh sách bác sĩ");
    }
  };

  const fetchSpecialties = async () => {
    try {
      const res = await SpecialtyService.getAllSpecialties();
      setSpecialties(res || []);
    } catch {
      // ignore error
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchSpecialties();
  }, []);

  const handleCreate = () => {
    setEditDoctor(null);
    setOpenForm(true);
  };

  const handleEdit = (params) => {
    console.log(params.row);
    setEditDoctor(params.row);
    setOpenForm(true);
  };

  const handleDelete = (params) => {
    setConfirmDelete({ open: true, doctor: params.row });
  };

  const handleView = (params) => {
    setViewDoctor(params.row);
  };

  const handleFormSubmit = async (form, avatarFile) => {
    setLoading(true);
    try {
      if (editDoctor) {
        await DoctorService.updateDoctor(editDoctor.id, form, avatarFile);
      } else {
        await DoctorService.createDoctor(form, avatarFile);
      }
      setOpenForm(false);
      fetchDoctors();
    } catch {
      setError("Không thể lưu bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await DoctorService.deleteDoctor(confirmDelete.doctor.id);
      setConfirmDelete({ open: false, doctor: null });
      fetchDoctors();
    } catch {
      setError("Không thể xoá bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  const actionColumns = [
    ...columns,
    {
      field: "actions",
      headerName: "Chức năng",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Stack direction="row" spacing={1} padding={1} justifyContent="center">
          <Button
            size="small"
            variant="outlined"
            color="info"
            onClick={() => handleView(params)}
          >
            Xem
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(params)}
          >
            Sửa
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params)}
          >
            Xoá
          </Button>
        </Stack>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)",
        p: 4,
      }}
    >
      <Box maxWidth="xl" mx="auto">
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          mb={3}
          textAlign="center"
        >
          Quản lý bác sĩ
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={handleCreate}
        >
          Thêm bác sĩ mới
        </Button>
        {error && (
          <Typography color="error" mb={2} textAlign="center">
            {error}
          </Typography>
        )}
        <DataTable
          columns={actionColumns}
          rows={doctors}
          pageSize={10}
          checkboxSelection={false}
          disableSelectionOnClick
          autoHeight
        />
        <DoctorForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSubmit={handleFormSubmit}
          doctor={editDoctor}
          specialties={specialties}
          loading={loading}
        />
        <Dialog
          open={!!viewDoctor}
          onClose={() => setViewDoctor(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Chi tiết bác sĩ</DialogTitle>
          <DialogContent dividers>
            {viewDoctor && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Avatar
                  src={
                    viewDoctor.account?.userAvatar
                      ? `http://localhost:5000${viewDoctor.account.userAvatar}`
                      : "/DoctorLogin.png"
                  }
                  sx={{ width: 80, height: 80, mx: "auto" }}
                />
                <Typography variant="h6" textAlign="center">
                  {viewDoctor.doctorName}
                </Typography>
                <Typography textAlign="center">
                  {viewDoctor.doctorSortDesc}
                </Typography>
                <Typography>
                  Mô tả chi tiết: {viewDoctor.doctorDetailDesc}
                </Typography>
                <Typography>
                  Giá khám:{" "}
                  {Number(viewDoctor.examinationPrice).toLocaleString()} VNĐ
                </Typography>
                <Typography>
                  Phương thức thanh toán:{" "}
                  {viewDoctor.paymentMethods &&
                  viewDoctor.paymentMethods.length > 0
                    ? viewDoctor.paymentMethods
                        .map((pm) => pm.paymentMethodName)
                        .join(", ")
                    : "-"}
                </Typography>
                <Typography>
                  Chuyên khoa: {viewDoctor.specialty?.specialtyName || "-"}
                </Typography>
                <Typography>
                  Tài khoản: {viewDoctor.account?.username} (
                  {viewDoctor.account?.email})
                </Typography>
                <Typography>
                  Giới tính:{" "}
                  {viewDoctor.account?.userGender === true ||
                  viewDoctor.account?.userGender === "true"
                    ? "Nam"
                    : viewDoctor.account?.userGender === false ||
                      viewDoctor.account?.userGender === "false"
                    ? "Nữ"
                    : "-"}
                </Typography>
                <Typography>
                  Ngày sinh:{" "}
                  {viewDoctor.account?.userDoB
                    ? new Date(viewDoctor.account.userDoB).toLocaleDateString()
                    : "-"}
                </Typography>
                <Typography>
                  Địa chỉ: {viewDoctor.account?.userAddress || "-"}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDoctor(null)}>Đóng</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={confirmDelete.open}
          onClose={() => setConfirmDelete({ open: false, doctor: null })}
        >
          <DialogTitle>Xác nhận xoá bác sĩ</DialogTitle>
          <DialogContent>Bạn có chắc chắn muốn xoá bác sĩ này?</DialogContent>
          <DialogActions>
            <Button
              onClick={() => setConfirmDelete({ open: false, doctor: null })}
            >
              Huỷ
            </Button>
            <Button
              color="error"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              Xoá
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DoctorListAdmin;
