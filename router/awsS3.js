require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3');


const bucketName=process.env.AWS_BUCKET_NAME;
const region=process.env.AWS_BUCKET_REGION;
const accessKeyId=process.env.AWS_ACCESS_KEY;
const secretAccessKey=process.env.AWS_SECRET_KEY;

const s3=new S3({
    region,
    accessKeyId,
    secretAccessKey
});

// uploads to s3
async function uploadFile(streamkey, content){
    const fileStream=fs.createReadStream(`/tmp/record/${streamkey}.mp4`);
    const uploadParms={
        Bucket: bucketName,
        Body: fileStream,
        Key: `${content}.mp4`
    }

    try{
        await s3.upload(uploadParms).promise();
        await fs.promises.unlink(`/tmp/record/${streamkey}`);

    } catch(err){console.error(err);}
};

module.exports=uploadFile;
