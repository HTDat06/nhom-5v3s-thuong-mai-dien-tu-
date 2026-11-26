| Mục | Thông tin |
| --- | --- |
| Họ tên, MSSV | Nguyễn Chí Hải – 0306241276 |
| Nhóm, đề tài | Nhóm 8 – Thương mại điện tử (Website bán linh kiện máy tính) |
| Vai trò | TV1 – LE (Leader / Scrum Master) |
| Công cụ AI dùng | Gemini / ChatGPT |

### [AI-01] Brainstorm chức năng Must/Could và rủi ro của đề tài
- Ngày / Người dùng: 2026-11-09 / Nguyễn Chí Hải
- Công cụ: Gemini
- Giai đoạn: Phân tích yêu cầu
- Task / Commit / PR: [DOC] Đề cương / `docs: de cuong ban dau` / [PR #1]
- Mục đích: Phân loại danh sách chức năng theo mức độ ưu tiên (Must-have / Could-have) và xác định 3 rủi ro lớn nhất cùng cách phòng tránh cho đồ án website thương mại điện tử trong 3 tuần với 5 thành viên
- Prompt chính (nguyên văn hoặc link chia sẻ hội thoại): "Với đề tài website thương mại điện tử, nhóm 5 người, 3 tuần, hãy liệt kê chức năng theo mức Must/Could và 3 rủi ro lớn nhất".
- Kết quả AI trả về (tóm tắt): AI đề xuất bảng phân chia các nhóm chức năng bắt buộc (Xác thực, Sản phẩm, Giỏ hàng, Đặt hàng, Quản trị) và tùy chọn (Đánh giá, Lịch sử đơn, Bộ lọc nâng cao), đồng thời chỉ ra 3 rủi ro chính (Git conflict, Trễ tiến độ, Lỗi CSDL/Transaction).
- Đánh giá: Đúng và sát thực tế – các nhóm chức năng bám sát đặc tả yêu cầu của giảng viên, các rủi ro phản ánh đúng khó khăn khi làm việc nhóm 5 người.
- Đã chỉnh sửa gì: Giữ nguyên các nhóm chức năng Must-have khớp với mã chức năng `TM-01` đến `TM-16` của đề tài; bổ sung cụ thể vai trò kiểm duyệt PR của TV5 và quy tắc Trello của nhóm vào phần cách phòng tránh rủi ro.
- Cách kiểm chứng: Đối chiếu danh sách chức năng bắt buộc trong tài liệu đặc tả 6 đề tài mẫu; thống nhất phạm vi trong buổi họp nhóm Ngày 1 và trình giảng viên duyệt đề cương.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 65%
- Điều học được: Nêu rõ ràng ràng buộc về thời gian (3 tuần) và nhân sự (5 người) ngay trong prompt giúp AI phân loại mức độ ưu tiên (Must/Could) chuẩn xác và khả thi hơn.
### [AI-02] Hỗ trợ thiết kế Use Case Diagram và đặc tả 3 Use Case
Ngày / Người dùng: 2026-11-10 / Nguyễn Chí Hải
Công cụ: ChatGPT (GPT-6)
- Giai đoạn: Thiết kế
Task / Commit / PR: [DOC] Use case / [Commit ID] / [PR #...]
- Mục đích: Hỗ trợ phân tích các chức năng chính của website thương mại điện tử bán linh kiện máy tính, xây dựng Use Case Diagram và đặc tả 3 chức năng Đặt hàng, Quản lý sản phẩm, Đăng nhập.
- Prompt chính (nguyên văn hoặc link chia sẻ hội thoại):
"Tôi đang làm trưởng nhóm TV1 cho đồ án website thương mại điện tử bán linh kiện máy tính. Hãy giúp tôi xây dựng Use Case Diagram gồm 3 tác nhân Khách vãng lai, Khách hàng và Quản trị. Đồng thời đặc tả 3 Use Case chính gồm Đặt hàng, Quản lý sản phẩm và Đăng nhập, trình bày rõ tác nhân, tiền điều kiện, luồng chính và luồng phụ. Hãy chú ý các trường hợp ngoại lệ như sản phẩm hết hàng và người dùng chưa đăng nhập."
- Kết quả AI trả về (tóm tắt): AI đề xuất sơ đồ Use Case với 3 tác nhân chính, xác định các chức năng tương ứng và xây dựng nội dung đặc tả cho 3 Use Case. AI cũng gợi ý các trường hợp ngoại lệ như hết hàng, thông tin đăng nhập không hợp lệ và người dùng chưa đăng nhập.
- Đánh giá: Đúng một phần – AI hỗ trợ xây dựng cấu trúc sơ đồ và đặc tả khá đầy đủ, tuy nhiên cần kiểm tra lại quyền hạn của từng tác nhân và tính phù hợp với yêu cầu thực tế của website.
- Đã chỉnh sửa gì:Điều chỉnh tên chức năng và nội dung đặc tả theo đề tài bán linh kiện máy tính. Rà soát lại quyền của Khách vãng lai, Khách hàng và Quản trị. Bổ sung các tình huống ngoại lệ phù hợp với quy trình đặt hàng.
- Cách kiểm chứng: Đối chiếu với tài liệu phân công chức năng và yêu cầu đề tài; kiểm tra từng tác nhân, chức năng và luồng xử lý trước khi đưa vào tài liệu docs/use-case.md.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): [50]%
- Điều học được: Cần mô tả rõ vai trò của từng tác nhân và các trường hợp ngoại lệ khi xây dựng Use Case. Không nên sử dụng nguyên bản kết quả AI mà cần đối chiếu với yêu cầu của hệ thống.

### [AI-03] Hỗ trợ thiết kế Sequence Diagram đặt hàng và biên bản họp 02
Ngày / Người dùng: 2026-11-11 / Nguyễn Chí Hải
Công cụ: Gemini
- Giai đoạn: Thiết kế, Tài liệu
Task / Commit / PR: [DOC] Sequence diagram, [DOC] Biên bản họp 02 / [Commit ID] / [PR #...]
- Mục đích: Hỗ trợ xây dựng Sequence Diagram mô tả quy trình đặt hàng trên website bán linh kiện máy tính, thể hiện sự tương tác giữa Khách hàng, Giao diện Website, OrderController, OrderService và Cơ sở dữ liệu. Đồng thời hỗ trợ soạn biên bản họp nhóm số 02.
-nPrompt chính (nguyên văn hoặc link chia sẻ hội thoại):
"Tôi là TV1, trưởng nhóm đồ án website thương mại điện tử bán linh kiện máy tính. Hãy tạo Sequence Diagram cho quy trình đặt hàng bằng Mermaid, gồm Khách hàng, Giao diện Website, OrderController, OrderService và Cơ sở dữ liệu. Sơ đồ cần thể hiện kiểm tra sản phẩm, tồn kho, tạo đơn hàng, lưu chi tiết đơn hàng và sử dụng Transaction, Commit, Rollback khi có lỗi. Ngoài ra, hãy giúp tôi soạn biên bản họp nhóm số 02 gồm nội dung báo cáo tiến độ của 5 thành viên và công việc cần hoàn thành đến thứ 6."
- Kết quả AI trả về (tóm tắt): AI tạo mã Mermaid mô tả trình tự đặt hàng, bao gồm kiểm tra sản phẩm và tồn kho, tạo đơn hàng, lưu chi tiết đơn hàng, cập nhật số lượng tồn kho và xử lý Transaction. AI cũng đề xuất nội dung biên bản họp số 02 với phần thành viên tham gia, báo cáo tiến độ, phân công người trình bày Mốc 1 và công việc tiếp theo.
- Đánh giá: Đúng một phần – Sơ đồ đã thể hiện được luồng xử lý chính và các trường hợp lỗi. Tuy nhiên, cần kiểm tra lại thứ tự xử lý và tên các thành phần so với kiến trúc thực tế của hệ thống. Biên bản họp cần cập nhật theo kết quả báo cáo thực tế của từng thành viên.
- Đã chỉnh sửa gì: Điều chỉnh tên các thành phần trong sơ đồ theo cấu trúc hệ thống. Bổ sung nhánh xử lý khi sản phẩm không hợp lệ, hết hàng hoặc xảy ra lỗi khi lưu dữ liệu. Chỉnh sửa biên bản họp theo nhiệm vụ của từng thành viên và bổ sung công việc cần hoàn thành đến thứ 6.
- Cách kiểm chứng:Đối chiếu Sequence Diagram với quy trình đặt hàng của hệ thống và kiến trúc Controller – Service – Database. Kiểm tra mã Mermaid trên Mermaid Live Editor. Đối chiếu biên bản họp với tiến độ thực tế và kết quả trao đổi trong cuộc họp nhóm.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): [75]%
- Điều học được: AI có thể hỗ trợ tạo sơ đồ và tài liệu nhanh chóng, những người phát triển cần hiểu rõ luồng nghiệp vụ, kiểm tra Transaction và cập nhật nội dung theo tình hình thực tế của nhóm.


### [AI-04] Tổng hợp tài liệu Mốc 1 và lên cấu trúc phân công trình bày
- Ngày / Người dùng: 2026-11-12 / Nguyễn Chí Hải
- Công cụ: Gemini
- Giai đoạn: Tài liệu
- Task / Commit / PR: [DOC] Chuẩn bị Mốc 1 / `docs: tai lieu tom tat moc 1` / [PR #...]
- Mục đích: Hoàn thiện tệp báo cáo tổng hợp Mốc 1 (`docs/moc-1.md`) bám sát đặc tả đề tài Thương mại điện tử, đồng thời cấu trúc thời lượng trình bày 10 phút cho 5 thành viên trong nhóm.
- Prompt chính (nguyên văn hoặc link chia sẻ hội thoại): "Gợi ý cấu trúc báo cáo Mốc 1 cho website thương mại điện tử gồm các phần Giới thiệu, Công nghệ (Node.js, Express, React, SQL Server), Kiến trúc, ERD, User Story, Kế hoạch Sprint S2 và gợi ý phân bổ thời gian thuyết trình 10 phút cho 5 thành viên."
- Kết quả AI trả về (tóm tắt): AI cung cấp khung nội dung chi tiết cho báo cáo tổng hợp và kịch bản phân chia thời lượng trình bày (mỗi thành viên 2 phút).
- Đánh giá: Đúng và rất sát yêu cầu – giúp trưởng nhóm nhanh chóng hoàn thiện tài liệu nộp và lên lịch điều phối công việc cho nhóm trong ngày.
- Đã chỉnh sửa gì: Chuẩn hóa lại các bảng Markdown, đồng bộ tên công nghệ thực tế của nhóm (SQL Server, Sequelize, Node.js + Express) và bổ sung mã chức năng (TM-xx) vào kế hoạch Sprint 2.
- Cách kiểm chứng: Kiểm tra hiển thị Markdown trên GitHub; đối chiếu nội dung báo cáo với hướng dẫn chi tiết Ngày 4 của giảng viên.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 80%


### [AI-05] Lập biên bản họp Mốc 1, phân rã góp ý giảng viên và lập kế hoạch Sprint S2
- Ngày / Người dùng: 2026-11-13 / Nguyễn Chí Hải
- Công cụ: Gemini
- Giai đoạn: Quản lý dự án & Tài liệu
- Task / Commit / PR: [DOC] Mốc 1 / `docs: gop y moc 1 va ke hoach s2` / [PR #...]
- Mục đích: Tổng hợp nội dung bảo vệ Mốc 1, chuyển các góp ý của giảng viên thành các thẻ công việc trên Trello, lập kế hoạch Sprint S2 (giao các thẻ TM-11, TM-14, TM-01, TM-05) và hoàn thiện biên bản cuộc họp `docs/meetings/03.md`.
- Prompt chính (nguyên văn hoặc link chia sẻ hội thoại): "Dựa trên hướng dẫn Ngày 5 (Mốc 1 - Bảo vệ thiết kế) của đề tài Thương mại điện tử, hãy gợi ý mẫu biên bản họp docs/meetings/03.md ghi nhận góp ý của giảng viên và bảng phân công kế hoạch Sprint S2 cho 5 thành viên (TM-11, TM-14, TM-01, TM-05) kèm checklist kiểm tra cuối ngày."
- Kết quả AI trả về (tóm tắt): AI cung cấp cấu trúc biên bản họp `docs/meetings/03.md` gồm kết quả Sprint Review S1, danh sách góp ý từ giảng viên cần khắc phục và bảng giao việc chi tiết cho Sprint S2 trên Trello.
- Đánh giá: Đúng và bám sát biểu mẫu quản lý dự án của môn học – giúp trưởng nhóm nhanh chóng hệ thống hóa các góp ý sau buổi bảo vệ Mốc 1 và phân bổ kịp thời các thẻ chức năng trọng tâm cho Sprint 2.
- Đã chỉnh sửa gì: Cập nhật đúng nội dung góp ý thực tế của giảng viên trên lớp cho nhóm 5v3s, gắn tên người phụ trách cụ thể và điều chỉnh thời hạn (deadline) trên Trello đến Thứ 2 tuần 2.
- Cách kiểm chứng: Đối chiếu nội dung biên bản `docs/meetings/03.md` và trạng thái các thẻ trên bảng Trello của nhóm với danh mục kiểm tra cuối ngày của hướng dẫn Ngày 5.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 80%
###  [AI-06] Hoàn thiện cấu trúc API đổi mật khẩu
- Ngày / Người dùng: 2026-11-18 / Nguyễn Chí Hải (TV1)
- Công cụ: Gemini
- Giai đoạn: Lập trình & Phân quyền hệ thống
- Task / Commit / PR: [FEAT] TM-08 Hồ sơ & Đổi mật khẩu / feat(TM-08): hoan thien doi mat khau / PR #...
- Mục đích: Xây dựng logic đổi mật khẩu sử dụng bcrypt, kiểm tra ràng buộc mật khẩu mới tối thiểu 8 ký tự.
- Prompt chính (nguyên văn): "Làm sao để viết hàm changePassword trong UserService sử dụng bcrypt kiểm tra mật khẩu cũ và mã hóa mật khẩu mới tối thiểu 8 ký tự"
- Kết quả AI trả về (tóm tắt): AI cung cấp đoạn code phương thức `changePassword` kết hợp `bcrypt.compare` và `bcrypt.hash`.
- Đánh giá: Rất chính xác và đúng chuẩn bảo mật web.
- Đã chỉnh sửa gì: Áp dụng trực tiếp đoạn code vào `UserService.js`, điều chỉnh điều kiện kiểm tra độ dài mật khẩu mới phù hợp với đặc tả (`>= 8` ký tự).
- Cách kiểm chứng: Chạy thử nghiệm trên trình duyệt (`localhost:5173`): đăng nhập bằng tài khoản khách hàng để test tính năng đổi mật khẩu.
- Tỷ lệ nội dung AI còn giữ lại (ước lượng): 90%
- Điều học được: Việc kết hợp kiểm tra phân quyền ngay từ tầng UI (Navbar) giúp trải nghiệm người dùng trực quan hơn, kết hợp với tầng Service ở backend đảm bảo tính toàn vẹn dữ liệu.

# NHẬT KÝ SỬ DỤNG AI (AI LOG) – TV1

- **Thành viên:** Nguyễn Chí Hải (TV1 – Trưởng nhóm / PM / Scrum Master)
- **Đề tài:** Website Thương mại điện tử 
- **Giai đoạn ghi nhận:** Tuần 3 – Đóng băng chức năng, kiểm thử chéo, sửa lỗi và viết báo cáo (`docs/bao-cao`, `docs/bao-cao-c1-c2`, `fix/...`)

| STT | Thời gian / Giai đoạn | Nhánh Git / Tệp liên quan | Mục đích & Prompt tóm tắt | Công cụ AI | Đánh giá kết quả | Cách kiểm chứng & xử lý thực tế |
| :-: | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Thứ 2, Tuần 3<br>Giai đoạn Tài liệu & Điều phối | `docs/bao-cao`<br>`docs/bao-cao/dan-y.md` | Tổng hợp nhiệm vụ của TV1 trong buổi đóng băng chức năng, thiết lập Sprint S5 và tạo cấu trúc file dàn ý báo cáo 10 chương. | Gemini | **Tốt** – Bám sát quy trình quản lý nhóm, liệt kê đầy đủ mốc thời gian và đầu việc cần chốt. | Đối chiếu trực tiếp với tài liệu hướng dẫn buổi học, giữ nguyên phân công 10 chương và đẩy lên nhánh `docs/bao-cao`. |
| **02** | Thứ 2, Tuần 3<br>Giai đoạn Quản lý dự án | Trello (`[DOC] Báo cáo`, `[BUG]`) | Soạn nội dung phần mô tả (Description) và checklist chuẩn cho các thẻ trên bảng Trello của nhóm. | Gemini | **Tốt** – Rõ ràng, có đủ mục tiêu, nhánh Git và tiêu chí hoàn thành (Definition of Done). | Copy và điều chỉnh tên chức năng `TM-08`, `TM-14` cho khớp với bảng Trello thực tế của nhóm. |
| **03** | Thứ 3, Tuần 3<br>Giai đoạn Tài liệu | `docs/bao-cao-c1-c2`<br>`docs/bao-cao/chuong-1.md` | Viết bản nháp Chương 1 (Bối cảnh, lý do chọn đề tài, mục tiêu và phạm vi hệ thống). | Gemini | **Cần sửa (Sai ngữ cảnh)** – Bản nháp đầu tiên lấy ví dụ website bán sách thanh toán COD theo đề mẫu thay vì đề tài của nhóm. | Phát hiện lệch đề tài, yêu cầu điều chỉnh và tự sửa lại toàn bộ nội dung sang ngữ cảnh **website bán linh kiện điện tử**. |
| **04** | Thứ 3, Tuần 3<br>Giai đoạn Tài liệu | `docs/bao-cao-c1-c2`<br>`docs/bao-cao/chuong-2.md` | Soạn khung Chương 2 gồm cơ cấu nhóm, quản lý Sprint S5 và quy tắc đóng băng chức năng (feature freeze). | Gemini | **Tốt** – Trình bày mạch lạc, đúng luồng quản lý dự án và các mốc kiểm tra cuối ngày. | Giữ khung nội dung, bổ sung thêm thông tin thực tế về tiến độ vận hành của nhóm. |
| **05** | Thứ 3, Tuần 3<br>Giai đoạn Tài liệu | `docs/bao-cao-c1-c2`<br>`docs/bao-cao/chuong-2.md` | Tạo bảng Ma trận phân công công việc (`TM-xx`, kiểm thử, báo cáo) và Ma trận trách nhiệm RACI cho 5 thành viên. | Gemini | **Cần sửa (Thiếu thông tin)** – Bản mẫu ban đầu chưa có họ tên thật của các thành viên và thiếu tên ở mục 2.1. | Điền đầy đủ họ tên 5 thành viên (Nguyễn Chí Hải, Trần Ngọc Duy, Phạm Thiên Phúc, Mai Thanh Tân, Hoàng Tiến Đạt) và rà soát lại từng mã `TM-xx`. |
| **06** | Thứ 3, Tuần 3<br>Giai đoạn Tài liệu | `docs/bao-cao-c1-c2`<br>`docs/bao-cao/chuong-2.md` | Soạn mục 2.4 Tổng hợp retrospective (điểm làm tốt, tồn đọng, hướng khắc phục) và khung chèn minh chứng Trello. | Gemini | **Tốt** – Nêu sát các vấn đề thường gặp khi chốt sprint và kiểm thử chéo. | Chỉnh sửa lại phần tồn đọng cho đúng thực tế nhóm và chèn ảnh chụp màn hình bảng Trello của nhóm. |
| **07** | Thứ 3, Tuần 3<br>Giai đoạn Điều phối & Tài liệu | `docs/bao-cao-c1-c2`<br>`docs/bao-cao/chuong-9.md` | Tạo mẫu Phản tư AI (2 trường hợp sử dụng AI tốt, 2 trường hợp AI sai) để gửi cho các thành viên nộp trước 21:00 thứ 4. | Gemini | **Tốt** – Cấu trúc gọn gàng, có gợi ý rõ ràng giúp thành viên dễ điền đúng trọng tâm. | Gửi mẫu vào nhóm và nhắc hạn nộp trước 21:00 thứ 4 để kịp tổng hợp vào Chương 9. |
| **08** | Thứ 3, Tuần 3<br>Giai đoạn Sửa lỗi & Kiểm tra | `fix/TM-14`, `fix/TM-08`<br>`develop` | Rà soát quy trình xử lý lỗi kiểm thử chéo cho `TM-14` (Quản lý người dùng), `TM-08` (Hồ sơ cá nhân) và cú pháp commit `Closes #<số-issue>`. | Gemini | **Tốt** – Đúng quy ước Git/GitHub của môn học, giúp tự động đóng Issue khi merge. | Áp dụng khi sửa lỗi và kiểm tra toàn bộ cột *Lỗi* trên Trello về 0 trước mốc 22:00. |
