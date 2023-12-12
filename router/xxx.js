require('dotenv').config()
const fs = require('fs')

const { Upload } = require('@aws-sdk/lib-storage');
const { S3 } = require('@aws-sdk/client-s3');

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

async function uploadFile(streamkey, content) {
    try {
        console.log('run');
        const fileStream = fs.createReadStream(`/tmp/record/${streamkey}.mp4`);
        const uploadParms = {
            Bucket: bucketName,
            Body: fileStream,
            Key: `${content}`
        }

        await new Upload({
            client: s3,
            params: uploadParms
        }).done();
        await fs.promises.unlink(`/tmp/record/${streamkey}.mp4`);
        await fs.promises.unlink(`/tmp/record/${streamkey}.flv`);
        console.log('done');
        return

    } catch (err) { console.error(err); }
}

module.exports = { uploadFile };
