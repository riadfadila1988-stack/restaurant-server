// server/receiptGenerator.ts
import puppeteer from "puppeteer";

// 🔹 Helper to convert ArrayBuffer / Uint8Array → base64
function arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    let binary = '';
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return Buffer.from(binary, "binary").toString("base64"); // safe base64
}

// 🔹 Generate receipt PNG as base64
export async function generateReceiptImage(): Promise<string> {
    // Static order
    const order = {
        id: "123",
        items: [
            { name: "שווארמה", qty: 2, price: "20₪" }, // Hebrew
            { name: "كولا", qty: 1, price: "8₪" },     // Arabic
            { name: "Cola", qty: 1, price: "$8" },      // English
        ],
        total: "28₪",
    };

    // HTML receipt
    const html = `
    <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; font-size: 22px; width: 384px; margin: 0; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          td, th { padding: 4px; text-align: right; }
          th { border-bottom: 1px solid #000; }
          h2, p { margin: 5px 0; text-align: center; }
        </style>
      </head>
      <body>
        <h2>فاتورة / חשבונית / Invoice</h2>
        <p>Order ID: ${order.id}</p>
        <table>
          <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
          ${order.items
        .map((i) => `<tr><td>${i.name}</td><td>${i.qty}</td><td>${i.price}</td></tr>`)
        .join("")}
        </table>
        <p>Total: ${order.total}</p>
        <p>Thank you / תודה / شكراً</p>
      </body>
    </html>
  `;

    // Launch Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    // Take screenshot as ArrayBuffer
    const screenshotBuffer = await page.screenshot({ type: "png" }) as ArrayBuffer;

    await browser.close();

    // Convert to base64 safely
    return arrayBufferToBase64(screenshotBuffer);
}

// // Example usage:
// (async () => {
//     const base64Image = await generateReceiptImage();
//     console.log(base64Image.slice(0, 100) + "..."); // preview first 100 chars
// })();
