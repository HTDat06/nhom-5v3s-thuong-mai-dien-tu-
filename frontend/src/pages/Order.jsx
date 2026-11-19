
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { placeOrderRequest } from "../services/orderService";
import "../styles/Order.css";

function Order() {
    const { token } = useAuth();
    const { cartItems, totalAmount, refreshCart } = useCart();
    const navigate = useNavigate();

    const [receiverName, setReceiverName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!token) {
            navigate("/login");
            return;
        }

        if (!cartItems.length) {
            setError("Giỏ hàng đang trống.");
            return;
        }

        if (!receiverName.trim() || !phone.trim() || !address.trim()) {
            setError("Vui lòng nhập đầy đủ thông tin nhận hàng.");
            return;
        }

        try {
            setLoading(true);

            const result = await placeOrderRequest(token, {
                receiver_name: receiverName.trim(),
                phone: phone.trim(),
                shipping_address: address.trim(),
            });

            await refreshCart();

            setSuccess(result.message || "Đặt hàng thành công!");
            setReceiverName("");
            setPhone("");
            setAddress("");
        } catch (err) {
            setError(err.message || "Đặt hàng thất bại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="order-page">
            <h2 className="order-title">Thông tin đặt hàng</h2>

            {error && <p className="order-error">{error}</p>}
            {success && <p className="order-success">{success}</p>}

            <div className="order-layout">
                {/* FORM THÔNG TIN NGƯỜI NHẬN */}
                <form className="order-form" onSubmit={handleSubmit}>
                    <h3>Thông tin người nhận</h3>

                    <div className="order-field">
                        <label>Tên người nhận</label>
                        <input
                            type="text"
                            value={receiverName}
                            onChange={(e) => setReceiverName(e.target.value)}
                            placeholder="Nhập tên người nhận"
                            required
                        />
                    </div>

                    <div className="order-field">
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Nhập số điện thoại"
                            required
                        />
                    </div>

                    <div className="order-field">
                        <label>Địa chỉ nhận hàng</label>
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Nhập địa chỉ nhận hàng"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="order-submit"
                        disabled={loading || !cartItems.length}
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                    </button>
                </form>

                {/* THÔNG TIN ĐƠN HÀNG */}
                <div className="order-summary">
                    <h3>Đơn hàng của bạn</h3>

                    {cartItems.map((item) => (
                        <div className="order-product" key={item.cart_item_id}>
                            <span>
                                {item.products?.product_name || "Sản phẩm"}
                                {" × "}
                                {item.quantity}
                            </span>

                            <strong>
                                {(
                                    Number(item.products?.price || 0) *
                                    item.quantity
                                ).toLocaleString("vi-VN")}đ
                            </strong>
                        </div>
                    ))}

                    <div className="order-total">
                        <span>Tổng tiền:</span>
                        <strong>
                            {Number(totalAmount).toLocaleString("vi-VN")}đ
                        </strong>
                    </div>

                    <div className="order-payment">
                        <strong>Phương thức thanh toán:</strong>
                        <p>Thanh toán khi nhận hàng (COD)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
