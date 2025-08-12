// main.js - Electron 主进程文件

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const Store = require('electron-store'); // 引入 electron-store

// 初始化存储实例，并设置默认的窗口边界
const store = new Store({
    name: 'sketch-tool-settings', // 存储文件的唯一名称
    defaults: {
        windowBounds: { width: 1000, height: 700, x: undefined, y: undefined } // 默认窗口大小和位置
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
 * IPC 通道：在 Finder 中打开文件并选中
 * @param {Event} event - IPC 事件对象
 * @param {string} filePath - 要打开的文件路径
 */
ipcMain.handle('open-file-in-finder', (event, filePath) => {
    shell.showItemInFolder(filePath);
});
