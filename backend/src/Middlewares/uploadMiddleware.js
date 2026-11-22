
const multer = require("multer");
const { fileTypeFromBuffer } = require("file-type");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const uploadDirectory = path.join(
  __dirname,
  "../../uploads/products"
);

// Tạo thư mục lưu ảnh nếu chưa tồn tại
fs.mkdirSync(uploadDirectory, { recursive: true });

// Nhận file vào bộ nhớ để kiểm tra trước khi lưu
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1
  }
}).single("image");

// Middleware upload ảnh sản phẩm
function uploadProductImage(req, res, next) {
  upload(req, res, async (error) => {
    // Kiểm tra lỗi từ Multer
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Ảnh không được vượt quá 2 MB."
          });
        }

        if (error.code === "LIMIT_FILE_COUNT") {
          return res.status(400).json({
            success: false,
            message: "Chỉ được tải lên một ảnh đại diện."
          });
        }

        if (error.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            success: false,
            message: "Tên trường tải ảnh phải là image và chỉ được tải một ảnh."
          });
        }
      }

      return res.status(400).json({
        success: false,
        message: error.message || "Không thể tải ảnh lên."
      });
    }

    // Không có ảnh: cho phép đi tiếp
    // Service sẽ quyết định có bắt buộc ảnh hay không
    if (!req.file) {
      return next();
    }

    try {
      // Kiểm tra nội dung thực tế của file
      // Không tin vào phần mở rộng do người dùng đặt
   const detectedType = await fileTypeFromBuffer(
  req.file.buffer
);

      const allowedTypes = {
        "image/jpeg": "jpg",
        "image/png": "png"
      };

      // Chỉ chấp nhận JPEG và PNG thật
      if (
        !detectedType ||
        !Object.prototype.hasOwnProperty.call(
          allowedTypes,
          detectedType.mime
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "Chỉ chấp nhận ảnh JPG hoặc PNG hợp lệ."
        });
      }

      // Sinh tên file ngẫu nhiên
      const extension = allowedTypes[detectedType.mime];
      const fileName = `${randomUUID()}.${extension}`;

      const filePath = path.join(
        uploadDirectory,
        fileName
      );

      // Lưu ảnh vào thư mục
      await fs.promises.writeFile(
        filePath,
        req.file.buffer,
        { flag: "wx" }
      );

      // Gắn thông tin file vào request
      req.file.filename = fileName;
      req.file.path = filePath;
      req.file.imageUrl = `/uploads/products/${fileName}`;

      return next();
    } catch (err) {
      console.error("Upload image error:", err);

      return res.status(500).json({
        success: false,
        message: "Không thể xử lý ảnh tải lên."
      });
    }
  });
}

// Hàm xóa file ảnh
function removeUploadedImage(filePath) {
  if (!filePath) return;

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Remove image error:", error);
  }
}

module.exports = {
  uploadProductImage,
  removeUploadedImage
};
