# CHƯƠNG 3. CÔNG NGHỆ SỬ DỤNG

## 3.1. Công nghệ Frontend – ReactJS

ReactJS là một thư viện JavaScript mã nguồn mở được sử dụng để xây dựng giao diện người dùng (User Interface – UI), đặc biệt phù hợp với các ứng dụng web có tính tương tác cao. ReactJS cho phép chia giao diện thành các thành phần nhỏ (Component), mỗi thành phần đảm nhiệm một chức năng riêng biệt và có thể được tái sử dụng ở nhiều vị trí khác nhau trong hệ thống.

Trong dự án website thương mại điện tử, ReactJS được sử dụng để phát triển phần giao diện phía người dùng (Frontend). Đây là nơi người dùng trực tiếp tương tác với hệ thống thông qua các chức năng như xem trang chủ, hiển thị danh sách sản phẩm, xem thông tin chi tiết sản phẩm, quản lý giỏ hàng và thực hiện các thao tác liên quan đến tài khoản, đặt hàng.

ReactJS hỗ trợ xây dựng giao diện theo mô hình Component, giúp nhóm chia nhỏ các khu vực giao diện thành những thành phần độc lập. Ví dụ, thanh điều hướng, thanh tìm kiếm, thẻ sản phẩm, danh sách sản phẩm và chân trang có thể được xây dựng thành các Component riêng biệt. Cách tổ chức này giúp mã nguồn dễ quản lý, thuận tiện tái sử dụng và giảm sự trùng lặp trong quá trình phát triển.

Ngoài ra, ReactJS hỗ trợ cập nhật giao diện dựa trên sự thay đổi của dữ liệu và trạng thái (State). Khi người dùng thực hiện một thao tác, chẳng hạn như thêm sản phẩm vào giỏ hàng, giao diện có thể được cập nhật để phản ánh kết quả mà không cần tải lại toàn bộ trang web.

**Lý do nhóm lựa chọn ReactJS:**

- ReactJS sử dụng JavaScript, phù hợp với định hướng sử dụng JavaScript cho cả Frontend và Backend của dự án.
- Hỗ trợ xây dựng giao diện theo Component, giúp tái sử dụng mã nguồn và dễ bảo trì.
- Có khả năng cập nhật giao diện linh hoạt khi dữ liệu thay đổi.
- Phù hợp để xây dựng website thương mại điện tử có nhiều trang và chức năng tương tác.
- Có cộng đồng sử dụng rộng rãi, tài liệu hướng dẫn và nhiều thư viện hỗ trợ.

Nhờ những ưu điểm trên, ReactJS giúp nhóm xây dựng giao diện website có tính tổ chức, thuận tiện trong quá trình phát triển và mở rộng chức năng.

## 3.2. Công nghệ Backend – Node.js và Express.js

### 3.2.1. Node.js

Node.js là môi trường thực thi JavaScript được xây dựng trên nền tảng V8 JavaScript Engine, cho phép chạy mã JavaScript bên ngoài trình duyệt, đặc biệt là ở phía máy chủ (Server-side).

Trong dự án, Node.js được sử dụng làm môi trường chạy cho phần Backend. Node.js tiếp nhận và thực thi mã nguồn phía máy chủ, hỗ trợ xử lý các yêu cầu từ Frontend, thực hiện các thao tác nghiệp vụ và làm việc với cơ sở dữ liệu thông qua các thư viện phù hợp.

Node.js sử dụng cơ chế xử lý bất đồng bộ (Asynchronous) và mô hình hướng sự kiện (Event-driven), giúp xử lý nhiều yêu cầu mà không phải chờ tuần tự từng thao tác. Điều này phù hợp với các ứng dụng web thường xuyên thực hiện những công việc như truy vấn sản phẩm, kiểm tra thông tin người dùng và xử lý đơn hàng.

**Lý do nhóm lựa chọn Node.js:**

- Sử dụng JavaScript, đồng bộ với ngôn ngữ lập trình ở phía Frontend.
- Hỗ trợ xử lý bất đồng bộ, phù hợp với các ứng dụng web.
- Có hệ sinh thái thư viện phong phú thông qua NPM.
- Thuận tiện trong việc xây dựng và phát triển Backend API.

### 3.2.2. Express.js

Express.js là một framework chạy trên nền tảng Node.js, được sử dụng để xây dựng ứng dụng web và API. Express.js cung cấp các cơ chế hỗ trợ định tuyến (Routing), xử lý yêu cầu và phản hồi HTTP (Request/Response), cũng như tổ chức các thành phần trung gian (Middleware).

