export const showtime = (baseDateString) => {
    const baseDate = new Date(baseDateString);
    const today = new Date();
    const utc1 = Date.UTC(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    const utc2 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
    const date = baseDate.getDate();
    const hours = baseDate.getHours();
    const minutes = baseDate.getMinutes();
    let dateOut = '';
    if (diffDays === 0) {
        dateOut = `Today ${hours}:${minutes}`;
    } else if (diffDays === 1) {
        dateOut = `Yesterday ${hours}:${minutes}`;
    } else if (diffDays > 1 && diffDays < 7) {
        dateOut = (baseDate.toLocaleString('en-us', { weekday: 'long' }));
        dateOut = `${dateOut} ${hours}:${minutes}`;
    } else {
        const monthOut = (baseDate.toLocaleString('en-us', { month: 'short' }));
        dateOut = `${monthOut} ${date}`;
    }
    return dateOut;
};

// A few JavaScript Functions for Images and Files
// Author: Justin Mitchel
// Source: https://kirr.co/ndywes
// https://github.com/codingforentrepreneurs/Try-Reactjs/blob/master/src/learn/ResuableUtils.js

// Convert a Base64-encoded string to a File object
export function base64StringtoFile(base64String, filename) {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

// Download a Base64-encoded file

export function downloadBase64File(base64Data, filename) {
    const element = document.createElement('a');
    element.setAttribute('href', base64Data);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Extract an Base64 Image's File Extension
export function extractImageFileExtensionFromBase64(base64Data) {
    return base64Data.substring('data:image/'.length, base64Data.indexOf(';base64'));
}

// Base64 Image to Canvas with a Crop
// original function was adapted to draw a resized image to canvas
// in this case with an aspect ratio of 1:1, and width = maxWidth
export function image64toCanvasRef(canvasRef, image64, pixelCrop, maxWidth) {
    const canvas = canvasRef; // document.createElement('canvas');
    // canvas.width = pixelCrop.width
    // canvas.height = pixelCrop.height
    canvas.width = maxWidth;
    canvas.height = maxWidth;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = image64;
    image.onload = () => {
        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            // pixelCrop.width
            // pixelCrop.height
            maxWidth,
            maxWidth,
        );
    };
    return image;
}

export function rangeGenerator(start, stop, step = 1) {
    return Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step);
}

export function stringToUrlSlug(string) {
    const a = 'àáäâãåăæçèéëêǵḧìíïîḿńǹñòóöôœṕŕßśșțùúüûǘẃẍÿź·/_,:;';
    const b = 'aaaaaaaaceeeeghiiiimnnnoooooprssstuuuuuwxyz------';
    const p = new RegExp(a.split('').join('|'), 'g');

    return string.toString().toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
        .replace(/&/g, '-and-') // Replace & with ‘and’
        .replace(/[^\w-]+/g, '') // Remove all non-word characters
        .replace(/-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

// https://hackernoon.com/copying-text-to-clipboard-with-javascript-df4d4988697f
export function copyToClipboard(str) {
    const el = document.createElement('textarea'); // Create a <textarea> element
    el.value = str; // Set its value to the string that you want copied
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0 // Check if there is any content selected previously
            ? document.getSelection().getRangeAt(0) // Store selection if found
            : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) { // If a selection existed before copying
        document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
    }
}

export function Now() {
    let now = new Date();
    now = parseInt(now.getTime() / 1000, 10);
    return now;
}

export function DateDDMMYY(dateString) {
    // eslint-disable-next-line no-extend-native
    String.prototype.replaceAll = (search, replacement) => {
        const target = this;
        return target.split(search).join(replacement);
    };

    let date = dateString.replaceAll('-', ',');
    date = date.replaceAll(':', ',');
    date = date.replace('.000000', '');
    date = date.replace(' ', ',');

    date = date.split(',');
    const year = parseInt(date[0], 10);
    const month = parseInt(date[1], 10) - 1;
    const day = parseInt(date[2], 10);
    const hours = parseInt(date[3], 10);
    const minutes = parseInt(date[4], 10);
    const seconds = parseInt(date[5], 10);
    date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

    return new Intl.DateTimeFormat('fr-FR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
}
