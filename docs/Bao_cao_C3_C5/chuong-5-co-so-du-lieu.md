# MÔ TẢ CẤU TRÚC CƠ SỞ DỮ LIỆU

## 1. Tổng quan

Cơ sở dữ liệu được thiết kế cho hệ thống thương mại điện tử, phục vụ việc quản lý tài khoản người dùng, danh mục, sản phẩm, giỏ hàng và đơn đặt hàng.

Cơ sở dữ liệu gồm 6 bảng:

1. `Users`
2. `categories`
3. `products`
4. `cart_items`
5. `orders`
6. `order_items`

- Các bảng được liên kết với nhau thông qua khóa chính (PK) và khóa ngoại (FK), đảm bảo tính toàn vẹn và nhất quán dữ liệu.
- Hệ quản trị cơ sở dữ liệu là SQL Server, được tạo và quản lý bằng Sequelize 6 (Migration).
- Các kiểu dữ liệu trong tài liệu là kiểu thực tế trên SQL Server do Sequelize ánh xạ: STRING thành NVARCHAR, TEXT thành NVARCHAR(MAX), INTEGER thành INT, DECIMAL(12,2) thành DECIMAL(12,2), BOOLEAN thành BIT và cột tự tăng dùng IDENTITY(1,1).
- Cấu trúc được tạo và cập nhật bởi 3 migration:
  - `20261111000100-create-ecommerce-tables`: Tạo 6 bảng, CHECK constraint và index.
  - `20261117000100-add-product-is-active`: Bổ sung cột `products.is_active`.
  - `20261125000100-add-receiver-name-to-orders`: Bổ sung cột `orders.receiver_name`.

## 2. Chi tiết các bảng

### 2.1. Bảng Users

**Mục đích:** Lưu trữ thông tin tài khoản người dùng.

| Tên cột  | Kiểu dữ liệu  | Ràng buộc                    | Mô tả                                   |
|----------|---------------|------------------------------|-----------------------------------------|
| user_id  | INT           | PK, IDENTITY(1,1), NOT NULL  | Mã người dùng                           |
| name     | NVARCHAR(225) | NOT NULL                     | Họ tên người dùng                       |
| email    | NVARCHAR(225) | NOT NULL, UNIQUE             | Email đăng nhập                         |
| password | NVARCHAR(225) | NOT NULL                     | Mật khẩu tài khoản                      |
| phone    | NVARCHAR(225) | NULL                         | Số điện thoại                           |
| role     | NVARCHAR(50)  | NOT NULL, DEFAULT 'customer' | Vai trò tài khoản, mặc định là customer |
| status   | NVARCHAR(50)  | NOT NULL, DEFAULT 'ACTIVE'   | Trạng thái tài khoản, mặc định là ACTIVE|

**Ghi chú:** Email được thiết lập UNIQUE để không cho phép hai tài khoản sử dụng cùng một địa chỉ email.

### 2.2. Bảng categories

**Mục đích:** Lưu trữ thông tin danh mục sản phẩm.

| Tên cột       | Kiểu dữ liệu  | Ràng buộc                   | Mô tả          |
|---------------|---------------|-----------------------------|----------------|
| category_id   | INT           | PK, IDENTITY(1,1), NOT NULL | Mã danh mục    |
| category_name | NVARCHAR(225) | NOT NULL                    | Tên danh mục   |
| description   | NVARCHAR(MAX) | NULL                        | Mô tả danh mục |

### 2.3. Bảng products

**Mục đích:** Lưu trữ thông tin sản phẩm trong hệ thống.

| Tên cột      | Kiểu dữ liệu  | Ràng buộc                               | Mô tả                                                                        |
|--------------|---------------|-----------------------------------------|------------------------------------------------------------------------------|
| product_id   | INT           | PK, IDENTITY(1,1), NOT NULL             | Mã sản phẩm                                                                  |
| category_id  | INT           | FK, NOT NULL                            | Mã danh mục                                                                  |
| product_name | NVARCHAR(225) | NOT NULL                                | Tên sản phẩm                                                                 |
| description  | NVARCHAR(MAX) | NULL                                    | Mô tả sản phẩm                                                               |
| price        | DECIMAL(12,2) | NOT NULL, CHECK (price >= 0)            | Giá sản phẩm                                                                 |
| stock        | INT           | NOT NULL, DEFAULT 0, CHECK (stock >= 0) | Số lượng tồn kho                                                             |
| image        | NVARCHAR(225) | NULL                                    | Đường dẫn hình ảnh sản phẩm                                                  |
| is_active    | BIT           | NOT NULL, DEFAULT 1                     | Trạng thái hoạt động của sản phẩm: 1 là đang hoạt động, 0 là ngừng hoạt động |

