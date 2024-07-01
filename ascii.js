let selectedFile;

document.getElementById('upload').addEventListener('change', handleFileSelect, false);
document.getElementById('convert').addEventListener('click', handleImage, false);

function handleFileSelect(e) {
    selectedFile = e.target.files[0];
}

function handleImage() {
    if (!selectedFile) {
        alert('Please select an image file first.');
        return;
    }

    const size = document.getElementById('size').value;
    const canvasSize = getCanvasSize(size);

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = canvasSize;
            canvas.height = canvasSize;
            ctx.drawImage(img, 0, 0, canvasSize, canvasSize);
            const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
            const ascii = convertToASCII(imageData, canvasSize, canvasSize);
            document.getElementById('ascii-art').textContent = ascii;
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
}

function getCanvasSize(size) {
    let canvasSize;
    if (size === 'small') {
        canvasSize = 200; 
    } else if (size === 'medium') {
        canvasSize = 400; 
    } else if (size === 'large') {
        canvasSize = 600; 
    } else {
        canvasSize = 400; 
    }
    return canvasSize;
}

function convertToASCII(imageData, width, height) {
    const characters = '@%#*+=-:. /\|^';
    let ascii = '';

    for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4;
            const red = imageData.data[offset];
            const green = imageData.data[offset + 1];
            const blue = imageData.data[offset + 2];
            const brightness = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;

            const charIndex = Math.floor(brightness * characters.length);
            ascii += characters.charAt(charIndex);
        }
        ascii += '\n';
    }

    return ascii;
}