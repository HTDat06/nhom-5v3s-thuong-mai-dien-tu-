require("dotenv").config();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  { category_name: "CPU - Bộ vi xử lý", description: "Các loại bộ vi xử lý máy tính Intel và AMD" },
  { category_name: "Mainboard - Bo mạch chủ", description: "Các loại bo mạch chủ máy tính" },
  { category_name: "RAM - Bộ nhớ", description: "Các loại bộ nhớ RAM DDR4 và DDR5" },
  { category_name: "VGA - Card màn hình", description: "Các loại card đồ họa rời" },
  { category_name: "Ổ cứng - Lưu trữ", description: "Các loại ổ cứng SSD NVMe, SATA và HDD" },
  { category_name: "PSU - Nguồn máy tính", description: "Bộ nguồn máy tính chuẩn 80 Plus" },
  { category_name: "Case - Vỏ máy tính", description: "Thùng máy tính Mid-Tower và Mini-ITX" },
  { category_name: "Tản nhiệt - Cooling", description: "Tản nhiệt khí và tản nhiệt nước AIO" }
];

const products = [
  // 1. CPU - Bộ vi xử lý (8 sản phẩm)
  { product_name: "Intel Core i3-12100F", category_name: "CPU - Bộ vi xử lý", price: 1890000, stock: 20 },
  { product_name: "Intel Core i3-14100F", category_name: "CPU - Bộ vi xử lý", price: 2590000, stock: 16 },
  { product_name: "Intel Core i5-12400F", category_name: "CPU - Bộ vi xử lý", price: 2990000, stock: 15 },
  { product_name: "Intel Core i5-13400F", category_name: "CPU - Bộ vi xử lý", price: 4290000, stock: 12 },
  { product_name: "Intel Core i5-14600K", category_name: "CPU - Bộ vi xử lý", price: 7490000, stock: 9 },
  { product_name: "Intel Core i7-13700K", category_name: "CPU - Bộ vi xử lý", price: 8990000, stock: 8 },
  { product_name: "AMD Ryzen 5 5600", category_name: "CPU - Bộ vi xử lý", price: 2490000, stock: 18 },
  { product_name: "AMD Ryzen 7 5700X", category_name: "CPU - Bộ vi xử lý", price: 3990000, stock: 10 },

  // 2. Mainboard - Bo mạch chủ (7 sản phẩm)
  { product_name: "ASUS PRIME H610M-K", category_name: "Mainboard - Bo mạch chủ", price: 1790000, stock: 15 },
  { product_name: "MSI PRO B760M-E", category_name: "Mainboard - Bo mạch chủ", price: 2390000, stock: 12 },
  { product_name: "Gigabyte B760M DS3H", category_name: "Mainboard - Bo mạch chủ", price: 2990000, stock: 10 },
  { product_name: "ASUS TUF GAMING B760M-PLUS WIFI", category_name: "Mainboard - Bo mạch chủ", price: 3890000, stock: 8 },
  { product_name: "ASUS TUF GAMING B550M-PLUS", category_name: "Mainboard - Bo mạch chủ", price: 3290000, stock: 8 },
  { product_name: "MSI MAG B650 TOMAHAWK", category_name: "Mainboard - Bo mạch chủ", price: 5690000, stock: 6 },
  { product_name: "Gigabyte A520M S2H", category_name: "Mainboard - Bo mạch chủ", price: 1490000, stock: 14 },

  // 3. RAM - Bộ nhớ (7 sản phẩm)
  { product_name: "Kingston Fury Beast 8GB DDR4", category_name: "RAM - Bộ nhớ", price: 490000, stock: 30 },
  { product_name: "Kingston Fury Beast 16GB DDR4", category_name: "RAM - Bộ nhớ", price: 890000, stock: 25 },
  { product_name: "Corsair Vengeance 16GB DDR4", category_name: "RAM - Bộ nhớ", price: 990000, stock: 20 },
  { product_name: "G.Skill Ripjaws V 32GB DDR4", category_name: "RAM - Bộ nhớ", price: 1690000, stock: 14 },
  { product_name: "Kingston Fury Beast 16GB DDR5", category_name: "RAM - Bộ nhớ", price: 1390000, stock: 18 },
  { product_name: "Corsair Vengeance 32GB DDR5", category_name: "RAM - Bộ nhớ", price: 2590000, stock: 12 },
  { product_name: "G.Skill Trident Z RGB 32GB", category_name: "RAM - Bộ nhớ", price: 2990000, stock: 10 },

  // 4. VGA - Card màn hình (8 sản phẩm)
  { product_name: "ASUS GTX 1650 4GB", category_name: "VGA - Card màn hình", price: 3290000, stock: 8 },
  { product_name: "MSI RTX 3050 8GB", category_name: "VGA - Card màn hình", price: 4990000, stock: 10 },
  { product_name: "Gigabyte RTX 3060 12GB", category_name: "VGA - Card màn hình", price: 6990000, stock: 7 },
  { product_name: "ASUS Dual RTX 4060 8GB", category_name: "VGA - Card màn hình", price: 8290000, stock: 9 },
  { product_name: "MSI RTX 4060 Ti 8GB", category_name: "VGA - Card màn hình", price: 10990000, stock: 5 },
  { product_name: "Gigabyte RTX 4070 12GB", category_name: "VGA - Card màn hình", price: 15990000, stock: 4 },
  { product_name: "ASUS TUF RTX 4070 Super 12GB", category_name: "VGA - Card màn hình", price: 18490000, stock: 3 },
  { product_name: "Sapphire Pulse RX 6600 8GB", category_name: "VGA - Card màn hình", price: 5490000, stock: 11 },

  // 5. Ổ cứng - Lưu trữ (8 sản phẩm)
  { product_name: "Kingston NV2 500GB NVMe", category_name: "Ổ cứng - Lưu trữ", price: 890000, stock: 25 },
  { product_name: "Kingston NV2 1TB NVMe", category_name: "Ổ cứng - Lưu trữ", price: 1490000, stock: 20 },
  { product_name: "Samsung 980 500GB NVMe", category_name: "Ổ cứng - Lưu trữ", price: 1290000, stock: 15 },
  { product_name: "Samsung 990 PRO 1TB", category_name: "Ổ cứng - Lưu trữ", price: 2990000, stock: 10 },
  { product_name: "WD Black SN850X 1TB NVMe", category_name: "Ổ cứng - Lưu trữ", price: 2490000, stock: 12 },
  { product_name: "Crucial MX500 500GB SATA", category_name: "Ổ cứng - Lưu trữ", price: 1090000, stock: 16 },
  { product_name: "WD Blue 1TB HDD", category_name: "Ổ cứng - Lưu trữ", price: 1190000, stock: 18 },
  { product_name: "Seagate Barracuda 2TB HDD", category_name: "Ổ cứng - Lưu trữ", price: 1690000, stock: 12 },

  // 6. PSU - Nguồn máy tính (4 sản phẩm)
  { product_name: "Cooler Master MWE 550W Bronze V2", category_name: "PSU - Nguồn máy tính", price: 1190000, stock: 20 },
  { product_name: "MSI MAG A650BN 650W 80 Plus Bronze", category_name: "PSU - Nguồn máy tính", price: 1450000, stock: 18 },
  { product_name: "Corsair RM750e 750W 80 Plus Gold", category_name: "PSU - Nguồn máy tính", price: 2690000, stock: 10 },
  { product_name: "ASUS TUF Gaming 850W Gold", category_name: "PSU - Nguồn máy tính", price: 3390000, stock: 7 },

  // 7. Case - Vỏ máy tính (4 sản phẩm)
  { product_name: "Xigmatek NYX 3F Micro-ATX", category_name: "Case - Vỏ máy tính", price: 690000, stock: 22 },
  { product_name: "Montech Air 100 ARGB Black", category_name: "Case - Vỏ máy tính", price: 1250000, stock: 15 },
  { product_name: "NZXT H5 Flow Mid-Tower", category_name: "Case - Vỏ máy tính", price: 2190000, stock: 10 },
  { product_name: "Corsair 4000D Airflow Tempered Glass", category_name: "Case - Vỏ máy tính", price: 2390000, stock: 9 },

  // 8. Tản nhiệt - Cooling (4 sản phẩm)
  { product_name: "ID-COOLING SE-214-XT ARGB", category_name: "Tản nhiệt - Cooling", price: 450000, stock: 25 },
  { product_name: "Thermalright Peerless Assassin 120 SE", category_name: "Tản nhiệt - Cooling", price: 890000, stock: 18 },
  { product_name: "DeepCool LS520 SE 240mm AIO", category_name: "Tản nhiệt - Cooling", price: 2190000, stock: 10 },
  { product_name: "NZXT Kraken 240 RGB AIO", category_name: "Tản nhiệt - Cooling", price: 3490000, stock: 6 }
];

