PHẦN A – CHƯƠNG 3: CÔNG NGHỆ SỬ DỤNG
1. Mục đích của chương 3
Chương này trả lời 3 câu hỏi:
1. Website sử dụng những công nghệ nào?
2. Mỗi công nghệ dùng để làm gì?
3. Vì sao nhóm chọn những công nghệ đó?
Không nên chỉ liệt kê tên công nghệ. Mỗi công nghệ cần có phần giới thiệu, vai trò và lý do lựa chọn.
2. Cấu trúc chương 3 đề xuất
Mục	Nội dung
3.1	Công nghệ Frontend – ReactJS
3.2	Công nghệ Backend – Node.js và Express.js
3.3	Hệ quản trị cơ sở dữ liệu – SQL Server
3.4	ORM – Sequelize
3.5	Công cụ hỗ trợ phát triển
3.6	Lý do lựa chọn và tổng kết

3. Cách viết từng mục
3.1. ReactJS
Nên trình bày:
- ReactJS là gì?
- ReactJS được sử dụng ở phần nào?
- ReactJS giúp xây dựng giao diện ra sao?
- Lý do nhóm lựa chọn ReactJS.
Đoạn mẫu:
ReactJS là thư viện JavaScript được sử dụng để xây dựng giao diện người dùng. Trong dự án, ReactJS đảm nhiệm việc phát triển giao diện website thương mại điện tử, bao gồm trang chủ, danh sách sản phẩm, chi tiết sản phẩm, giỏ hàng và các giao diện liên quan đến người dùng. ReactJS hỗ trợ xây dựng giao diện theo component, giúp tái sử dụng các thành phần và thuận tiện trong quá trình bảo trì, mở rộng hệ thống.

3.2. Node.js và Express.js
Nên tách rõ vai trò:
- Node.js: Môi trường chạy JavaScript phía máy chủ.
- Express.js: Framework hỗ trợ xây dựng API và xử lý request/response.
Đoạn mẫu:
Node.js được sử dụng làm môi trường thực thi JavaScript phía máy chủ. Express.js được sử dụng để xây dựng Backend API, tiếp nhận yêu cầu từ Frontend, xử lý nghiệp vụ và trả dữ liệu về cho người dùng. Việc sử dụng Node.js và Express.js giúp nhóm xây dựng hệ thống Backend bằng JavaScript, đồng bộ ngôn ngữ lập trình giữa Frontend và Backend.

3.3. SQL Server
Nội dung cần viết:
- SQL Server là hệ quản trị cơ sở dữ liệu quan hệ.
- Lưu trữ thông tin người dùng, danh mục, sản phẩm, giỏ hàng và đơn hàng.
- Hỗ trợ khóa chính, khóa ngoại, ràng buộc và truy vấn dữ liệu.
Đoạn mẫu:
SQL Server được nhóm lựa chọn làm hệ quản trị cơ sở dữ liệu để lưu trữ và quản lý dữ liệu của hệ thống. Dữ liệu được tổ chức thành các bảng có quan hệ với nhau thông qua khóa chính và khóa ngoại. SQL Server hỗ trợ các ràng buộc dữ liệu, giúp đảm bảo tính toàn vẹn và hạn chế dữ liệu không hợp lệ.

3.4. Sequelize
Đây là phần cần viết kỹ vì nhóm sử dụng Sequelize thay vì Prisma.
Sequelize là một ORM dành cho Node.js, cho phép làm việc với cơ sở dữ liệu thông qua JavaScript thay vì phải viết toàn bộ câu lệnh SQL trực tiếp. Trong dự án, Sequelize được sử dụng để quản lý kết nối SQL Server, định nghĩa cấu trúc dữ liệu, thực hiện migration và seed dữ liệu mẫu. Việc sử dụng Sequelize giúp nhóm quản lý thay đổi cấu trúc cơ sở dữ liệu có hệ thống và thuận tiện hơn trong quá trình phát triển.

3.5. Công cụ hỗ trợ
Có thể trình bày bằng bảng:
Công cụ	Mục đích sử dụng
Visual Studio Code	Viết và chỉnh sửa mã nguồn
SQL Server Management Studio	Quản lý database, chạy câu lệnh SQL
Git	Quản lý phiên bản mã nguồn
GitHub	Lưu trữ mã nguồn và phối hợp nhóm
Trello	Quản lý công việc, theo dõi tiến độ

Chỉ giữ những công cụ nhóm thực sự sử dụng.
3.6. Tổng kết lý do lựa chọn
Kết thúc chương bằng một đoạn tổng hợp:
Nhóm lựa chọn ReactJS, Node.js, Express.js, SQL Server và Sequelize nhằm xây dựng hệ thống theo mô hình Frontend – Backend – Database. Các công nghệ được phân chia theo từng nhiệm vụ cụ thể, giúp hệ thống dễ phát triển, quản lý dữ liệu, kiểm thử và bảo trì.