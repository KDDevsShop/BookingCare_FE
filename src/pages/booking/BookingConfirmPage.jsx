import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import bookingService from '../../services/booking.service';
import { Button, Result, Spin, message } from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';

const BookingConfirmPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await bookingService.confirmBooking(bookingId);
      console.log(res);
      setConfirmed(true);
      message.success('Xác nhận lịch khám thành công!');
      setTimeout(() => {
        navigate(`/booking/${bookingId}`);
      }, 1500);
    } catch (error) {
      message.error('Xác nhận thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId) {
    return (
      <Result
        status="error"
        title="Không tìm thấy lịch khám"
        subTitle="Vui lòng kiểm tra lại đường dẫn xác nhận."
      />
    );
  }

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0fdfa 100%)',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 40,
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          minWidth: 350,
        }}
      >
        {confirmed ? (
          <Result
            icon={
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: 48 }}
              />
            }
            title="Lịch khám đã được xác nhận!"
            subTitle="Cảm ơn bạn đã xác nhận. Đang chuyển đến chi tiết lịch khám..."
          />
        ) : (
          <>
            <h2 style={{ textAlign: 'center', marginBottom: 24 }}>
              Xác nhận lịch khám
            </h2>
            <p style={{ textAlign: 'center', color: '#555', marginBottom: 32 }}>
              Nhấn nút bên dưới để xác nhận lịch khám của bạn.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleConfirm}
                style={{
                  borderRadius: 8,
                  background:
                    'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
                  border: 'none',
                  fontWeight: 600,
                }}
              >
                Xác nhận lịch khám
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingConfirmPage;
