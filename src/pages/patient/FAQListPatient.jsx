import React, { useEffect, useState } from 'react';
import FAQService from '../../services/faq.service';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import { Visibility } from '@mui/icons-material';

function FAQListPatient() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewFAQ, setViewFAQ] = useState(null);

  useEffect(() => {
    async function fetchFAQs() {
      setLoading(true);
      try {
        const res = await FAQService.getAllFAQs();
        setFaqs(res.filter((faq) => faq.isActive));
      } catch {
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFAQs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
          Câu hỏi thường gặp (FAQs)
        </h2>
        {loading ? (
          <div className="text-center text-blue-700 py-10">Đang tải...</div>
        ) : faqs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Không có FAQ nào.
          </div>
        ) : (
          <ul className="divide-y divide-blue-100">
            {faqs.map((faq) => (
              <li
                key={faq.id}
                className="py-4 flex items-center justify-between group"
              >
                <div>
                  <span className="font-semibold text-blue-700">
                    {faq.question}
                  </span>
                </div>
                <IconButton
                  color="primary"
                  onClick={() => setViewFAQ(faq)}
                  className="opacity-80 group-hover:opacity-100"
                >
                  <Visibility />
                </IconButton>
              </li>
            ))}
          </ul>
        )}
      </div>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewFAQ(null)} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FAQListPatient;
