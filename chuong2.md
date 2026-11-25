# CHƯƠNG 2: TỔ CHỨC NHÓM VÀ QUẢN LÝ DỰ ÁN

## 2.1. Cơ cấu nhóm và phân công vai trò
- Nhóm gồm 5 thành viên với phân công vai trò và chức năng bắt buộc như sau:
  - **TV1 (Trưởng nhóm – PM/Scrum Master):** Điều phối tiến độ, sprint, báo cáo; phụ trách `TM-14`, `TM-08`.
  - **TV2 (Backend lead):** Phụ trách luồng xử lý nghiệp vụ phía máy chủ; phụ trách `TM-04`, `TM-06`.
  - **TV3 (Frontend lead):** Phụ trách giao diện người dùng và trải nghiệm đa thiết bị; phụ trách `TM-01`, `TM-02`, `TM-03`.
  - **TV4 (Cơ sở dữ liệu):** Phụ trách thiết kế và quản trị dữ liệu; phụ trách `TM-11`, `TM-12`.
  - **TV5 (Git & kiểm thử / QA):** Điều phối kiểm thử, theo dõi Issue/chất lượng; phụ trách `TM-05`, `TM-07`, `TM-13`.

## 2.2. Quản lý sprint và đóng băng chức năng
- Nhóm duy trì bảng theo dõi công việc trên Trello theo từng sprint (đến Sprint S5 kéo dài tới thứ 6).
- Áp dụng mốc đóng băng chức năng (feature freeze) để tập trung hoàn thiện 12/12 chức năng bắt buộc, xử lý lỗi kiểm thử chéo và viết tài liệu báo cáo.

## 2.3. Ma trận phân công công việc & báo cáo
### Bảng 2.1. Ma trận phân công chức năng, kiểm thử và tài liệu theo thành viên

| Thành viên | Họ và tên | Vai trò chính | Chức năng bắt buộc (`TM-xx`) | Nhiệm vụ kiểm thử chéo & sửa lỗi | Phụ trách báo cáo & sản phẩm |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TV1** | Nguyễn Chí Hải | Trưởng nhóm (PM / Scrum Master) | `TM-08` (Hồ sơ cá nhân)<br>`TM-14` (Quản lý người dùng) | Quản lý Sprint S5, điều phối Trello; kiểm thử & sửa lỗi `TM-08`, `TM-14` | - Dàn ý báo cáo (`dan-y.md`)<br>- Chương 1, Chương 2<br>- Tổng hợp Chương 9, Chương 10<br>- Kiểm tra AI log toàn nhóm |
| **TV2** | Trần Ngọc Duy | Backend Lead | `TM-04` (Đăng ký / Đăng nhập)<br>`TM-06` (Đặt hàng / Thanh toán) | Kiểm thử bảo mật cơ bản (SQLi, truy cập trái phép); sửa lỗi `TM-04`, `TM-06` | - Chương 5 (Phần Kiến trúc hệ thống)<br>- Chương 6 (Cài đặt, nghiệp vụ đặt hàng) |
| **TV3** | Phạm Thiên Phúc | Frontend Lead | `TM-01`, `TM-02`, `TM-03` (Giao diện trang chủ, danh sách & chi tiết sản phẩm) | Kiểm thử giao diện đa thiết bị (PC/Mobile); sửa lỗi UI/UX | - Chương 5 (Phần Giao diện người dùng)<br>- Kịch bản & quay video demo (3–5 phút) |
| **TV4** | Mai Thanh Tân | Cơ sở dữ liệu (DB Lead) | `TM-11` (Quản lý danh mục)<br>`TM-12` (Quản lý sản phẩm) | Kiểm thử ràng buộc dữ liệu, định dạng ảnh; sửa lỗi `TM-11`, `TM-12` | - Chương 3 (Công nghệ & thiết kế CSDL)<br>- Chương 5 (Phần CSDL: ERD, bảng, chỉ mục) |
| **TV5** | Hoàng Tiến Đạt | Git & Kiểm thử (QA Lead) | `TM-05`, `TM-07`, `TM-13` (Giỏ hàng, theo dõi đơn, thống kê/quản trị) | Điều phối kiểm thử chéo, quản lý GitHub Issues & thẻ `[BUG]`; sửa lỗi `TM-05`, `TM-07`, `TM-13` | - Chương 7 (Kế hoạch & kết quả kiểm thử)<br>- Chương 8 (Quy trình Git, thống kê commit/PR) |

### Bảng 2.2. Ma trận trách nhiệm (RACI) theo giai đoạn dự án

*(Quy ước: **R** – Thực hiện chính | **A** – Chịu trách nhiệm phê duyệt/chốt | **C** – Phối hợp/Góp ý | **I** – Được thông báo)*

| Hạng mục công việc | TV1 (PM) | TV2 (BE) | TV3 (FE) | TV4 (DB) | TV5 (QA/Git) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Lập kế hoạch Sprint & quản lý Trello | **A / R** | C | C | C | C |
| Thiết kế Cơ sở dữ liệu (ERD, Bảng) | I | C | I | **A / R** | I |
| Xây dựng API & Logic nghiệp vụ | C | **A / R** | C | C | I |
| Xây dựng Giao diện người dùng (UI) | C | C | **A / R** | I | I |
| Phát triển chức năng được giao (`TM-xx`) | **R** | **R** | **R** | **R** | **R** |
| Kiểm thử chéo & quản lý GitHub Issues | C | R | R | R | **A / R** |
| Sửa lỗi (`fix/...`) & đóng băng chức năng | **A** | **R** | **R** | **R** | **R** |
| Tổng hợp & hoàn thiện Báo cáo 10 chương | **A / R** | R | R | R | R |

## 2.4. Tổng hợp retrospective & minh chứng Trello
- Tổng hợp các điểm làm tốt, điểm còn tồn đọng qua các buổi làm việc/sprint và biện pháp cải thiện ở giai đoạn tiếp theo.
- <img width="857" height="505" alt="image" src="https://github.com/user-attachments/assets/bfa4668e-0ed6-4697-9668-aaf7306e5892" />
