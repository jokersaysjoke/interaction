require('dotenv').config()
const fs = require('fs')
const Convert = require('./convert');
const { Upload } = require('@aws-sdk/lib-storage');
const { S3 } = require('@aws-sdk/client-s3');

// uploads to s3
async function uploadFile(streamkey, recordingId) {
    try {
        const bucketName = process.env.AWS_BUCKET_NAME_VIDEO;
        const region = process.env.AWS_BUCKET_REGION_VIDEO;
        const accessKeyId = process.env.AWS_ACCESS_KEY_VIDEO;
        const secretAccessKey = process.env.AWS_SECRET_KEY_VIDEO;

        const s3 = new S3({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey
            }
        });

        const convertTo = new Convert(streamkey);
        await convertTo.mp4();

        const fileStream = fs.createReadStream(`/tmp/record/${streamkey}.mp4`);
        const uploadParms = {
            Bucket: bucketName,
            Body: fileStream,
            Key: recordingId

        }

        await new Upload({
            client: s3,
            params: uploadParms
        }).done();
        await fs.promises.unlink(`/tmp/record/${streamkey}.mp4`);
        await fs.promises.unlink(`/tmp/record/${streamkey}.flv`);
        return

    } catch (err) { console.error(err); }
}

function uploadImg(file) {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const region = process.env.AWS_BUCKET_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY;
    const secretAccessKey = process.env.AWS_SECRET_KEY;

    const s3 = new S3({
        region,
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });

    const fileStream = fs.createReadStream(file.path);

    const uploadParms = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return new Upload({
        client: s3,
        params: uploadParms
    }).done();

}

module.exports = { uploadFile, uploadImg };
