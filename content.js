let currentDropdown = null;
let currentInput = null;
const commands = [
    "dealer name",
    "dealer email",
    "general contractor name",
    "general contractor email",
    "owner developer name",
    "owner developer email",
    "builder name",
    "builder email",
    "location name",
    "location email",
    "model name",
    "model email",
];

// --- Hàm tạo và hiển thị dropdown ---
function showDropdown(inputElement) {
    // Xóa dropdown cũ nếu có
    removeDropdown();

    currentInput = inputElement; // Lưu lại input đang tương tác

    const rect = inputElement.getBoundingClientRect();
    const dropdown = document.createElement('div');
    dropdown.className = 'slash-command-dropdown'; // Thêm class để CSS có thể áp dụng
    // Tính toán vị trí (bên dưới input)
    dropdown.style.position = 'absolute';
    dropdown.style.top = `${window.scrollY + rect.bottom + 2}px`; // +2 để có khoảng cách nhỏ
    dropdown.style.left = `${window.scrollX + rect.left}px`;
    dropdown.style.zIndex = '10000'; // Đảm bảo nó hiển thị trên các element khác

    commands.forEach(command => {
        const item = document.createElement('div');
        item.textContent = command;
        item.className = 'slash-command-item'; // Thêm class để CSS có thể áp dụng
        item.addEventListener('click', () => {
            // Gửi yêu cầu đến background script để lấy data
            chrome.runtime.sendMessage({action: "getFormattedData", command: command}, (response) => {
                if (response && response.data) {
                    // Điền data vào input và di chuyển con trỏ đến cuối
                    inputElement.value = response.data;
                    inputElement.focus();
                    // Kích hoạt sự kiện input để các framework JS (React, Vue,...) có thể nhận biết thay đổi
                    inputElement.dispatchEvent(new Event('input', {bubbles: true}));
                    inputElement.dispatchEvent(new Event('change', {bubbles: true}));
                } else if (response && response.error) {
                    console.error("Error getting data from background:", response.error);
                } else {
                    console.error("Invalid response from background script");
                }
                removeDropdown(); // Xóa dropdown sau khi chọn
            });
        });
        dropdown.appendChild(item);
    });

    document.body.appendChild(dropdown);
    currentDropdown = dropdown;

    // Thêm listener để đóng dropdown khi click ra ngoài
    document.addEventListener('click', handleClickOutside, true);
    // Thêm listener để đóng dropdown khi input mất focus
    inputElement.addEventListener('blur', handleInputBlur);
}

// --- Hàm xóa dropdown ---
function removeDropdown() {
    if (currentDropdown) {
        currentDropdown.remove();
        currentDropdown = null;
    }
    // Gỡ bỏ các listener không cần thiết nữa
    document.removeEventListener('click', handleClickOutside, true);
    if (currentInput) {
        currentInput.removeEventListener('blur', handleInputBlur);
        currentInput = null;
    }
}

// --- Hàm xử lý khi click ra ngoài dropdown ---
function handleClickOutside(event) {
    if (currentDropdown && !currentDropdown.contains(event.target) && event.target !== currentInput) {
        removeDropdown();
    }
}

// --- Hàm xử lý khi input mất focus ---
function handleInputBlur() {
    // Dùng setTimeout nhỏ để cho phép click vào item trong dropdown xảy ra trước khi blur đóng nó lại
    setTimeout(() => {
        // Kiểm tra xem dropdown có còn tồn tại không (tránh trường hợp đã bị đóng do click item)
        if (currentDropdown && !currentDropdown.contains(document.activeElement)) {
            removeDropdown();
        }
    }, 100);
}


// --- Lắng nghe sự kiện input trên toàn bộ trang ---
document.addEventListener('input', (event) => {
    const target = event.target;

    // Chỉ xử lý trên <input type="text">, <input type="email">, <textarea>, ... (các loại input có thể gõ text)
    if ((target.tagName === 'INPUT' && (target.type === 'text' || target.type === 'email' || target.type === 'search' || target.type === 'url' || target.type === 'tel' || !target.type)) || target.tagName === 'TEXTAREA') {

        // Chỉ hiển thị dropdown khi giá trị *chỉ* là "/"
        if (target.value.trim() === '/') {
            showDropdown(target);
        } else {
            // Nếu người dùng gõ thêm gì đó hoặc xóa "/", ẩn dropdown
            if (currentDropdown && target === currentInput) {
                removeDropdown();
            }
        }
    }
});

// Xóa dropdown nếu người dùng nhấn Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && currentDropdown) {
        removeDropdown();
        // Tùy chọn: có thể xóa luôn dấu '/' trong input
        // if (currentInput && currentInput.value === '/') {
        //     currentInput.value = '';
        //     currentInput.dispatchEvent(new Event('input', { bubbles: true }));
        // }
    }
});