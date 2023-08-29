export function toBase64(filePath) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(filePath);
  });
}

export function removeFileExtension(fileName) {
  return fileName.substring(0, fileName.lastIndexOf('.'));
}