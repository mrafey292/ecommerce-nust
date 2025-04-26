import multiparty from 'multiparty';
import { mongooseConnect } from "@/lib/mongoose";
import cloudinary from 'cloudinary';

export default async function handle(req, res) {
  await mongooseConnect();

  // Remove the isAdminRequest check if not needed
  // await isAdminRequest(req, res);  // Comment out or remove this line

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

    const uploadResult = await cloudinary.v2.uploader.upload(filePath, {
      folder: 'products',
      resource_type: 'auto',
      public_id: Date.now().toString(),
    });

    const link = uploadResult.secure_url;
    links.push(link);
  }

  return res.json({ links });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
