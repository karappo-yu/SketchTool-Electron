// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // 设置窗口置顶状态
    setAlwaysOnTop: (alwaysOnTop) => ipcRenderer.send('set-always-on-top', alwaysOnTop),
    // 监听窗口置顶状态变化
    onAlwaysOnTopStatus: (callback) => ipcRenderer.on('always-on-top-status', (event, status) => callback(status)),
    // 在 Finder (macOS) 或文件资源管理器 (Windows) 中打开并选中文件
    openFileInFinder: (filePath) => ipcRenderer.invoke('open-file-in-finder', filePath),
    // 在系统默认应用程序中打开文件
    openFileInDefaultApp: (filePath) => ipcRenderer.invoke('open-file-in-default-app', filePath),
    // 打开文件选择对话框
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    // 打开文件夹选择对话框
    openFolderDialog: (currentPath) => ipcRenderer.invoke('open-folder-dialog', currentPath),
    // 读取文件夹内的图片文件和子文件夹
    readFolderImages: (folderPath) => ipcRenderer.invoke('read-folder-images', folderPath),
    // 保存设置
    saveSetting: (key, value) => ipcRenderer.invoke('save-setting', key, value),
    // 加载设置
    loadSetting: (key) => ipcRenderer.invoke('load-setting', key),
    // 保存图片标记
    saveImageMark: (filePath, duration) => ipcRenderer.invoke('save-image-mark', filePath, duration),
    // 获取所有图片标记
    getImageMarks: () => ipcRenderer.invoke('get-image-marks'),
    // 清除指定路径的图片标记
    clearImageMarksForPath: (filePath) => ipcRenderer.invoke('clear-image-marks-for-path', filePath),
    // 打开速写日志文件
    openLogFile: () => ipcRenderer.invoke('open-sketch-log'),
});
