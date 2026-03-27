// 图片压缩处理

const MAX_WIDTH = 400;
const MAX_HEIGHT = 400;
const QUALITY = 0.8;

interface ImageUploadResult {
  success: boolean;
  data?: string;
  error?: string;
}

// 压缩图片
export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 计算缩放比例
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建 canvas 上下文'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为 base64
        const dataUrl = canvas.toDataURL('image/jpeg', QUALITY);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

// 处理图片上传
export async function handleImageUpload(file: File): Promise<ImageUploadResult> {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return { success: false, error: '请上传图片文件' };
  }
  
  // 检查文件大小 (最大 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return { success: false, error: '图片大小不能超过 5MB' };
  }
  
  try {
    const compressed = await compressImage(file);
    return { success: true, data: compressed };
  } catch (error) {
    return { success: false, error: '图片处理失败' };
  }
}
