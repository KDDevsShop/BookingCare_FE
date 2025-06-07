import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  CircularProgress,
  Avatar,
  Typography,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import DoctorService from '../../services/doctor.service';
import PaymentMethodService from '../../services/paymentMethod.service';

const initialState = {
  doctorName: '',
  doctorTitle: '',
  doctorSortDesc: '',
  doctorDetailDesc: '',
  examinationPrice: '',
  specialtyId: '',
  // Account fields
  username: '',
  password: '',
  email: '',
  userGender: '',
  userDoB: '',
  userAddress: '',
};

const DoctorForm = ({
  open,
  onClose,
  onSubmit,
  doctor,
  specialties,
  loading,
}) => {
  const [form, setForm] = useState(initialState);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayments, setSelectedPayments] = useState([]);

  const handleClose = () => {
    setForm(doctor);
    onClose();
  };

  useEffect(() => {
    if (doctor) {
      setForm({
        doctorName: doctor.doctorName || '',
        doctorTitle: doctor.doctorTitle || '',
        doctorSortDesc: doctor.doctorSortDesc || '',
        doctorDetailDesc: doctor.doctorDetailDesc || '',
        examinationPrice: doctor.examinationPrice || '',
        specialtyId: doctor.specialty?.id || doctor.specialtyId || '',
        username:
          doctor.account && doctor.account.username
            ? doctor.account.username
            : '',
        password: '', // Don't prefill password
        email:
          doctor.account && doctor.account.email ? doctor.account.email : '',
        userGender:
          doctor.account && typeof doctor.account.userGender !== 'undefined'
            ? doctor.account.userGender.toString()
            : 'true',
        userDoB:
          doctor.account && doctor.account.userDoB
            ? doctor.account.userDoB.slice(0, 10)
            : '',
        userAddress:
          doctor.account && doctor.account.userAddress
            ? doctor.account.userAddress
            : '',
      });
      setAvatarPreview(
        doctor.account && doctor.account.userAvatar
          ? `http://localhost:5000${doctor.account.userAvatar}`
          : ''
      );
    } else {
      setForm(initialState);
      setAvatarPreview('');
    }
    setAvatarFile(null);
  }, [doctor]);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await PaymentMethodService.getAllPaymentMethods();
        console.log(res);
        setPaymentMethods(res || []);
      } catch {
        // ignore error
      }
    }
    fetchPayments();
  }, []);

  useEffect(() => {
    if (doctor && doctor.paymentMethods) {
      setSelectedPayments(doctor.paymentMethods.map((pm) => pm.id));
    } else {
      setSelectedPayments([]);
    }
  }, [doctor]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'radio' ? value === 'true' : value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(file ? URL.createObjectURL(file) : '');
  };

  const handlePaymentChange = (e) => {
    const value = e.target.value;
    setSelectedPayments(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, paymentMethodIds: selectedPayments }, avatarFile);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'center' }}
      >
        {doctor ? 'Cập nhật bác sĩ' : 'Thêm bác sĩ mới'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                src={avatarPreview}
                sx={{ width: 64, height: 64, border: '2px solid #6366f1' }}
              />
              <Button
                variant="outlined"
                component="label"
                sx={{ borderRadius: 2 }}
              >
                {avatarPreview ? 'Đổi ảnh đại diện' : 'Chọn ảnh đại diện'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
            </Box>
            <TextField
              label="Tên bác sĩ"
              name="doctorName"
              value={form.doctorName}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              select
              label="Chức danh"
              name="doctorTitle"
              value={form.doctorTitle}
              onChange={handleChange}
              required
              fullWidth
            >
              <MenuItem value="Bác sĩ">Bác sĩ</MenuItem>
              <MenuItem value="Thạc sĩ">Thạc sĩ</MenuItem>
              <MenuItem value="Tiến sĩ">Tiến sĩ</MenuItem>
            </TextField>
            <TextField
              label="Mô tả ngắn"
              name="doctorSortDesc"
              value={form.doctorSortDesc}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Mô tả chi tiết"
              name="doctorDetailDesc"
              value={form.doctorDetailDesc}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Giá khám"
              name="examinationPrice"
              value={form.examinationPrice}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              select
              label="Chuyên khoa"
              name="specialtyId"
              value={form.specialtyId}
              onChange={handleChange}
              required
              fullWidth
            >
              {specialties.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.specialtyName}
                </MenuItem>
              ))}
            </TextField>
            {/* Payment Methods Selection - updated to use Select instead of deprecated SelectProps */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="payment-methods-label">
                Phương thức thanh toán
              </InputLabel>
              <Select
                labelId="payment-methods-label"
                id="payment-methods-select"
                multiple
                value={selectedPayments}
                onChange={handlePaymentChange}
                label="Phương thức thanh toán"
                renderValue={(selected) =>
                  paymentMethods
                    .filter((pm) => selected.includes(pm.id))
                    .map((pm) => pm.paymentMethodName)
                    .join(', ') || 'Chọn phương thức thanh toán'
                }
                name="paymentMethodIds"
              >
                {paymentMethods.map((pm) => (
                  <MenuItem key={pm.id} value={pm.id}>
                    {pm.paymentMethodName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box mt={2} mb={1}>
              <Typography variant="subtitle1" fontWeight={600} color="primary">
                Thông tin tài khoản
              </Typography>
            </Box>
            {!doctor && (
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
                type="email"
              />
            )}
            {!doctor && (
              <TextField
                label="Mật khẩu"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                fullWidth
                type="password"
              />
            )}
            <TextField
              label="Địa chỉ"
              name="userAddress"
              value={form.userAddress}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Ngày sinh"
              name="userDoB"
              value={form.userDoB}
              onChange={handleChange}
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Giới tính"
              name="userGender"
              value={form.userGender}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value={'true'}>Nam</MenuItem>
              <MenuItem value={'false'}>Nữ</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Huỷ</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} />
            ) : doctor ? (
              'Cập nhật'
            ) : (
              'Thêm mới'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DoctorForm;
