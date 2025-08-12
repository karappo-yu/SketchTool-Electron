// preload.js - Electron 预加载脚本
// 这个脚本在渲染进程的全局上下文（window）创建之前运行
// 它是渲染进程与主进程安全通信的桥梁

const { contextBridge, ipcRenderer } = require('electron');

// 通过 contextBridge.exposeInMainWorld 将功能安全地暴露给渲染进程
// 这样渲染进程就不能直接访问 Node.js API，只能通过暴露的接口与主进程通信
contextBridge.exposeInMainWorld('electronAPI', {
    /**
     * 向主进程发送设置窗口置顶状态的请求。
     * @param {boolean} alwaysOnTop - 是否置顶。
     */
    setAlwaysOnTop: (alwaysOnTop) => ipcRenderer.send('set-always-on-top', alwaysOnTop),

    /**
     * 监听主进程返回的置顶状态消息。
     * @param {function(boolean): void} callback - 状态变化时的回调函数。
     */
    onAlwaysOnTopStatus: (callback) => ipcRenderer.on('always-on-top-status', (event, status) => callback(status)),

    /**
     * 调用主进程保存设置。
     * @param {string} key - 设置的键名。
     * @param {any} value - 设置的值。
     */
    saveSetting: (key, value) => ipcRenderer.invoke('save-setting', key, value),

    /**
     * 调用主进程加载设置。
     * @param {string} key - 设置的键名。
     * @returns {Promise<any>} - 设置的值。
     */
    loadSetting: (key) => ipcRenderer.invoke('load-setting', key),

    /**
     * 调用主进程打开文件选择对话框。
     * @returns {Promise<string|null>} - 选择的图片路径。
     */
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),

    /**
     * 调用主进程在 Finder 中打开文件并选中。
     * @param {string} filePath - 要打开的文件路径。
     */
    openFileInFinder: (filePath) => ipcRenderer.invoke('open-file-in-finder', filePath)
});
