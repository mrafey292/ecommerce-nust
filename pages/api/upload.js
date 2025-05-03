// filepath: c:\code\sem4\proj\ecommerce-nust-admin\pages\api\upload.js
import multiparty from 'multiparty';
import dbConnect from "@/lib/mongoose";
import cloudinary from '@/lib/cloudinary'; // Import the configured Cloudinary instance

export default async function handle(req, res) {
    await dbConnect();

    const form = new multiparty.Form();
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });

    console.log('Number of files:', files.file.length);

    const links = [];

    for (const file of files.file) {
        const filePath = file.path;

        try {
            const uploadResult = await cloudinary.uploader.upload(filePath, {
                folder: 'products',
                resource_type: 'auto',
                public_id: Date.now().toString(),
            });

            const link = uploadResult.secure_url;
            links.push(link);
        } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            return res.status(500).json({ error: "Failed to upload image" });
        }
    }

    return res.json({ links });
}

export const config = {
    api: {
        bodyParser: false,
    },
};