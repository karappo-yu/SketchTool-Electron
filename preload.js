// preload.js - Electron 预加载脚本
// 这个脚本在渲染进程的全局上下文（window）创建之前运行
// 它是渲染进程与主进程安全通信的桥梁

const { contextBridge, ipcRenderer, shell } = require('electron'); // 引入 shell 模块

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
     * 调用主进程打开文件夹选择对话框。
     * @param {string} [currentPath] - 文件夹选择对话框的默认打开路径。
     * @returns {Promise<string|null>} - 选择的文件夹路径。
     */
    openFolderDialog: (currentPath) => ipcRenderer.invoke('open-folder-dialog', currentPath),

    /**
     * 调用主进程读取指定文件夹内的文件和子文件夹。
     * @param {string} folderPath - 要读取的文件夹路径。
     * @returns {Promise<Array<Object>>} - 文件和文件夹的列表。
     */
    readFolderImages: (folderPath) => ipcRenderer.invoke('read-folder-images', folderPath),

    /**
     * 调用主进程在文件管理器中显示文件并选中它。
     * @param {string} filePath - 要显示的文件路径。
     */
    openFileInFinder: (filePath) => ipcRenderer.invoke('open-file-in-finder', filePath),

    /**
     * 调用主进程使用系统默认应用打开文件。
     * @param {string} filePath - 要打开的文件路径。
     * @returns {Promise<{success: boolean, message?: string}>} - 操作结果。
     */
    openFileInDefaultApp: (filePath) => ipcRenderer.invoke('open-file-in-default-app', filePath),

    /**
     * 调用主进程保存一个图片标记。
     * @param {string} filePath - 图片的原始系统路径。
     * @param {number} duration - 标记时的绘画时长。
     * @returns {Promise<{success: boolean, error?: string}>} - 操作结果。
     */
    saveImageMark: (filePath, duration) => ipcRenderer.invoke('save-image-mark', filePath, duration),

    /**
     * 调用主进程获取所有图片标记。
     * @returns {Promise<Object>} - 包含所有图片标记的对象。
     */
    getImageMarks: () => ipcRenderer.invoke('get-image-marks'),

    /**
     * 调用主进程清除指定图片的标记。
     * @param {string} filePath - 图片的原始系统路径。
     * @returns {Promise<{success: boolean, error?: string}>} - 操作结果。
     */
    clearImageMarksForPath: (filePath) => ipcRenderer.invoke('clear-image-marks-for-path', filePath),

    /**
     * 调用主进程打开速写日志文件。
     * @returns {Promise<{success: boolean, message?: string}>} - 操作结果。
     */
    openLogFile: () => ipcRenderer.invoke('open-sketch-log'),

    /**
     * 调用主进程设置 macOS 窗口交通灯按钮的可见性。
     * @param {boolean} visible - 是否可见。
     */
    setTrafficLightVisibility: (visible) => ipcRenderer.send('set-traffic-light-visibility', visible),

    /**
     * 调用主进程关闭当前窗口。
     */
    closeCurrentWindow: () => ipcRenderer.send('close-current-window'),

    /**
     * 调用主进程打开外部链接。
     * @param {string} url - 要打开的 URL。
     * @returns {Promise<{success: boolean, message?: string}>} - 操作结果。
     */
    openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url)
});
