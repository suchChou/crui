const path = require('path');
const fs = require('fs');
const execa = require('execa');

module.exports = function createCustomTemplate({ url, folderName, fileName, variable }) {
    return new Promise(function (resolve, reject) {
        let targetPath = path.join(process.cwd(), url ? url : '');
        // 创建文件夹
        if (folderName) {
            targetPath = path.join(targetPath, folderName);
            if (fs.existsSync(targetPath)) {
                reject('该文件夹已存在');
            }
            execa.commandSync(`mkdir ${targetPath}`);
        }
        const modelPath = path.join(process.cwd(), 'crui', 'template');
        // 复制文件到目标文件夹
        fs.readdir(modelPath, (err, files) => {
            files.forEach(file => {
                const readable = fs.createReadStream(path.join(modelPath, file));
                const writable = fs.createWriteStream(path.join(targetPath, file));
                readable.pipe(writable);
            });
        });
    });
};