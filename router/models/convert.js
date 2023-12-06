const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegStatic);

class Convert {
    constructor(streamkey) {
        this.streamkey = streamkey
    }
    mp4() {
        return new Promise((resolve, reject) => {
            const inputFilePath = `/tmp/record/${this.streamkey}.flv`;
            const outputFilePath = `/tmp/record/${this.streamkey}.mp4`;

            ffmpeg()
                .input(inputFilePath)
                .output(outputFilePath)
                .on('end', () => {
                    console.log('轉換完成');
                    resolve(outputFilePath);
                })
                .on('error', (err) => {
                    console.error('轉換錯誤:', err);
                    reject(err);
                })
                .run();
        });
    }
}
module.exports = Convert