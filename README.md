# WhatsApp Web API

Simple WhatsApp Web API using whatsapp-web.js

## Installation

```bash
npm install
npm start
```

Server akan berjalan di `http://localhost:3001`

## API Documentation

### 1. Send Message
Mengirim pesan WhatsApp ke nomor tujuan.

**Endpoint:** `POST /api/send-message`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "number": "6281234567890",
    "message": "Hello World!"
}
```

**Parameters:**
- `number` (string, required): Nomor WhatsApp tujuan (format: kode negara + nomor, tanpa tanda '+' atau '0' di depan)
- `message` (string, required): Pesan yang akan dikirim

**Success Response:**
```json
{
    "success": true,
    "messageId": "XXXXXXXXXXXXX"
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Error message"
}
```

### 2. Get QR Code
Mendapatkan QR Code untuk login WhatsApp Web.

**Endpoint:** `GET /qr`

**Success Response:**
```json
{
    "qr": "data:image/png;base64,..." // Base64 QR Code image
}
```
atau
```json
{
    "qr": null,
    "message": "Client sudah terkoneksi"
}
```

### 3. Reset Client
Reset WhatsApp Web client dan generate QR Code baru.

**Endpoint:** `POST /reset`

**Success Response:**
```json
{
    "success": true,
    "message": "Reset berhasil, QR code baru tersedia"
}
```

**Error Response:**
```json
{
    "success": false,
    "message": "Error message"
}
```

## Postman Collection

### Import Collection
1. Buka Postman
2. Klik "Import"
3. Copy paste JSON berikut:

```json
{
    "info": {
        "name": "WhatsApp Web API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Send Message",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "url": {
                    "raw": "http://localhost:3001/api/send-message",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "3001",
                    "path": ["api", "send-message"]
                },
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"number\": \"6281234567890\",\n    \"message\": \"Hello World!\"\n}"
                }
            }
        },
        {
            "name": "Get QR Code",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "http://localhost:3001/qr",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "3001",
                    "path": ["qr"]
                }
            }
        },
        {
            "name": "Reset Client",
            "request": {
                "method": "POST",
                "url": {
                    "raw": "http://localhost:3001/reset",
                    "protocol": "http",
                    "host": ["localhost"],
                    "port": "3001",
                    "path": ["reset"]
                }
            }
        }
    ]
}
```

### Penggunaan di Postman
1. **Send Message:**
   - Pilih request "Send Message"
   - Edit body JSON dengan nomor dan pesan yang diinginkan
   - Klik Send

2. **Get QR Code:**
   - Pilih request "Get QR Code"
   - Klik Send
   - QR Code akan muncul dalam response

3. **Reset Client:**
   - Pilih request "Reset Client"
   - Klik Send
   - Client akan direset dan QR Code baru akan digenerate

## Notes
- Pastikan WhatsApp Web sudah terkoneksi sebelum mengirim pesan
- Nomor tujuan harus dalam format internasional (contoh: 628xxx bukan 08xxx)
- Jika terjadi error, coba reset client dan scan ulang QR Code
