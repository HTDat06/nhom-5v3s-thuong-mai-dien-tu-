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

### Tổng hợp retrospective
- **Những điểm làm tốt:**
  - Phân công vai trò và mã chức năng (`TM-xx`) rõ ràng ngay từ đầu giúp hạn chế chồng chéo công việc.
  - Duy trì cập nhật trạng thái thẻ trên Trello, tuân thủ quy tắc nhánh Git (`fix/...`, `docs/...`) và mốc đóng băng chức năng khi bước vào Sprint S5.
  - Phối hợp kiểm thử chéo, ghi nhận Issue và phân loại thẻ `[BUG]` / `[DOC]` để tập trung xử lý lỗi và tài liệu.
- **Điểm còn tồn đọng / hạn chế:**
  - Một số đầu mục chức năng hoặc sửa lỗi có thể bị dồn vào cuối ngày/cuối sprint nếu không rà soát sớm trước mốc kiểm tra.
  - Việc cập nhật tiến độ ngắn trên thẻ Trello và ghi nhận AI log đôi lúc chưa đồng đều giữa các thành viên.
- **Biện pháp cải thiện cho giai đoạn tiếp theo:**
  - Trưởng nhóm rà soát tiến độ và cột *Lỗi* sớm hơn (trước mốc 22:00) để kịp thời điều phối hoặc ghi rõ lý do nếu có hạng mục chậm.
  - Nhắc nhở các thành viên kéo thẻ đúng trạng thái, ghi 1 dòng tiến độ cuối buổi làm việc và cập nhật đầy đủ AI log (đảm bảo tối thiểu theo yêu cầu).
  - Ưu tiên xử lý dứt điểm lỗi tồn đọng và hoàn thiện bản nháp các chương báo cáo đúng hạn đã phân công.

### Minh chứng bảng Trello
<img width="1681" height="822" alt="image" src="https://github.com/user-attachments/assets/e58b360b-2adf-4b09-a1a9-a1161d639bed" />

