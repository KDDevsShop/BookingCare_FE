import React, { useEffect, useState, useRef } from 'react';
import doctorService from '../../services/doctor.service';
import AuthService from '../../services/auth.service';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { toast } from 'react-toastify';

const EditDoctorProfile = () => {
  let currentAccount = null;
  try {
    currentAccount = JSON.parse(localStorage.getItem('account'));
  } catch {
    currentAccount = null;
  }
  const doctorId = currentAccount?.doctor?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(
    currentAccount?.userAvatar || '/public/DoctorLogin.png'
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const avatarFileRef = useRef();
  const navigate = useNavigate();
  const baseUrl = 'http://localhost:5000';

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await doctorService.getDoctorById(doctorId);
        const data = response.data || response;
        console.log(data);
        setForm({
          doctorName: data.doctorName || '',
          doctorTitle: data.doctorTitle || '',
          doctorSortDesc: data.doctorSortDesc || '',
          doctorDetailDesc: data.doctorDetailDesc || '',
          examinationPrice: data.examinationPrice || '',
          userGender: data.account?.userGender?.toString() || 'true',
          userDoB: data.account?.userDoB
            ? data.account.userDoB.slice(0, 10)
            : '',
          userAddress: data.account?.userAddress || '',
          username: data.account?.username || '',
          email: data.account?.email || '',
        });
        setAvatarPreview(data.account?.userAvatar || '/public/DoctorLogin.png');
      } catch {
        setError('Không thể tải thông tin bác sĩ.');
      } finally {
        setLoading(false);
      }
    };
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
    setError('');
    setSuccess('');
    try {
      const userAvatarFile = avatarFile;
      const updateData = {
        doctorName: form.doctorName,
        doctorTitle: form.doctorTitle || '',
        doctorSortDesc: form.doctorSortDesc,
        doctorDetailDesc: form.doctorDetailDesc,
        examinationPrice: form.examinationPrice,
        userGender: form.userGender,
        userDoB: form.userDoB,
        userAddress: form.userAddress,
      };
      await doctorService.updateDoctor(doctorId, updateData, userAvatarFile);
      setSuccess('Cập nhật thành công!');
      setTimeout(() => navigate('/doctor/profile'), 1200);
    } catch {
      setError('Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleOpenPasswordModal = () => {
    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
    setOpenPasswordModal(true);
  };

  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Mật khẩu mới và xác nhận không khớp.');
      return;
    }
    setPasswordLoading(true);
    try {
      const response = await AuthService.changePassword(
        currentAccount.id,
        passwordForm.oldPassword,
        passwordForm.newPassword
      );

      if (response.status !== 200) {
        throw new Error(
          response?.message ||
            response ||
            'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.'
        );
      }

      toast.success('Đổi mật khẩu thành công!');
      setTimeout(() => {
        setOpenPasswordModal(false);
        navigate('/login');
      }, 1200);
    } catch (err) {
      console.log(err);
      toast.error('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.');
      setPasswordError('Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.');
    }
    setPasswordLoading(false);
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
                avatarPreview?.startsWith('blob:')
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
            label="Chức danh"
            name="doctorTitle"
            value={form.doctorTitle || ''}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: true }}
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
            InputProps={{ readOnly: true }}
            margin="normal"
            type="number"
          />
          <Box className="flex items-center gap-6 mt-2">
            <Typography className="font-semibold">Giới tính:</Typography>
            <RadioGroup
              row
              name="userGender"
              value={form.userGender === 'true' ? 'true' : 'false'}
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
          <Box className="flex justify-between mt-8 gap-4">
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
              onClick={() => navigate('/doctor/profile')}
              size="large"
              sx={{ minWidth: 140 }}
            >
              Hủy
            </Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={handleOpenPasswordModal}
              size="large"
              sx={{ minWidth: 160 }}
            >
              Đổi mật khẩu
            </Button>
          </Box>
          {success && (
            <Typography color="success.main" align="center" sx={{ mt: 2 }}>
              {success}
            </Typography>
          )}
        </form>
      </Paper>
      {/* Password Change Modal */}
      <Dialog
        open={openPasswordModal}
        onClose={handleClosePasswordModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <form onSubmit={handleSubmitPassword}>
          <DialogContent dividers>
            <TextField
              label="Mật khẩu cũ"
              name="oldPassword"
              type={showPassword.old ? 'text' : 'password'}
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => handleShowPassword('old')}
                    edge="end"
                  >
                    {showPassword.old ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Mật khẩu mới"
              name="newPassword"
              type={showPassword.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => handleShowPassword('new')}
                    edge="end"
                  >
                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type={showPassword.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => handleShowPassword('confirm')}
                    edge="end"
                  >
                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            {passwordError && (
              <Typography color="error" align="center" sx={{ mt: 1 }}>
                {passwordError}
              </Typography>
            )}
            {passwordSuccess && (
              <Typography color="success.main" align="center" sx={{ mt: 1 }}>
                {passwordSuccess}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClosePasswordModal}
              color="secondary"
              disabled={passwordLoading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={passwordLoading}
            >
              {passwordLoading ? <CircularProgress size={20} /> : 'Xác nhận'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default EditDoctorProfile;
