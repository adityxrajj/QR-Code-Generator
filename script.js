document.addEventListener('DOMContentLoaded', () => {
    const textField = document.getElementById('password');
    const qrCodeContainer = document.getElementById('qrcode');
    const qrCodeFrame = document.getElementById('qrcode-frame');
    const qrCodeOverlay = document.getElementById('qrcode-overlay');
    const downloadBtn = document.getElementById('download-btn');
    const copyBtn = document.getElementById('copy-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const notificationContainer = document.getElementById('notification-container');

    let qrCode = null;

    function showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notificationContainer.appendChild(notification);

        // Trigger reflow
        notification.offsetHeight;

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, duration);
    }

    function generateQRCode(text) {
        if (qrCode) {
            qrCode.clear();
            qrCode.makeCode(text);
        } else {
            qrCode = new QRCode(qrCodeContainer, {
                text: text,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }
        qrCodeFrame.style.display = 'flex';
        qrCodeOverlay.style.display = 'none';
        downloadBtn.style.display = 'inline-flex';
    }

    function downloadQRCode() {
        const qrCodeImage = qrCodeContainer.querySelector('img');
        if (qrCodeImage) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const frameSize = 240;
            const qrSize = 220;

            canvas.width = frameSize;
            canvas.height = frameSize;

            // Draw frame
            ctx.fillStyle = '#34495e';
            ctx.fillRect(0, 0, frameSize, frameSize);

            // Draw QR code
            ctx.fillStyle = '#ffffff';
            ctx.fillRect((frameSize - qrSize) / 2, (frameSize - qrSize) / 2, qrSize, qrSize);
            ctx.drawImage(qrCodeImage, (frameSize - qrSize) / 2 + 10, (frameSize - qrSize) / 2 + 10, qrSize - 20, qrSize - 20);

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'qrcode.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showNotification('QR code downloaded successfully!');
        } else {
            showNotification('No QR code generated yet.');
        }
    }

    textField.addEventListener('input', () => {
        const text = textField.value.trim();
        if (text) {
            generateQRCode(text);
        } else {
            if (qrCode) {
                qrCode.clear();
            }
            qrCodeFrame.style.display = 'none';
            qrCodeOverlay.style.display = 'flex';
            downloadBtn.style.display = 'none';
        }
    });

    copyBtn.addEventListener('click', () => {
        const text = textField.value.trim();
        if (text) {
            navigator.clipboard.writeText(text)
                .then(() => showNotification('Text copied to clipboard!'))
                .catch(err => showNotification('Failed to copy text. Please try again.'));
        } else {
            showNotification('No text to copy.');
        }
    });

    downloadBtn.addEventListener('click', downloadQRCode);

    refreshBtn.addEventListener('click', () => {
        textField.value = '';
        if (qrCode) {
            qrCode.clear();
        }
        qrCodeFrame.style.display = 'none';
        qrCodeOverlay.style.display = 'flex';
        downloadBtn.style.display = 'none';
        textField.focus();
        showNotification('QR code cleared. Ready for new input.');
    });
});