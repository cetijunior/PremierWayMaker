const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const { put, get } = require('@vercel/blob');

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
const BLOB_PREFIX = 'cvs/';

function useBlobStorage() {
  return !!process.env.BLOB_READ_WRITE_TOKEN?.trim();
}

function randomId() {
  return Math.round(Math.random() * 1e6).toString(36);
}

async function saveCv(buffer, originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const baseName = `${Date.now()}-${randomId()}${ext}`;

  if (useBlobStorage()) {
    const blob = await put(`${BLOB_PREFIX}${baseName}`, buffer, { access: 'private' });
    return blob.pathname;
  }

  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  const filePath = path.join(UPLOADS_DIR, baseName);
  fs.writeFileSync(filePath, buffer);
  return baseName;
}

async function getCvDownload(storedRef) {
  if (storedRef.startsWith(BLOB_PREFIX)) {
    const result = await get(storedRef, { access: 'private' });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const nodeStream = Readable.fromWeb(result.stream);
    return {
      stream: nodeStream,
      contentType: result.blob?.contentType || 'application/octet-stream',
    };
  }

  const filePath = path.join(UPLOADS_DIR, storedRef);
  if (!fs.existsSync(filePath)) return null;
  return {
    stream: fs.createReadStream(filePath),
    contentType: null,
  };
}

module.exports = { saveCv, getCvDownload, useBlobStorage };
