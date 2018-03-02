const fs = require('fs');
const path = require('path');
const versionPath = path.resolve(__dirname,'./version.json');
function getVersionConfig() {
    var json = fs.readFileSync(versionPath);
    var versionConfig = JSON.parse(json);
    return versionConfig;
}
exports.update = function () {
    var versionConfig = getVersionConfig();
    versionConfig.version++;
    fs.writeFileSync(versionPath,JSON.stringify(versionConfig,null,4));
};
exports.getVersionConfig = function () {
    var versionConfig = getVersionConfig();
    return versionConfig;
};