Trong dự án, Express.js được sử dụng để xây dựng hệ thống Backend API, đóng vai trò trung gian kết nối giữa giao diện ReactJS và cơ sở dữ liệu SQL Server.

Khi người dùng thực hiện một thao tác trên giao diện, ReactJS gửi yêu cầu đến API tương ứng. Express.js tiếp nhận yêu cầu, chuyển đến chức năng xử lý phù hợp, thực hiện nghiệp vụ cần thiết và trả kết quả về cho Frontend. Ví dụ, khi người dùng xem danh sách sản phẩm, Frontend gửi yêu cầu lấy dữ liệu sản phẩm; Backend xử lý yêu cầu, truy vấn cơ sở dữ liệu và trả danh sách sản phẩm về dưới dạng dữ liệu để giao diện hiển thị.

Express.js cũng hỗ trợ tổ chức các tuyến API theo từng nhóm chức năng, giúp mã nguồn Backend rõ ràng và thuận tiện quản lý.

**Lý do nhóm lựa chọn Express.js:**

- Có cấu trúc tương đối đơn giản, dễ tiếp cận và triển khai.
- Hỗ trợ xây dựng REST API để Frontend giao tiếp với Backend.
- Có cơ chế Middleware giúp tổ chức xử lý yêu cầu linh hoạt.
- Tích hợp tốt với Node.js và các thư viện làm việc với cơ sở dữ liệu như Sequelize.
- Phù hợp với quy mô và yêu cầu phát triển của website thương mại điện tử.

Việc kết hợp Node.js và Express.js giúp nhóm xây dựng phần Backend bằng JavaScript, hỗ trợ xử lý nghiệp vụ và cung cấp API cho giao diện người dùng.

## 3.3. Hệ quản trị cơ sở dữ liệu – SQL Server

SQL Server là hệ quản trị cơ sở dữ liệu quan hệ (Relational Database Management System – RDBMS) do Microsoft phát triển. Hệ quản trị này cho phép tổ chức, lưu trữ, truy vấn và quản lý dữ liệu thông qua ngôn ngữ SQL.

Trong dự án website thương mại điện tử, SQL Server được sử dụng để lưu trữ và quản lý dữ liệu của toàn bộ hệ thống. Dữ liệu được tổ chức thành các bảng có mối quan hệ với nhau, giúp việc quản lý và truy xuất thông tin được thống nhất.

Cơ sở dữ liệu của hệ thống được thiết kế gồm sáu bảng chính:

- **Users:** Lưu trữ thông tin tài khoản người dùng.
- **Categories:** Lưu trữ thông tin danh mục sản phẩm.
- **Products:** Lưu trữ thông tin sản phẩm như tên sản phẩm, mô tả, giá, số lượng tồn kho và hình ảnh.
- **Cart_items:** Lưu trữ thông tin các sản phẩm được thêm vào giỏ hàng của người dùng.
- **Orders:** Lưu trữ thông tin đơn hàng, tổng tiền, thông tin giao hàng và trạng thái đơn hàng.
- **Order_items:** Lưu trữ thông tin chi tiết từng sản phẩm thuộc một đơn hàng, bao gồm số lượng, đơn giá và thành tiền.

Các bảng được liên kết với nhau thông qua khóa chính (Primary Key) và khóa ngoại (Foreign Key). Ví dụ, bảng Products liên kết với bảng Categories thông qua trường category_id; bảng Orders liên kết với Users thông qua user_id. Những mối quan hệ này giúp dữ liệu được tổ chức chặt chẽ và hạn chế tình trạng lưu trữ thông tin không nhất quán.

Bên cạnh đó, SQL Server hỗ trợ các ràng buộc dữ liệu như NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY và CHECK. Các ràng buộc này giúp kiểm soát dữ liệu đầu vào, hạn chế những trường hợp dữ liệu không hợp lệ và đảm bảo tính toàn vẹn của cơ sở dữ liệu.

**Lý do nhóm lựa chọn SQL Server:**

- Là hệ quản trị cơ sở dữ liệu quan hệ, phù hợp với dữ liệu có cấu trúc và mối quan hệ rõ ràng.
- Hỗ trợ khóa chính, khóa ngoại và các ràng buộc nhằm đảm bảo tính toàn vẹn dữ liệu.
- Hỗ trợ ngôn ngữ SQL để truy vấn và quản lý dữ liệu.
- Có công cụ SQL Server Management Studio hỗ trợ quản trị cơ sở dữ liệu trực quan.
- Phù hợp với yêu cầu xây dựng hệ thống quản lý người dùng, sản phẩm, giỏ hàng và đơn hàng.

