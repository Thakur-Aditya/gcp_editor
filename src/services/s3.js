import AWS from 'aws-sdk';

const s3 = new AWS.S3({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION
});

export const uploadToS3 = async (file, fileName) => {
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        Key: `drone-images/${fileName}`,
        Body: file,
        ContentType: file.type,
        // ACL: 'public-read'
    };

    try {
        const result = await s3.upload(params).promise();
        return {
            success: true,
            url: result.Location,
            key: result.Key
        };
    } catch (error) {
        console.error('S3 upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
