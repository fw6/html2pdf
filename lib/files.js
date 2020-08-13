// 文件管理
const fs = require('fs');
const path = require('path');

module.exports = {
    /** 获取当前命令执行位置 */
    getCurrentDirectoryBase: () => {
        return path.resolve(process.cwd());
    },

    /**
     * 检查路径是否存在
     * @param {string} filePath
     */
    directoryExists: (filePath) => {
        try {
            const curFile = fs.statSync(filePath)

            return curFile.isDirectory() || curFile.isFile()
        } catch (err) {
            return false;
        }
    },

    getAbsolutePath (filePath, curCwd) {
        if (!filePath) return
        return path.isAbsolute(filePath)
            ? filePath
            : path.join(curCwd, filePath)
    }
};
