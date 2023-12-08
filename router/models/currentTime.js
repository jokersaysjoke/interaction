function getTaipeiTime() {
    return new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', hour12: false }).replace(',', '');
}

module.exports = { getTaipeiTime };