Nhờ SQL Server, nhóm có thể tổ chức và quản lý dữ liệu tập trung, đảm bảo mối quan hệ giữa các bảng và hỗ trợ các chức năng của website.

## 3.4. Công nghệ ORM – Sequelize

Sequelize là một thư viện ORM (Object-Relational Mapping) dành cho Node.js, hỗ trợ làm việc với cơ sở dữ liệu quan hệ thông qua các đối tượng và phương thức JavaScript. Thay vì phải viết toàn bộ câu lệnh SQL trực tiếp, lập trình viên có thể sử dụng các phương thức của Sequelize để thực hiện những thao tác như tạo, đọc, cập nhật và xóa dữ liệu.

Trong dự án, Sequelize được sử dụng làm công cụ kết nối và thao tác với cơ sở dữ liệu SQL Server từ phía Backend. Sequelize giúp ánh xạ các bảng trong cơ sở dữ liệu thành các Model trong mã nguồn JavaScript. Mỗi Model đại diện cho một bảng dữ liệu và mô tả các thuộc tính tương ứng với các trường trong bảng.

Thông qua các Model, Backend có thể thực hiện những thao tác dữ liệu như truy vấn danh sách sản phẩm, tìm kiếm thông tin người dùng, thêm sản phẩm vào giỏ hàng, tạo đơn hàng và truy xuất chi tiết đơn hàng.

Ngoài việc thao tác với dữ liệu, Sequelize còn hỗ trợ quản lý cấu trúc cơ sở dữ liệu thông qua Migration và Seed dữ liệu thông qua Seeder.

**Migration** là cơ chế quản lý những thay đổi trong cấu trúc cơ sở dữ liệu bằng các tệp mã nguồn. Thông qua Migration, nhóm có thể tạo bảng, thêm cột, chỉnh sửa cấu trúc hoặc thiết lập các mối quan hệ giữa các bảng. Mỗi Migration có thể định nghĩa hai thao tác chính là `up` để thực hiện thay đổi và `down` để hoàn tác thay đổi khi cần thiết.

**Seeder** được sử dụng để đưa dữ liệu mẫu vào cơ sở dữ liệu. Trong quá trình phát triển và kiểm thử, nhóm có thể sử dụng Seeder để tạo các dữ liệu ban đầu như danh mục, sản phẩm, tài khoản người dùng và đơn hàng mẫu. Điều này giúp các thành viên có dữ liệu thống nhất để kiểm tra các chức năng của hệ thống.

**Lý do nhóm lựa chọn Sequelize:**

- Hỗ trợ làm việc với cơ sở dữ liệu quan hệ bằng JavaScript.
- Tương thích với Node.js và Express.js.
- Hỗ trợ kết nối với SQL Server.
- Hỗ trợ Model để tổ chức và quản lý dữ liệu theo từng bảng.
- Cung cấp Migration để quản lý các thay đổi của cấu trúc cơ sở dữ liệu.
- Cung cấp Seeder để tạo dữ liệu mẫu phục vụ phát triển và kiểm thử.
- Giúp mã nguồn Backend dễ tổ chức và thuận tiện bảo trì.

Việc sử dụng Sequelize giúp nhóm quản lý quá trình kết nối, thao tác dữ liệu, thay đổi cấu trúc cơ sở dữ liệu và tạo dữ liệu mẫu một cách có hệ thống. Đây là công cụ phù hợp với định hướng xây dựng Backend bằng Node.js và Express.js kết hợp với SQL Server.

## 3.5. Công cụ hỗ trợ phát triển

Bên cạnh các công nghệ chính, nhóm sử dụng một số công cụ hỗ trợ trong quá trình lập trình, quản lý cơ sở dữ liệu, kiểm soát phiên bản và phối hợp công việc.

| Công cụ                             | Mục đích sử dụng                                                                                                       |
|-------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| Visual Studio Code (VS Code)        | Là môi trường soạn thảo mã nguồn, hỗ trợ lập trình JavaScript, ReactJS, Node.js và quản lý các tệp trong dự án.        |
| SQL Server Management Studio (SSMS) | Hỗ trợ kết nối, quản lý cơ sở dữ liệu SQL Server, xem cấu trúc bảng, thực hiện câu lệnh SQL và kiểm tra dữ liệu.       |
| Git                                 | Sử dụng để quản lý phiên bản mã nguồn, theo dõi các thay đổi và hỗ trợ làm việc với các nhánh phát triển.              |
| GitHub                              | Sử dụng để lưu trữ mã nguồn trực tuyến, chia sẻ dự án, phối hợp giữa các thành viên và quản lý quá trình Pull Request. |
| Trello                              | Hỗ trợ quản lý công việc nhóm, phân công nhiệm vụ, theo dõi tiến độ và cập nhật trạng thái thực hiện công việc.        |

