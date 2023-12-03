const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegStatic);

class Convert {
    constructor(streamkey) {
        this.streamkey = streamkey
    }
    async mp4() {
        const inputFilePath = `/tmp/record/${this.streamkey}.flv`;
        const outputFilePath = `/tmp/record/${this.streamkey}.mp4`;
        ffmpeg()
            .input(inputFilePath)
            .output(outputFilePath)
            .on('end', () => {
                console.log('轉換完成');
            })
            .on('error', (err) => {
                console.error('轉換錯誤:', err);
            })
            .run();
    }
}
module.exports = Convert