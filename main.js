// main.js - Electron 主进程文件

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs'); // 引入 Node.js 的 fs 模块
const Store = require('electron-store'); // 引入 electron-store

// 初始化存储实例，并设置默认的窗口边界和默认图片文件夹路径
const store = new Store({
    name: 'sketch-tool-settings', // 存储文件的唯一名称
    defaults: {
        windowBounds: { width: 1000, height: 700, x: undefined, y: undefined }, // 默认窗口大小和位置
        defaultImageFolderPath: '', // 默认图片文件夹路径
        mainMenuBackgroundPath: '', // 默认主菜单背景路径
        previewBackgroundPath: '', // 默认预览背景路径
        gridColor: '#FFFFFF', // 默认网格颜色
        gridSize: 50, // 默认网格大小
        timeFormat: 'minutes:seconds', // 默认时间格式
        isRandomPlayback: true // 默认随机播放模式, 会在渲染进程加载并保存
    }
});

let mainWindow;

function createWindow() {
    // 从存储中加载上次的窗口边界
    const savedBounds = store.get('windowBounds');

    mainWindow = new BrowserWindow({
        width: savedBounds.width,
        height: savedBounds.height,
        x: savedBounds.x, // 使用上次保存的 X 坐标
        y: savedBounds.y, // 使用上次保存的 Y 坐标
        minWidth: 600, // 最小宽度
        minHeight: 400, // 最小高度
        frame: true, // 是否显示默认的窗口边框和控制按钮 (最大化/最小化/关闭)
        transparent: false, // 是否透明 (如果需要无边框透明窗口，可以设置为true，但需要自定义标题栏)
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // 预加载脚本路径
            nodeIntegration: false, // 禁用 Node.js 集成，提高安全性
            contextIsolation: true, // 启用上下文隔离，提高安全性
        }
    });

    // 当窗口即将关闭时，保存当前窗口的大小和位置
    mainWindow.on('close', () => {
        if (mainWindow) {
            const currentBounds = mainWindow.getBounds();
            store.set('windowBounds', currentBounds);
        }
    });

    // 加载您的 index.html 文件
    // 请确保 index.html 和 main.js 在同一目录下，或者调整路径
    mainWindow.loadFile('index.html');

    // 打开开发者工具 (可选，在生产环境中通常会禁用)
    // mainWindow.webContents.openDevTools();
}

// 当 Electron 应用准备就绪时创建窗口
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        // 在 macOS 上，当 dock 图标被点击但没有其他窗口打开时，
        // 通常会在应用程序中重新创建一个窗口。
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// 当所有窗口都被关闭时退出应用 (macOS 除外)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { // 'darwin' 是 macOS 平台的标识符
        app.quit();
    }
});

/**
 * IPC 通道：处理渲染进程发送的“置顶”请求
 * @param {Event} event - IPC 事件对象
 * @param {boolean} alwaysOnTop - 是否置顶
 */
ipcMain.on('set-always-on-top', (event, alwaysOnTop) => {
    if (mainWindow) {
        mainWindow.setAlwaysOnTop(alwaysOnTop);
        // 可以选择向渲染进程发送确认消息，更新按钮状态
        event.reply('always-on-top-status', alwaysOnTop);
    }
});

/**
 * IPC 通道：保存设置到 electron-store
 * @param {Event} event - IPC 事件对象
 * @param {string} key - 设置的键名
 * @param {any} value - 设置的值
 */
ipcMain.handle('save-setting', (event, key, value) => {
    store.set(key, value);
});

/**
 * IPC 通道：从 electron-store 加载设置
 * @param {Event} event - IPC 事件对象
 * @param {string} key - 设置的键名
 * @returns {any} - 设置的值
 */
ipcMain.handle('load-setting', (event, key) => {
    return store.get(key);
});

/**
 * IPC 通道：打开文件选择对话框，用于选择背景图片
 * @returns {Promise<string|null>} - 选择的图片路径，如果取消则为 null
 */
ipcMain.handle('open-file-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'], // 允许选择文件
        filters: [
            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] } // 仅允许图片类型
        ]
    });
    if (canceled) {
        return null; // 用户取消选择
    }
    return filePaths[0]; // 返回选择的第一个文件路径
});

/**
 * IPC 通道：打开文件夹选择对话框，用于选择默认图片文件夹
 * @returns {Promise<string|null>} - 选择的文件夹路径，如果取消则为 null
 */
ipcMain.handle('open-folder-dialog', async (event, currentPath = undefined) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'], // 允许选择文件夹
        defaultPath: currentPath // 默认为当前路径，提升用户体验
    });
    if (canceled) {
        return null; // 用户取消选择
    }
    return filePaths[0]; // 返回选择的第一个文件夹路径
});

/**
 * IPC 通道：读取指定文件夹内的文件和子文件夹
 * @param {Event} event - IPC 事件对象
 * @param {string} folderPath - 要读取的文件夹路径
 * @returns {Promise<Array<{name: string, path: string, type: 'file'|'directory'}>>} - 文件和文件夹信息数组
 */
ipcMain.handle('read-folder-images', async (event, folderPath) => {
    try {
        const items = await fs.promises.readdir(folderPath);
        const results = [];
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff']; // 常见图片扩展名

        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            let stats;
            try {
                stats = await fs.promises.stat(itemPath);
            } catch (statError) {
                // 如果文件或文件夹不可访问（例如权限问题），跳过
                console.warn(`无法访问 ${itemPath}: ${statError.message}`);
                continue;
            }

            if (stats.isDirectory()) {
                results.push({
                    name: item,
                    path: itemPath, // 文件夹路径使用原始系统路径
                    type: 'directory'
                });
            } else if (stats.isFile()) {
                const ext = path.extname(item).toLowerCase();
                if (imageExtensions.includes(ext)) {
                    // 对于 Electron 渲染进程，图片需要使用 file:// 协议才能加载本地图片
                    results.push({
                        name: item,
                        path: `file://${itemPath.replace(/\\/g, '/')}`, // 替换反斜杠以兼容 Windows 路径
                        originalPath: itemPath, // 额外存储原始系统路径，用于'在 Finder 中打开'
                        type: 'file'
                    });
                }
            }
        }
        return results;
    } catch (error) {
        console.error('Failed to read folder contents:', error);
        return []; // 返回空数组或抛出错误
    }
});


/**
 * IPC 通道：在 Finder 中打开文件并选中
 * @param {Event} event - IPC 事件对象
 * @param {string} filePath - 要打开的文件路径
 */
ipcMain.handle('open-file-in-finder', (event, filePath) => {
    shell.showItemInFolder(filePath);
});
// main.js - ... (keep existing code above this line)

/**
 * IPC channel: Open file with system's default application
 * @param {Event} event - IPC event object
 * @param {string} filePath - The path of the file to open
 */
ipcMain.handle('open-file-in-default-app', async (event, filePath) => {
    try {
        const result = await shell.openPath(filePath);
        if (result.cancelled) {
            console.log('File opening was cancelled.');
            return { success: false, message: '操作已取消。' };
        } else if (result.error) {
            console.error(`Failed to open ${filePath}: ${result.error}`);
            return { success: false, message: `无法打开文件：${result.error}` };
        } else {
            console.log(`Successfully opened ${filePath}`);
            return { success: true };
        }
    } catch (error) {
        console.error(`Error opening file ${filePath}:`, error);
        return { success: false, message: `打开文件时出错：${error.message}` };
    }
});

// main.js - ... (keep existing code below this line, e.g., createWindow())