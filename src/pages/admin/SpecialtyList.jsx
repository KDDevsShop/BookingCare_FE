import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import SpecialtyService from "../../services/specialty.service";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { styled } from "@mui/material/styles";
import ImageIcon from "@mui/icons-material/Image";

const baseUrl = "http://localhost:5000";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "specialtyName", headerName: "Tên chuyên khoa", flex: 1 },

  { field: "specialtyDesc", headerName: "Mô tả", flex: 2 },
  { field: "doctorCount", headerName: "Số bác sĩ", width: 120 },
];

const defaultForm = {
  specialtyName: "",
  specialtyDesc: "",
  specialtyImage: null,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(80, 120, 200, 0.18)",
    background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "0 2px 8px rgba(80, 120, 200, 0.08)",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: 12,
    background: "#f4f7fe",
  },
}));

const SpecialtyList = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("create"); // create | edit | view
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const res = await SpecialtyService.getAllSpecialties();
      console.log(res);
      const data = res.map((item) => ({
        ...item,
        id: item.id,
        doctorCount: item.doctors?.length || 0,
      }));
      setSpecialties(data);
    } catch (err) {
      // error handled silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const handleOpenDialog = (type, row = null) => {
    setDialogType(type);
    setSelected(row);
    if (type === "edit" || type === "view") {
      setForm({
        specialtyName: row.specialtyName,
        specialtyDesc: row.specialtyDesc,
        specialtyImage: null,
      });
      setImagePreview(row.specialtyImage);
    } else {
      setForm(defaultForm);
      setImagePreview(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setForm(defaultForm);
    setImagePreview(null);
    setSelected(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "specialtyImage" && files && files[0]) {
      setForm((prev) => ({ ...prev, specialtyImage: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("specialtyName", form.specialtyName);
      formData.append("specialtyDesc", form.specialtyDesc);
      if (form.specialtyImage instanceof File) {
        formData.append("specialtyImage", form.specialtyImage);
      }
      let res;
      if (dialogType === "create") {
        res = await fetch(`${baseUrl}/api/specialties`, {
          method: "POST",
          body: formData,
        });
      } else if (dialogType === "edit" && selected) {
        res = await fetch(`${baseUrl}/api/specialties/${selected.id}`, {
          method: "PUT",
          body: formData,
        });
      }
      if (res && res.ok) {
        fetchSpecialties();
        handleCloseDialog();
      }
    } catch (err) {
      // Optionally log or show error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await SpecialtyService.api.request(`/${deleteId}`, "DELETE");
      fetchSpecialties();
      setOpenDelete(false);
      setDeleteId(null);
    } catch (err) {
      // error handled silently
    }
  };

  const actionColumn = {
    field: "actions",
    headerName: "Chức năng",
    flex: 1.5,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Box display="flex" gap={1} justifyContent="center">
        <Tooltip title="Xem chi tiết">
          <IconButton
            color="info"
            onClick={() => handleOpenDialog("view", params.row)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Chỉnh sửa">
          <IconButton
            color="primary"
            onClick={() => handleOpenDialog("edit", params.row)}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Xóa">
          <IconButton
            color="error"
            onClick={() => {
              setDeleteId(params.row.id);
              setOpenDelete(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  };

  return (
    <Box
      sx={{
        p: { xs: 1, md: 4 },
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        minHeight: "100vh",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
        sx={{
          background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
          borderRadius: 4,
          p: 3,
          boxShadow: "0 4px 24px rgba(80, 120, 200, 0.10)",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={800}
          color="#fff"
          letterSpacing={1}
        >
          Danh sách chuyên khoa
        </Typography>
        <StyledButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("create")}
          sx={{
            background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(90deg, #4f46e5 0%, #2563eb 100%)",
            },
          }}
        >
          Thêm chuyên khoa
        </StyledButton>
      </Box>
      <Box
        sx={{
          mt: 2,
          background: "#fff",
          borderRadius: 4,
          boxShadow: "0 2px 12px rgba(80, 120, 200, 0.08)",
          p: 2,
        }}
      >
        <DataTable
          columns={[...columns, actionColumn]}
          rows={specialties}
          pageSize={10}
          checkboxSelection={false}
          loading={loading}
        />
      </Box>

      {/* Dialog for create/edit/view */}
      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          fontWeight={800}
          color="primary.main"
          sx={{ textAlign: "center", fontSize: 28, letterSpacing: 1 }}
        >
          {dialogType === "create"
            ? "Thêm chuyên khoa"
            : dialogType === "edit"
            ? "Chỉnh sửa chuyên khoa"
            : "Chi tiết chuyên khoa"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ background: "#f8fafc" }}>
            <Box display="flex" flexDirection="column" gap={3}>
              <StyledTextField
                label="Tên chuyên khoa"
                name="specialtyName"
                value={form.specialtyName}
                onChange={handleFormChange}
                required
                fullWidth
                disabled={dialogType === "view"}
              />
              <StyledTextField
                label="Mô tả"
                name="specialtyDesc"
                value={form.specialtyDesc}
                onChange={handleFormChange}
                multiline
                minRows={3}
                fullWidth
                disabled={dialogType === "view"}
              />
              {dialogType !== "view" && (
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ borderRadius: 2 }}
                >
                  {form.specialtyImage
                    ? "Đổi ảnh đại diện"
                    : "Tải ảnh đại diện"}
                  <input
                    type="file"
                    name="specialtyImage"
                    accept="image/*"
                    hidden
                    onChange={handleFormChange}
                  />
                </Button>
              )}
              <Box display="flex" alignItems="center" gap={2}>
                {imagePreview && (
                  <Avatar
                    src={
                      imagePreview?.startsWith("blob:")
                        ? imagePreview
                        : `${baseUrl}${imagePreview}`
                    }
                    alt="preview"
                    variant="rounded"
                    sx={{
                      width: "100%",
                      height: 400,
                      border: "2px solid #6366f1",
                      boxShadow: "0 2px 8px #6366f133",
                    }}
                  />
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
            <StyledButton
              onClick={handleCloseDialog}
              color="inherit"
              sx={{ color: "#6366f1", background: "#e0e7ff" }}
            >
              Đóng
            </StyledButton>
            {dialogType !== "view" && (
              <StyledButton type="submit" variant="contained" color="primary">
                {dialogType === "create" ? "Tạo mới" : "Lưu thay đổi"}
              </StyledButton>
            )}
          </DialogActions>
        </form>
      </StyledDialog>

      {/* Delete confirm dialog */}
      <StyledDialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle
          fontWeight={700}
          color="error"
          sx={{ textAlign: "center" }}
        >
          Xác nhận xóa
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", fontSize: 18 }}>
          Bạn có chắc chắn muốn xóa chuyên khoa này?
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <StyledButton
            onClick={() => setOpenDelete(false)}
            color="inherit"
            sx={{ color: "#6366f1", background: "#e0e7ff" }}
          >
            Hủy
          </StyledButton>
          <StyledButton
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Xóa
          </StyledButton>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

export default SpecialtyList;
