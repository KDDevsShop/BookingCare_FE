import React, { useEffect, useState, useRef } from "react";
import patientService from "../../services/patient.service";
import {
  CircularProgress,
  Button,
  TextField,
  Avatar,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const EditPatientProfile = () => {
  let currentAccount = null;
  try {
    currentAccount = JSON.parse(localStorage.getItem("account"));
  } catch {
    currentAccount = null;
  }
  const patientId = currentAccount?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(
    currentAccount?.userAvatar || "/public/DoctorLogin.png"
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const avatarFileRef = useRef();
  const navigate = useNavigate();
  const baseUrl = "http://localhost:5000";

  console.log(avatarPreview);
  useEffect(() => {
    const fetchPatient = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await patientService.getPatientById(patientId);
        const data = response.data || response;
        setForm({
          patientName: data.patientName || "",
          patientPhone: data.patientPhone || "",
          patientEmail: data.patientEmail || "",
          userGender: data.account?.userGender?.toString() || "true",
          userDoB: data.account?.userDoB
            ? data.account.userDoB.slice(0, 10)
            : "",
          userAddress: data.account?.userAddress || "",
          username: data.account?.username || "",
        });
        setAvatarPreview(data.account?.userAvatar || "/public/DoctorLogin.png");
      } catch {
        setError("Không thể tải thông tin bệnh nhân.");
      } finally {
        setLoading(false);
      }
    };
    if (patientId) fetchPatient();
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const userAvatarFile = avatarFile;
      const updateData = {
        patientName: form.patientName,
        patientPhone: form.patientPhone,
        // patientEmail is not editable

        userGender: form.userGender,
        userDoB: form.userDoB,
        userAddress: form.userAddress,
      };
      await patientService.updatePatient(patientId, updateData, userAvatarFile);
      setSuccess("Cập nhật thành công!");
      setTimeout(() => navigate("/me"), 1200);
    } catch {
      setError("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 px-4 py-2 rounded border border-red-200 text-center">
        {error}
      </div>
    );
  }

  return (
    <Box className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <Paper elevation={4} className="max-w-xl w-full p-8 rounded-2xl">
        <Typography
          variant="h4"
          color="primary"
          align="center"
          fontWeight={700}
          gutterBottom
        >
          Chỉnh sửa thông tin cá nhân
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <Box className="flex flex-col items-center mb-4">
            <Avatar
              src={
                avatarPreview?.startsWith("blob:")
                  ? avatarPreview
                  : `${baseUrl}${avatarPreview}`
              }
              sx={{ width: 100, height: 100, mb: 1 }}
            />
            <Button
              variant="outlined"
              component="label"
              color="primary"
              className="mt-2"
            >
              Đổi ảnh đại diện
              <input
                type="file"
                accept="image/*"
                ref={avatarFileRef}
                onChange={handleAvatarChange}
                hidden
              />
            </Button>
            <Typography variant="caption" color="textSecondary">
              Chỉ chấp nhận ảnh PNG, JPG, JPEG. Dung lượng &lt; 2MB.
            </Typography>
          </Box>
          <TextField
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            fullWidth
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            label="Họ và tên"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Số điện thoại"
            name="patientPhone"
            value={form.patientPhone}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Email"
            name="patientEmail"
            value={form.patientEmail}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
            helperText="Không thể thay đổi email."
          />
          <Box className="flex items-center gap-6 mt-2">
            <Typography className="font-semibold">Giới tính:</Typography>
            <RadioGroup
              row
              name="userGender"
              value={form.userGender === "true" ? "true" : "false"}
              onChange={handleChange}
            >
              <FormControlLabel value="true" control={<Radio />} label="Nam" />
              <FormControlLabel value="false" control={<Radio />} label="Nữ" />
            </RadioGroup>
          </Box>
          <TextField
            label="Ngày sinh"
            name="userDoB"
            type="date"
            value={form.userDoB}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          <TextField
            label="Địa chỉ"
            name="userAddress"
            value={form.userAddress}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Box className="flex justify-between mt-8">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              size="large"
              sx={{ minWidth: 140 }}
            >
              Lưu thay đổi
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => navigate("/me")}
              size="large"
              sx={{ minWidth: 140 }}
            >
              Hủy
            </Button>
          </Box>
          {success && (
            <Typography color="success.main" align="center" sx={{ mt: 2 }}>
              {success}
            </Typography>
          )}
        </form>
      </Paper>
    </Box>
  );
};

export default EditPatientProfile;
