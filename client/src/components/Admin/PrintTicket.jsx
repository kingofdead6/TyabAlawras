import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import { toast } from "react-toastify";

export default function PrintTicket({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        toast.error("خطأ في جلب بيانات الطلب");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading || !order) return null;

  return (
    <div className="print-ticket" dir="rtl">
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .print-ticket, .print-ticket * { visibility: visible; }
            .print-ticket {
              position: absolute;
              top: 0;
              left: 0;
              width: 80mm;
              padding: 5mm;
              font-family: Arial, sans-serif;
              font-size: 10pt;
              color: #000;
              background: #fff;
              border: 1px solid #000;
            }
            .print-ticket p, .print-ticket li {
              margin: 2mm 0;
              text-align: right;
            }
            .print-ticket ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            @page { size: 80mm auto; margin: 0; }
          }
          .print-ticket { display: none; }
        `}
      </style>

      <p className="order-id">الطلب #: {order._id}</p>
      <p>العميل: {order.customerPhone} - {order.customerName}</p>
      <p>المنطقة: {order.deliveryArea} ({order.deliveryFee} د.ج)</p>
      <p>العنوان: {order.deliveryAddress}</p>
      <p className="total">الإجمالي: {order.totalAmount} د.ج</p>
      <p className="status">{getStatusText(order.status)}</p>
      <p>العناصر:</p>
      <ul>
        {order.items?.map((item, i) => (
          <li key={i}>
            {item.menuItem?.name || "عنصر غير معروف"} × {item.quantity} —{" "}
            {item.menuItem?.price || 0} د.ج
          </li>
        ))}
      </ul>
    </div>
  );
}

function getStatusText(status) {
  const statusMap = {
    pending: "معلق / غير جاهز",
    in_delivery: "في طريق التوصيل",
    delivered: "تم التوصيل",
    cancelled: "ملغى",
  };
  return statusMap[status] || status;
}
