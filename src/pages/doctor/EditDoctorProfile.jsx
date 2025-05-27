import React, { useEffect, useState, useRef } from "react";
import doctorService from "../../services/doctor.service";
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

const EditDoctorProfile = () => {
  let currentAccount = null;
  try {
    currentAccount = JSON.parse(localStorage.getItem("account"));
  } catch {
    currentAccount = null;
  }
  const doctorId = currentAccount?.doctor?.id;
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

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await doctorService.getDoctorById(doctorId);
        const data = response.data || response;
        console.log(data);
        setForm({
          doctorName: data.doctorName || "",
          doctorSortDesc: data.doctorSortDesc || "",
          doctorDetailDesc: data.doctorDetailDesc || "",
          examinationPrice: data.examinationPrice || "",
          userGender: data.account?.userGender?.toString() || "true",
          userDoB: data.account?.userDoB
            ? data.account.userDoB.slice(0, 10)
            : "",
          userAddress: data.account?.userAddress || "",
          username: data.account?.username || "",
          email: data.account?.email || "",
        });
        setAvatarPreview(data.account?.userAvatar || "/public/DoctorLogin.png");
      } catch {
        setError("Không thể tải thông tin bác sĩ.");
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchDoctor();
  }, [doctorId]);

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
        doctorName: form.doctorName,
        doctorSortDesc: form.doctorSortDesc,
        doctorDetailDesc: form.doctorDetailDesc,
        examinationPrice: form.examinationPrice,
        userGender: form.userGender,
        userDoB: form.userDoB,
        userAddress: form.userAddress,
      };
      await doctorService.updateDoctor(doctorId, updateData, userAvatarFile);
      setSuccess("Cập nhật thành công!");
      setTimeout(() => navigate("/doctor/profile"), 1200);
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
          Chỉnh sửa thông tin bác sĩ
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
            label="Email"
            name="email"
            value={form.email}
            fullWidth
            InputProps={{ readOnly: true }}
            margin="normal"
          />
          <TextField
            label="Họ và tên"
            name="doctorName"
            value={form.doctorName}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Mô tả ngắn"
            name="doctorSortDesc"
            value={form.doctorSortDesc}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mô tả chi tiết"
            name="doctorDetailDesc"
            value={form.doctorDetailDesc}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
            margin="normal"
          />
          <TextField
            label="Giá khám"
            name="examinationPrice"
            value={form.examinationPrice}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="number"
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
              onClick={() => navigate("/doctor/profile")}
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

export default EditDoctorProfile;
