// Lấy ngày hiện tại theo format ddMMyyyy
function getFormattedDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = today.getFullYear().toString().slice(-2);
    return `${day}${month}${year}`;
}

// Khởi tạo hoặc kiểm tra và reset bộ đếm hàng ngày
// async function initializeOrResetCounter() {
//     const todayStr = getFormattedDate();
//     const data = await chrome.storage.local.get(['lastResetDate', 'dailyCounts']);
//     let counts = data.dailyCounts || {builder: 0, dealer: 0};
//
//     if (data.lastResetDate !== todayStr) {
//         console.log('Resetting daily counts for new day:', todayStr);
//         counts = {builder: 0, dealer: 0};
//         await chrome.storage.local.set({lastResetDate: todayStr, dailyCounts: counts});
//     }
//     return counts;
// }

// Lắng nghe yêu cầu từ content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getFormattedData") {
        // Sử dụng async IIFE (Immediately Invoked Function Expression) để dùng await
        (async () => {
            try {
                // let counts = await initializeOrResetCounter();
                const todayStr = getFormattedDate();
                let generatedData = "";
                let nextCount;

                switch (request.command) {
                    case "dealer name":
                        // nextCount = counts.dealer + 1;
                        generatedData = `Dealer ${todayStr}`;
                        // counts.dealer = nextCount;
                        break;
                    case "dealer email":
                        // nextCount = counts.dealer + 1;
                        generatedData = `dealer.${todayStr}@example.com`;
                        // counts.dealer = nextCount;
                        break;
                    case "general contractor name":
                        generatedData = `General Contractor ${todayStr}`;
                        break;
                    case "general contractor email":
                        generatedData = `gc.${todayStr}@example.com`;
                        break;
                    case "owner developer name":
                        generatedData = `Owner Developer ${todayStr}`;
                        break;
                    case "owner developer email":
                        generatedData = `od.${todayStr}@example.com`;
                        break;
                    case "builder name":
                        // nextCount = counts.builder + 1;
                        generatedData = `Builder ${todayStr}`;
                        // counts.builder = nextCount;
                        break;
                    case "builder email":
                        // nextCount = counts.builder + 1;
                        generatedData = `builder.${todayStr}@example.com`;
                        // counts.builder = nextCount;
                        break;
                    case "location name":
                        generatedData = `Location ${todayStr}`;
                        break;
                    case "location email":
                        generatedData = `location.${todayStr}@example.com`;
                        break;
                    case "model name":
                        generatedData = `Model ${todayStr}`;
                        break;
                    case "model email":
                        generatedData = `model.${todayStr}@example.com`;
                        break;
                    default:
                        throw new Error("Invalid command");
                }

                // Lưu lại bộ đếm đã cập nhật
                // await chrome.storage.local.set({dailyCounts: counts});
                // console.log("Generated:", generatedData, "Updated counts:", counts);
                sendResponse({data: generatedData});

            } catch (error) {
                console.error("Error processing command:", error);
                sendResponse({error: error.message});
            }
        })();

        return true; // Quan trọng: báo rằng sendResponse sẽ được gọi bất đồng bộ
    }
});

// Khởi tạo bộ đếm khi extension được cài đặt hoặc cập nhật
// chrome.runtime.onInstalled.addListener(() => {
//     console.log("Extension installed/updated. Initializing counter.");
//     initializeOrResetCounter();
// });

// Khởi tạo bộ đếm khi trình duyệt khởi động
// chrome.runtime.onStartup.addListener(() => {
//     console.log("Browser started. Initializing counter.");
//     initializeOrResetCounter();
// });