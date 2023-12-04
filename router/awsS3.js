require('dotenv').config()
const fs = require('fs')

const { Upload } = require('@aws-sdk/lib-storage');
const { S3 } = require('@aws-sdk/client-s3');
const Convert = require('./convert');

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

// uploads to s3
async function uploadFile(streamkey, content) {
    try {
        const convertTo = new Convert(streamkey);
        await convertTo.mp4();

        const fileStream = fs.createReadStream(`/tmp/record/${streamkey}.mp4`);
        console.log('file stream:', fileStream);
        const uploadParms = {
            Bucket: bucketName,
            Body: fileStream,
            Key: `${content}`,
            ContentType: 'mp4'
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

function cleanImg(file) {
    const fileStream = fs.createReadStream(file.path);

    const uploadParms = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return s3.deleteObject(uploadParms);

}

module.exports = { uploadFile, uploadImg, cleanImg };
