

# CHƯƠNG 8: QUẢN LÝ MÃ NGUỒN VỚI GIT

## 8.1. Mô hình phân nhánh (Git Branching Model)

Nhóm áp dụng mô hình **Git Flow rút gọn** trên kho lưu trữ GitHub (`[https://github.com/HTDat06/nhom-5v3s-thuong-mai-dien-tu-](https://github.com/HTDat06/nhom-5v3s-thuong-mai-dien-tu-)`) nhằm phân tách rõ ràng giữa mã nguồn ổn định, mã nguồn tích hợp và các nhánh phát triển tính năng riêng lẻ:

```text
main (Nhánh ổn định để bàn giao / báo cáo)
 └── develop (Nhánh tích hợp chung của cả nhóm)
      ├── feat/auth-user         (Xác thực & quản lý tài khoản)
      ├── feat/product-catalog   (Danh mục & sản phẩm)
      ├── feat/cart-checkout     (Giỏ hàng & thanh toán)
      ├── feat/order-return-flow (Giao nhận & hoàn trả đơn hàng)
      ├── fix/...                (Các nhánh sửa lỗi từ kiểm thử chéo)
      └── docs/bao-cao-c7-c8     (Soạn thảo tài liệu & báo cáo)

```

* **Nhánh `main`:** Lưu trữ các phiên bản hoàn chỉnh, đã qua kiểm thử toàn diện và sẵn sàng trình bày báo cáo. Không cho phép đẩy mã nguồn trực tiếp lên `main`.
* **Nhánh `develop`:** Đóng vai trò nhánh tích hợp trung tâm. Toàn bộ tính năng của các thành viên sau khi hoàn thiện đều được gộp vào `develop` để chạy kiểm thử chéo.
* **Nhánh `feat/<tên-tính-năng>`:** Mỗi thành viên tách nhánh riêng từ `develop` để phát triển chức năng được giao, tránh xung đột trực tiếp trong quá trình lập trình.
* **Nhánh `fix/<tên-lỗi>`:** Được tạo khi phát sinh lỗi trong giai đoạn kiểm thử chéo để cô lập phạm vi sửa lỗi.
* **Nhánh `docs/<tên-tài-liệu>`:** Dành riêng cho việc cập nhật tài liệu đặc tả, kịch bản kiểm thử và báo cáo đồ án.

---

## 8.2. Quy trình làm việc nhóm và Quy ước Commit

### 8.2.1. Quy trình phối hợp Pull Request (PR)

1. Trước khi bắt đầu tác vụ mới, thành viên đồng bộ mã nguồn mới nhất từ nhánh `develop` về máy cục bộ (`git pull origin develop`) và tạo nhánh làm việc mới.
2. Sau khi hoàn tất lập trình và tự kiểm thử cục bộ, thành viên đẩy nhánh lên GitHub và tạo **Pull Request (PR)** hướng vào nhánh `develop`.
3. Thành viên phụ trách Quản lý mã nguồn & QA (`TV5`) tiến hành kiểm tra mã nguồn (Code Review), đối chiếu xung đột (Merge Conflict) và xác nhận tích hợp vào `develop`.

### 8.2.2. Quy ước thông điệp Commit (Conventional Commits)

Nhóm thống nhất đặt tiền tố rõ ràng cho từng commit giúp dễ dàng truy vết lịch sử thay đổi:

* `feat(<module>): ...` — Thêm mới một tính năng hoặc màn hình nghiệp vụ.
* `fix(<module>): ...` — Sửa lỗi logic, giao diện hoặc bảo mật.
* `docs(<tài-liệu>): ...` — Bổ sung, chỉnh sửa tài liệu báo cáo và kịch bản kiểm thử.
* `chore(<cấu-hình>): ...` — Cập nhật cấu hình môi trường, thư viện hoặc dữ liệu mẫu (`seed.js`).

---

## 8.3. Thống kê đóng góp mã nguồn theo thành viên

Số liệu đóng góp được trích xuất từ lịch sử kho lưu trữ thông qua lệnh `git shortlog -sn --no-merges` (tổng cộng 180 commits không tính merge commits, được tổng hợp theo từng thành viên thực tế do một số thành viên sử dụng nhiều cấu hình tài khoản Git trên các máy làm việc khác nhau; riêng hai cột **Số PR đã tạo** và **Số lượt Review** cần đối chiếu trực tiếp từ tab *Pull Requests* trên GitHub để điền số liệu chốt trước khi nộp bản in):

| Thành viên | Tài khoản Git ghi nhận | Phân hệ / Nhiệm vụ chính | Số Commit | Tỷ lệ (%) | Số PR đã tạo | Số lượt Review |
| --- | --- | --- | --- | --- | --- | --- |
| **Nguyễn Hải** | `HaiNe` (56), `HaiNguyen214` (6) | Quản lý sản phẩm, danh mục, giỏ hàng (`TM-03`, `TM-04`, `TM-05`) | **62** | 34.4% | *(Đối chiếu GitHub)* | *(Đối chiếu GitHub)* |
| **Đạt**  | `0306241272-htd` (23), `HTDat` (20), `HTDat06` (6) | Kiến trúc hệ thống, CSDL, xác thực & phân quyền (`TM-01`, `TM-02`) | **49** | 27.2% | *(Đối chiếu GitHub)* | *(Đối chiếu GitHub)* |
| **Phạm Phúc Thiện** *(TV5)* | `phucthienpham222` (34) | Quản lý Git, kiểm thử QA, luồng giao/trả hàng (`TM-07`, `TM-13`), báo cáo C7–C8 | **34** | 18.9% | *(Đối chiếu GitHub)* | *(Đối chiếu GitHub)* |
| **Thanh Tân** | `ThanhTan06` (23) | Thanh toán, đặt hàng & lịch sử đơn hàng (`TM-06`, `TM-07`) | **22** | 12.8% | *(Đối chiếu GitHub)* | *(Đối chiếu GitHub)* |
| **Trần Ngọc Duy** | `TranNgDuy` (8), `tnduy30406` (4) | Trang quản trị & thống kê Admin (`TM-11`, `TM-12`, `TM-14`) | **12** | 6.7% | *(Đối chiếu GitHub)* | *(Đối chiếu GitHub)* |
| **Tổng cộng** | **10 Git authors** | **Toàn bộ dự án** | **180** | **100%** | — | — |