const orderStatuses = [
  "pending", "pending", "shipping", "completed", "cancelled",
  "pending", "shipping", "completed", "return_requested", "returned"
];

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  // 1. Tạo hoặc lấy lại 8 danh mục
  const categoryMap = {};
  for (const cat of categories) {
    let record = await prisma.categories.findFirst({
      where: { category_name: cat.category_name }
    });
    if (!record) {
      record = await prisma.categories.create({ data: cat });
    }
    categoryMap[record.category_name] = record.category_id;
  }

  // 2. Tạo hoặc bổ sung cho đủ 50 sản phẩm (không tạo trùng sản phẩm đã có)
  const createdProducts = [];
  for (const prod of products) {
    let record = await prisma.products.findFirst({
      where: { product_name: prod.product_name }
    });
    if (!record) {
      record = await prisma.products.create({
        data: {
          category_id: categoryMap[prod.category_name],
          product_name: prod.product_name,
          description: `Linh kiện chính hãng ${prod.product_name} thuộc danh mục ${prod.category_name}`,
          price: prod.price,
          stock: prod.stock,
          image: null
        }
      });
    }
    createdProducts.push({ ...record, rawPrice: prod.price });
  }

  console.log(`Đã đồng bộ ${createdProducts.length} sản phẩm vào cơ sở dữ liệu.`);

  // 3. Tạo 1 admin và 10 khách hàng (mật khẩu chung: 123456)
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Quản trị viên",
      email: "admin@gmail.com",
      password: hashedPassword,
      phone: "0900000000",
      role: "admin"
    }
  });

  const customers = [];
  for (let i = 0; i < 10; i++) {
    const email = `customer${i + 1}@gmail.com`;
    const phone = `090000000${i + 1}`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: `Khách hàng ${i + 1}`,
        email,
        password: hashedPassword,
        phone,
        role: "customer"
      }
    });
    customers.push({ user, phone });
  }

  // 4. Tạo 10 đơn hàng mẫu nếu chưa có đơn nào
  const existingOrders = await prisma.orders.count();
  if (existingOrders === 0) {
    for (let i = 0; i < 10; i++) {
      const { user, phone } = customers[i];
      const p1 = createdProducts[i];
      const p2 = createdProducts[i + 10];
      const status = orderStatuses[i];

      const order = await prisma.orders.create({
        data: {
          user_id: user.user_id,
          receiver_name: user.name,
          total_amount: p1.rawPrice + p2.rawPrice,
          shipping_address: `Địa chỉ khách hàng ${i + 1}, TP. Hồ Chí Minh`,
          phone,
          status,
          customer_confirmed: ["completed", "return_requested", "returned"].includes(status),
          confirmed_at: ["completed", "return_requested", "returned"].includes(status) ? new Date() : null,
          return_reason:
            status === "return_requested"
              ? "Sản phẩm không nhận tín hiệu khi lắp vào mainboard, mong muốn hoàn trả."
              : status === "returned"
              ? "Giao nhầm phiên bản dung lượng."
              : null,
          admin_return_note:
            status === "returned" ? "Đã xác nhận thu hồi hàng và hoàn tiền cho khách." : null
        }
      });

      await prisma.order_items.createMany({
        data: [
          { order_id: order.order_id, product_id: p1.product_id, quantity: 1, price: p1.rawPrice, subtotal: p1.rawPrice },
          { order_id: order.order_id, product_id: p2.product_id, quantity: 1, price: p2.rawPrice, subtotal: p2.rawPrice }
        ]
      });
    }
    console.log("Đã tạo 10 đơn hàng mẫu (bao gồm đơn yêu cầu trả hàng & hoàn tiền).");
  }

  console.log("Hoàn tất nạp dữ liệu mẫu!");
}

main()
  .catch((e) => {
    console.error("Lỗi khi nạp dữ liệu:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });