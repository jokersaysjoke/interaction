function getTaipeiTime() {
    return new Date().toLocaleString(undefined, { timeZone: 'Asia/Taipei', hour12: false }).replace(',', '');
}

module.exports = { getTaipeiTime };