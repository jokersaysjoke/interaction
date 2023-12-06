function getFormattedTime() {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth() + 1; // 月份從 0 開始，所以要加 1
    const day = currentTime.getDate();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    return `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;
}

module.exports = { getFormattedTime };