**Vai trò của các công cụ trong dự án:**

Visual Studio Code được sử dụng làm môi trường phát triển chính, giúp các thành viên viết và chỉnh sửa mã nguồn của Frontend và Backend.

SQL Server Management Studio hỗ trợ nhóm quản lý cơ sở dữ liệu, kiểm tra các bảng, khóa và dữ liệu được lưu trữ trong SQL Server.

Git và GitHub được sử dụng kết hợp để quản lý mã nguồn. Git giúp theo dõi lịch sử thay đổi và quản lý các nhánh làm việc, trong khi GitHub hỗ trợ lưu trữ mã nguồn tập trung và phối hợp giữa các thành viên thông qua việc đẩy mã nguồn lên kho lưu trữ và tạo Pull Request.

Trello được sử dụng để tổ chức công việc nhóm, phân chia nhiệm vụ cho từng thành viên và theo dõi tiến độ thực hiện các công việc trong quá trình xây dựng website.

Nhìn chung, các công cụ trên hỗ trợ nhóm trong việc phát triển, quản lý và phối hợp thực hiện dự án, góp phần nâng cao hiệu quả làm việc và hạn chế những khó khăn khi nhiều thành viên cùng tham gia xây dựng hệ thống.

## 3.6. Lý do lựa chọn công nghệ và tổng kết

### 3.6.1. Lý do lựa chọn tổng thể

Nhóm lựa chọn ReactJS, Node.js, Express.js, SQL Server và Sequelize nhằm xây dựng website thương mại điện tử theo mô hình phân chia thành ba phần chính: Frontend, Backend và Database.

Mỗi công nghệ đảm nhiệm một vai trò riêng trong hệ thống:

- **ReactJS:** Xây dựng giao diện người dùng, hiển thị thông tin và tiếp nhận thao tác từ người dùng.
- **Node.js:** Cung cấp môi trường thực thi JavaScript ở phía máy chủ.
- **Express.js:** Xây dựng API, tiếp nhận yêu cầu từ Frontend và xử lý các nghiệp vụ của hệ thống.
- **SQL Server:** Lưu trữ và quản lý dữ liệu của website.
- **Sequelize:** Hỗ trợ Backend kết nối, thao tác dữ liệu và quản lý thay đổi cấu trúc cơ sở dữ liệu thông qua Migration, đồng thời tạo dữ liệu mẫu bằng Seeder.

Việc sử dụng JavaScript ở cả Frontend và Backend giúp nhóm thống nhất ngôn ngữ lập trình, thuận tiện trong quá trình trao đổi và phát triển mã nguồn. Sequelize đóng vai trò kết nối giữa Backend và SQL Server, giúp việc thao tác dữ liệu được tổ chức thông qua các Model và phương thức JavaScript.

Ngoài ra, việc sử dụng Git, GitHub và Trello giúp nhóm quản lý mã nguồn, phân công nhiệm vụ và theo dõi tiến độ thực hiện dự án. Các công cụ này góp phần hỗ trợ quá trình phối hợp làm việc giữa các thành viên.

### 3.6.2. Tổng kết chương

Trong chương này, nhóm đã trình bày các công nghệ và công cụ được sử dụng để xây dựng website thương mại điện tử. ReactJS được sử dụng để phát triển giao diện người dùng; Node.js và Express.js đảm nhiệm việc xây dựng và xử lý các chức năng phía máy chủ; SQL Server được sử dụng để lưu trữ và quản lý dữ liệu; Sequelize hỗ trợ kết nối, thao tác dữ liệu và quản lý cấu trúc cơ sở dữ liệu.

Bên cạnh đó, các công cụ như Visual Studio Code, SQL Server Management Studio, Git, GitHub và Trello hỗ trợ nhóm trong quá trình lập trình, quản lý dữ liệu và phối hợp thực hiện dự án.

Việc lựa chọn các công nghệ trên phù hợp với yêu cầu của đề tài, giúp phân chia rõ trách nhiệm giữa các thành phần của hệ thống, thuận tiện cho quá trình phát triển, kiểm thử, bảo trì và mở rộng website trong tương lai.
