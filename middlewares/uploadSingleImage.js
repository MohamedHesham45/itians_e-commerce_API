const imagekit = require('../utils/ImageKit');
const sharp = require('sharp');
const CustomError = require('../utils/customError');

const singleImageUpload = async (req, res, next) => {
    if (!req.files || !req.files['image'] || req.files['image'].length === 0) {
        return next();
    }

    try {
        const imageBuffer = req.files['image'][0].buffer;
        const optimizedImageBuffer = await sharp(imageBuffer)
            .jpeg({ quality: 70 })
            .toBuffer();

        const uploadResponse = await imagekit.upload({
            file: optimizedImageBuffer,
            fileName: `user-${req.user.id}-${Date.now()}.jpeg`,   
            folder: 'e-commerce',   
        });

        req.body.image = uploadResponse.url;

        next();
    } catch (err) {
        return next(new CustomError('Image upload failed', 500));
    }
};

module.exports = singleImageUpload;
