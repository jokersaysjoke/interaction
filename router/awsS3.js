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

const bucketNameVideo = process.env.AWS_BUCKET_NAME_VIDEO;
const regionVideo = process.env.AWS_BUCKET_REGION_VIDEO;
const accessKeyIdVideo = process.env.AWS_ACCESS_KEY_VIDEO;
const secretAccessKeyVideo = process.env.AWS_SECRET_KEY_VIDEO;

const s3Video = new S3({
    regionVideo,
    credentials: {
        accessKeyIdVideo,
        secretAccessKeyVideo
    }
});

// uploads to s3
async function uploadFile(streamkey, content) {
    try {
        const fileStream = fs.createReadStream(`/tmp/record/${streamkey}.mp4`);
        
        const uploadParms = {
            Bucket: bucketNameVideo,
            Body: fileStream,
            Key: `${content}`
            
        }

        await new Upload({
            client: s3Video,
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
