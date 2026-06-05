
const path = require('path');

const mammoth = require('mammoth');
const pdfParseLib = require('pdf-parse');
const pdfParse = pdfParseLib.default || pdfParseLib;

function _extFrom({ mime, filename }) {
    if (filename) return path.extname(filename).toLowerCase();
    if (mime) {
        if (mime === 'application/pdf') return '.pdf';
        if (mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return '.docx';
    }
    return '';
}

async function extractText(input, opts = {}) {
    const ext = _extFrom(opts);
    if (!ext) throw new TypeError('Provide filename or mime in opts to determine file type.');

    if (ext === '.pdf') {
        const data = input;
        const result = await pdfParse(data);
        return result && result.text ? result.text : '';
    }

    if (ext === '.docx') {
        const { value } = mammoth.extractRawText({ buffer: input });
        return value || '';
    }

    throw new TypeError('Unsupported file type: ' + ext);
}

module.exports = { extractText };