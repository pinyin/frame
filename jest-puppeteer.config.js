module.exports = {
    server: {
        command:
            './node_modules/.bin/parcel tests/index.html --no-cache --port 56788',
        port: 56788,
        launchTimeout: 10000,
        usedPortAction: 'kill',
    },
    launch: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
}
