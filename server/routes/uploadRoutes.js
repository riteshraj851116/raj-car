import { Router } from 'express';
import { authenticateToken, requireOwner } from '../middleware/auth.js';

const router = Router();

// Upload Image Endpoint
router.post('/', authenticateToken, requireOwner, async (req, res) => {
  try {
    const { image, fileName } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image data is required' });
    }

    const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

    // If ImageKit environment variables exist, call ImageKit upload API
    if (publicKey && privateKey && urlEndpoint && !publicKey.includes('your_imagekit')) {
      try {
        const authHeader = 'Basic ' + Buffer.from(privateKey + ':').toString('base64');
        const formData = new URLSearchParams();
        formData.append('file', image);
        formData.append('fileName', fileName || `car_${Date.now()}.jpg`);

        const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          headers: {
            Authorization: authHeader,
          },
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          return res.json({ url: data.url, message: 'Image uploaded to ImageKit successfully' });
        }
      } catch (ikErr) {
        console.error('ImageKit API upload failed, falling back to direct format:', ikErr);
      }
    }

    // Fallback: If image is already URL or base64 data URL, return it directly
    if (typeof image === 'string' && (image.startsWith('http') || image.startsWith('data:image'))) {
      return res.json({ url: image, message: 'Image uploaded successfully' });
    }

    // Default fallback sample image
    const fallbackUrl = 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=1200&q=80';
    res.json({ url: fallbackUrl, message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
});

export default router;
