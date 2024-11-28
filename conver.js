const fs = require('fs');

// Các nhóm ký tự cần loại bỏ
const excludedKeywords = [
    "UNKNOWN",
    "V70",
    "wordpress.com",
    "needrom.com",
    "127.0.0.1",
    "localhost",
    "000webhostapp"
];

// Đọc nội dung từ tệp TXT
fs.readFile('urls.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Tạo Set để lưu trữ tên miền duy nhất
    const uniqueDomains = new Set();

    // Tách các dòng và loại bỏ dấu phẩy và khoảng trắng
    data.split('\n') // Tách theo dòng
        .map(line => line.trim().replace(/["',]/g, '')) // Loại bỏ dấu " và ,
        .forEach(line => {
            // Kiểm tra xem dòng có phải là một URL hợp lệ không
            try {
                const url = new URL(line);
                // Kiểm tra các từ khóa bị loại
                if (!excludedKeywords.some(keyword => url.hostname.includes(keyword))) {
                    // Thêm hostname vào Set để loại bỏ trùng lặp
                    uniqueDomains.add(url.hostname);
                }
            } catch (error) {
              return false
            }
        });

    // Chuyển đổi Set thành mảng và tạo đối tượng JSON
    const jsonData = { urls: Array.from(uniqueDomains) };

    // Ghi dữ liệu vào tệp JSON
    fs.writeFile('urls.json', JSON.stringify(jsonData, null, 4), err => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('Đã chuyển đổi thành công sang định dạng JSON và lưu vào urls.json.');
    });
});