**Khóa ngoại:**

- `category_id` tham chiếu đến `categories(category_id)`.
- ON UPDATE CASCADE.
- ON DELETE NO ACTION.

**Chỉ mục:**

- INDEX(`product_name`).
- INDEX(`category_id`).

**Ghi chú:** Cột `is_active` được bổ sung bằng migration riêng. Cột này cho phép xác định sản phẩm còn hoạt động hay đã ngừng hoạt động mà không cần xóa bản ghi sản phẩm khỏi cơ sở dữ liệu.

### 2.4. Bảng cart_items

**Mục đích:** Lưu trữ các sản phẩm được thêm vào giỏ hàng của người dùng.

| Tên cột      | Kiểu dữ liệu | Ràng buộc                                 | Mô tả                |
|--------------|--------------|-------------------------------------------|----------------------|
| cart_item_id | INT          | PK, IDENTITY(1,1), NOT NULL               | Mã chi tiết giỏ hàng |
| user_id      | INT          | FK, NOT NULL                              | Mã người dùng        |
| product_id   | INT          | FK, NOT NULL                              | Mã sản phẩm          |
| quantity     | INT          | NOT NULL, DEFAULT 1, CHECK (quantity > 0) | Số lượng sản phẩm    |

**Khóa ngoại:**

- `user_id` tham chiếu đến `Users(user_id)`, ON UPDATE CASCADE, ON DELETE CASCADE.
- `product_id` tham chiếu đến `products(product_id)`, ON UPDATE CASCADE, ON DELETE NO ACTION.

### 2.5. Bảng orders

**Mục đích:** Lưu trữ thông tin đơn đặt hàng của người dùng và thông tin người nhận hàng.

| Tên cột          | Kiểu dữ liệu  | Ràng buộc                   | Mô tả                                    |
|------------------|---------------|-----------------------------|------------------------------------------|
| order_id         | INT           | PK, IDENTITY(1,1), NOT NULL | Mã đơn hàng                              |
| user_id          | INT           | FK, NOT NULL                | Mã người dùng đặt hàng                   |
| total_amount     | DECIMAL(12,2) | NOT NULL                    | Tổng tiền đơn hàng                       |
| receiver_name    | NVARCHAR(225) | NULL                        | Tên người nhận hàng                      |
| shipping_address | NVARCHAR(225) | NOT NULL                    | Địa chỉ giao hàng                        |
| phone            | NVARCHAR(225) | NOT NULL                    | Số điện thoại nhận hàng                  |
| status           | NVARCHAR(225) | NOT NULL, DEFAULT 'pending' | Trạng thái đơn hàng, mặc định là pending |

**Khóa ngoại:**

- `user_id` tham chiếu đến `Users(user_id)`.
- ON UPDATE CASCADE.
- ON DELETE NO ACTION.

**Chỉ mục:**

- INDEX(`user_id`, `status`).

**Ghi chú:**

- Cột `receiver_name` được bổ sung bằng migration riêng và cho phép NULL để tương thích với các đơn hàng đã tồn tại trước khi bổ sung cột.
- Cột `status` được khai báo dạng chuỗi NVARCHAR(225), không phải ENUM. Migration chỉ thiết lập giá trị mặc định là `pending`, không khai báo danh sách trạng thái hợp lệ bằng CHECK constraint.

### 2.6. Bảng order_items

**Mục đích:** Lưu trữ chi tiết các sản phẩm thuộc từng đơn hàng.

| Tên cột        | Kiểu dữ liệu  | Ràng buộc                                 | Mô tả                          |
|----------------|---------------|-------------------------------------------|--------------------------------|
| order_items_id | INT           | PK, IDENTITY(1,1), NOT NULL               | Mã chi tiết đơn hàng           |
| order_id       | INT           | FK, NOT NULL                              | Mã đơn hàng                    |
| product_id     | INT           | FK, NOT NULL                              | Mã sản phẩm                    |
| quantity       | INT           | NOT NULL, DEFAULT 1, CHECK (quantity > 0) | Số lượng sản phẩm              |
| price          | DECIMAL(12,2) | NOT NULL, CHECK (price >= 0)              | Đơn giá tại thời điểm đặt hàng |
| subtotal       | DECIMAL(12,2) | NOT NULL                                  | Thành tiền                     |

**Khóa ngoại:**

- `order_id` tham chiếu đến `orders(order_id)`, ON UPDATE CASCADE, ON DELETE CASCADE.
- `product_id` tham chiếu đến `products(product_id)`, ON UPDATE CASCADE, ON DELETE NO ACTION.

**Công thức tính:**

`subtotal = quantity × price`.

**Ghi chú:** Công thức tính `subtotal` không được khai báo thành CHECK constraint hoặc computed column trong migration. Việc tính toán và đảm bảo tính nhất quán được thực hiện ở tầng ứng dụng.

## 3. Mô tả các mối quan hệ

| STT | Bảng cha   | Bảng con    | Quan hệ | ON UPDATE | ON DELETE |
|-----|------------|-------------|---------|-----------|-----------|
| 1   | Users      | cart_items  | 1-N     | CASCADE   | CASCADE   |
| 2   | Users      | orders      | 1-N     | CASCADE   | NO ACTION |
| 3   | categories | products    | 1-N     | CASCADE   | NO ACTION |
| 4   | products   | cart_items  | 1-N     | CASCADE   | NO ACTION |
| 5   | orders     | order_items | 1-N     | CASCADE   | CASCADE   |
| 6   | products   | order_items | 1-N     | CASCADE   | NO ACTION |

**Giải thích hành vi khi xóa:**

- **CASCADE:** Khi xóa người dùng, giỏ hàng của người dùng đó bị xóa theo; khi xóa đơn hàng, các chi tiết đơn hàng tương ứng cũng bị xóa theo.
- **NO ACTION:** Không cho phép xóa bản ghi cha nếu vẫn còn bản ghi con tham chiếu tới. Ví dụ: không xóa được danh mục còn sản phẩm, sản phẩm đã nằm trong giỏ hàng hoặc đơn hàng, và người dùng đã có đơn hàng.

**Lưu ý về ON UPDATE:** Các migration khai báo `onUpdate: "CASCADE"` cho cả 6 khóa ngoại. SQL Server hỗ trợ `ON UPDATE CASCADE`; bảng trên thể hiện hành động được cấu hình trong migration. Có thể kiểm tra hành động thực tế đã được lưu trong database bằng truy vấn metadata tại SQL Server:

```sql
SELECT
    name,
    OBJECT_NAME(parent_object_id) AS child_table,
    OBJECT_NAME(referenced_object_id) AS parent_table,
    update_referential_action_desc,
    delete_referential_action_desc
FROM sys.foreign_keys;
```

## 4. Các ràng buộc dữ liệu

- **PRIMARY KEY:** Mỗi bảng có một khóa chính tự tăng để xác định duy nhất từng bản ghi.
- **FOREIGN KEY:** Đảm bảo dữ liệu giữa các bảng có liên kết hợp lệ, với quy tắc ON UPDATE và ON DELETE như mục 3.
- **UNIQUE:** Email người dùng không được trùng lặp.
- **NOT NULL:** Các cột được khai báo NOT NULL bắt buộc phải có giá trị. Có 5 cột cho phép NULL là `Users.phone`, `categories.description`, `products.description`, `products.image` và `orders.receiver_name`.
- **DEFAULT:** Các giá trị mặc định gồm `Users.role = 'customer'`, `products.stock = 0`, `products.is_active = 1`, `cart_items.quantity = 1`, `orders.status = 'pending'` và `order_items.quantity = 1`.
- **CHECK:** Giá sản phẩm và tồn kho không được âm; số lượng sản phẩm phải lớn hơn 0; đơn giá trong chi tiết đơn hàng không được âm.

### Danh sách các ràng buộc CHECK

| STT | Tên ràng buộc            | Bảng        | Điều kiện    |
|-----|--------------------------|-------------|--------------|
| 1   | chk_products_price       | products    | price >= 0   |
| 2   | chk_products_stock       | products    | stock >= 0   |
| 3   | chk_cart_items_quantity  | cart_items  | quantity > 0 |
| 4   | chk_order_items_quantity | order_items | quantity > 0 |
| 5   | chk_order_items_price    | order_items | price >= 0   |

**Lưu ý:**

- Công thức `subtotal = quantity × price` và `total_amount = tổng các subtotal` chưa được ràng buộc ở mức cơ sở dữ liệu, cần được kiểm soát ở tầng ứng dụng.
- Migration chưa khai báo CHECK constraint cho `orders.total_amount` và `order_items.subtotal`.

## 5. Các chỉ mục (INDEX)

| STT | Bảng     | Tên chỉ mục               | Cột             | Mục đích                                                 |
|-----|----------|---------------------------|-----------------|----------------------------------------------------------|
| 1   | products | idx_products_product_name | product_name    | Tăng tốc tìm kiếm sản phẩm theo tên                      |
| 2   | products | idx_products_category_id  | category_id     | Tăng tốc lọc sản phẩm theo danh mục                      |
| 3   | orders   | idx_orders_user_id_status | user_id, status | Tăng tốc truy vấn đơn hàng theo người dùng và trạng thái |

## 6. Nguyên tắc chuẩn hóa

Cơ sở dữ liệu được thiết kế theo nguyên tắc chuẩn hóa, hướng đến dạng chuẩn thứ ba (3NF), nhằm hạn chế dư thừa dữ liệu và đảm bảo tính nhất quán.

- **1NF:** Các thuộc tính chứa giá trị đơn, không chứa nhóm dữ liệu lặp trong cùng một trường.
- **2NF:** Các thuộc tính không khóa phụ thuộc đầy đủ vào khóa chính.
- **3NF:** Không có phụ thuộc bắc cầu giữa các thuộc tính không khóa.

### Ví dụ áp dụng trong hệ thống

- **1NF:** Mỗi dòng trong bảng `order_items` lưu thông tin một sản phẩm thuộc một đơn hàng, không lưu danh sách nhiều sản phẩm trong cùng một trường.
- **2NF:** Các thông tin `quantity`, `price` và `subtotal` được lưu tại `order_items` vì chúng mô tả sản phẩm trong từng đơn hàng.
- **3NF:** Thông tin danh mục được lưu riêng trong bảng `categories`. Bảng `products` chỉ lưu `category_id` để liên kết đến danh mục, tránh lặp lại thông tin danh mục trong từng sản phẩm.

Các giá trị `total_amount` và `subtotal` được lưu để phục vụ nghiệp vụ đơn hàng và cần được kiểm soát tính nhất quán với chi tiết sản phẩm. Cột `price` trong `order_items` lưu đơn giá tại thời điểm đặt hàng nên không bị ảnh hưởng khi giá trong bảng `products` thay đổi về sau.

## 7. Quyết định thiết kế chính

### 7.1. Vì sao tách order_items khỏi orders

- Một đơn hàng có nhiều sản phẩm và một sản phẩm có thể nằm trong nhiều đơn hàng, tức là quan hệ N-N giữa `orders` và `products`. `order_items` là bảng trung gian, tách quan hệ này thành hai quan hệ 1-N.
- Nếu gộp vào `orders`, hoặc phải lặp cột (sản phẩm 1, sản phẩm 2, ...) vi phạm 1NF, hoặc phải lặp cả dòng đơn hàng cho mỗi sản phẩm làm trùng địa chỉ, số điện thoại và trạng thái.
- Các thuộc tính `quantity`, `price`, `subtotal` phụ thuộc vào từng sản phẩm trong đơn hàng nên được lưu tại `order_items`, không thuộc riêng về `orders` hay `products`.
- Khi xóa một đơn hàng, các dòng chi tiết bị xóa theo nhờ ON DELETE CASCADE.

### 7.2. Vì sao lưu giá tại thời điểm mua

- Giá trong `products` thay đổi theo thời gian (khuyến mãi, tăng giá). Nếu `order_items` chỉ lưu `product_id` thì đơn hàng cũ có thể bị ảnh hưởng khi giá sản phẩm thay đổi.
- `order_items.price` lưu đơn giá lúc đặt hàng, `subtotal = quantity × price`, và `orders.total_amount` là tổng các subtotal của đơn.
- Đây là dữ liệu lịch sử phục vụ nghiệp vụ đơn hàng, không phải bản sao dư thừa của `products.price`.
- Khi tạo đơn hàng cần dùng transaction để `price`, `subtotal` và `total_amount` luôn nhất quán với nhau.

### 7.3. Vì sao sử dụng is_active trong products

- Cột `is_active` dùng để xác định sản phẩm có đang hoạt động trong hệ thống hay không.
- Giá trị 1 thể hiện sản phẩm đang hoạt động.
- Giá trị 0 thể hiện sản phẩm đã ngừng hoạt động.
- Việc sử dụng cột này giúp hệ thống có thể ngừng kinh doanh một sản phẩm mà không cần xóa dữ liệu sản phẩm khỏi cơ sở dữ liệu.

### 7.4. Vì sao receiver_name cho phép NULL trong orders

- Cột `receiver_name` lưu tên người nhận hàng của đơn hàng.
- Cột này cho phép NULL để tương thích với các bản ghi đơn hàng đã tồn tại trước khi migration bổ sung cột được chạy.
- Những đơn hàng mới có thể cung cấp tên người nhận khi tạo đơn hàng theo yêu cầu nghiệp vụ.

## 8. Kết luận

Cơ sở dữ liệu gồm 6 bảng: `Users`, `categories`, `products`, `cart_items`, `orders` và `order_items`. Các bảng có khóa chính, khóa ngoại, các mối quan hệ và ràng buộc dữ liệu theo cấu trúc migration. Các chỉ mục được lựa chọn nhằm cải thiện hiệu suất truy vấn. Thiết kế hướng đến chuẩn hóa 3NF, đảm bảo tính toàn vẹn và hạn chế dư thừa dữ liệu trong hệ thống thương mại điện tử.