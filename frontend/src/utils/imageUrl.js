const API_URL = "http://localhost:5000";

export const getImageUrl = (image) => {
    if (!image) return "";

    // Ảnh đã có URL đầy đủ
    if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
    }

    // Ảnh lưu theo đường dẫn /uploads/...
    return `${API_URL}${image.startsWith("/") ? image : `/${image}`}`;
};