// main.js - Electron 主进程文件

const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron'); // 引入 Menu 模块
const path = require('path');
const fs = require('fs'); // 引入 Node.js 的 fs 模块
const Store = require('electron-store'); // 引入 electron-store

// 设置应用程序的名称，这会影响 macOS 菜单栏中显示的名称（以及 about 菜单项）
app.name = 'Cosmos';

// 初始化存储实例，并设置默认的窗口边界和默认图片文件夹路径
const store = new Store({
    name: 'sketch-tool-settings', // 存储文件的唯一名称
    defaults: {
        windowBounds: { width: 1000, height: 700, x: undefined, y: undefined }, // 默认窗口大小和位置
        defaultImageFolderPath: '', // 默认图片文件夹路径
        mainMenuBackgroundPath: '', // 默认主菜单背景路径 (现在为图片路径)
        mainMenuBackgroundChoice: 'solidColor', // 新增：默认主菜单背景模式为纯色
        previewBackgroundPath: '', // 默认预览背景路径
        gridColor: '#FFFFFF', // 默认网格颜色
        gridSize: 50, // 默认网格大小
        timeFormat: 'hours:minutes:seconds', // 默认时间格式 (已更新为时分秒)
        isRandomPlayback: true, // 默认随机播放
        isAlwaysOnTop: false, // 默认不置顶
        previewBackgroundChoice: 'solidColor', // 新增：默认预览背景模式为纯色 (Updated default)
        isLibraryFilterMarkedEnabled: false, // 新增：默认图库不过滤已标记图片
        isFilterMarkedEnabled: true, // 新增：默认播放时过滤已标记图片
        isLightThemeEnabled: false, // 新增：默认深色主题
        isCountdownHidden: false, // 新增：默认显示倒计时
        imageMarks: {}, // 用于存储图片标记的数据结构
        startupMode: 'lastUsedPath' // NEW: 默认启动模式为“上次使用的路径”
    }
});

let mainWindow;
// let aboutWindow = null; // 用于存储关于窗口的引用 - 已移除

// 定义速写日志文件的路径
const SKETCH_LOG_FILE = path.join(app.getPath('userData'), 'sketch_log.txt');

/**
 * 将消息写入独立的速写日志文件。
 * @param {string} message - 要写入日志的消息。
 * @param {string} [imagePath=''] - 可选的图片完整路径，用于日志记录。
*/
function writeToSketchLog(message, imagePath = '') {
    const timestamp = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24小时制
    });
    // 格式化日期部分为 "YYYY年MM月DD日"
    const formattedDate = timestamp.split(' ')[0].replace(/\//g, '年').replace(/-/g, '月') + '日';
    const timePart = timestamp.split(' ')[1];
    let logEntry = `${formattedDate} ${timePart} - ${message}`;

    if (imagePath) {
        logEntry += ` (路径：${imagePath})`;
    }
    logEntry += `\n`;

    fs.appendFile(SKETCH_LOG_FILE, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to sketch log file:', err);
        }
    });
}


function createWindow() {
    // 从存储中加载上次的窗口边界
    const savedBounds = store.get('windowBounds');

    mainWindow = new BrowserWindow({
        width: savedBounds.width,
        height: savedBounds.height,
        x: savedBounds.x, // 使用上次保存的 X 坐标
        y: savedBounds.y, // 使用上次保存的 Y 坐标
        minWidth: 300, // 最小宽度已调整
        minHeight: 200, // 最小高度已调整
        frame: false, // 隐藏原生标题栏和边框
        transparent: true, // 使窗口背景透明，以便 CSS 背景生效
        titleBarStyle: 'hidden', // macOS 上的隐藏标题栏样式，进一步隐藏标题栏 UI
        // 已移除 trafficLightPosition: { x: -100, y: 0 } 以允许交通灯正常显示
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false // 保持 false 以增强安全性
        }
    });

    // 监听窗口移动和大小变化，并保存
    mainWindow.on('resize', () => {
        store.set('windowBounds', mainWindow.getBounds());
    });
    mainWindow.on('move', () => {
        store.set('windowBounds', mainWindow.getBounds());
    });

    // 加载 index.html
    mainWindow.loadFile('index.html');

    // 监听 'ready-to-show' 事件，在窗口准备好显示时应用置顶设置
    mainWindow.once('ready-to-show', () => {
        const initialAlwaysOnTop = store.get('isAlwaysOnTop');
        if (initialAlwaysOnTop !== undefined) {
            // 设置窗口置顶状态，并为 macOS 确保在全屏模式下也可见
            mainWindow.setAlwaysOnTop(initialAlwaysOnTop, { visibleOnFullScreen: true });
            // 将实际的置顶状态发送回渲染进程，以同步 UI 按钮状态
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('always-on-top-status', initialAlwaysOnTop);
            }
        }
        // 在窗口首次显示时（通常是主菜单或文件夹视图），确保交通灯可见
        if (process.platform === 'darwin') { // 仅在 macOS 上执行
            mainWindow.setWindowButtonVisibility(true);
        }
    });

    // 可选：打开开发者工具
    // mainWindow.webContents.openDevTools();

    // 监听窗口关闭事件
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// /**
//  * 打开“关于 Cosmos”窗口。 - 已移除
//  */
// function openAboutWindow() {
//     // 如果“关于”窗口已经存在且未被销毁，则聚焦它
//     if (aboutWindow && !aboutWindow.isDestroyed()) {
//         aboutWindow.focus();
//         return;
//     }

//     aboutWindow = new BrowserWindow({
//         width: 350, // 较小的固定宽度，更像实用工具
//         height: 200, // 较小的固定高度
//         resizable: false, // 不可调整大小
//         minimizable: false, // 不可最小化
//         maximizable: false, // 不可最大化
//         fullscreenable: false, // 不可全屏
//         show: false, // 准备好之前不显示
//         frame: true, // 使用原生窗口框架
//         transparent: false, // 不透明背景
//         titleBarStyle: 'default', // macOS 上的默认标题栏样式 (显示交通灯和标题)
//         center: true, // 窗口居中显示
//         webPreferences: {
//             preload: path.join(__dirname, 'preload.js'),
//             contextIsolation: true,
//             nodeIntegration: false
//         }
//     });

//     aboutWindow.loadFile(path.join(__dirname, 'about.html'));

//     aboutWindow.once('ready-to-show', () => {
//         aboutWindow.show();
//     });

//     // 处理窗口关闭事件，以便垃圾回收
//     aboutWindow.on('closed', () => {
//         aboutWindow = null;
//     });
// }


// Electron 应用准备就绪时创建窗口
app.whenReady().then(() => {
    createWindow();

    // 为 macOS 设置应用程序菜单
    if (process.platform === 'darwin') {
        const template = [
            {
                label: app.name, // 使用 app.name 作为应用程序菜单的标签
                submenu: [
                    {
                        label: `关于 ${app.name}`, // "关于 Cosmos"
                        // click() { openAboutWindow(); } // 已修改：直接调用 app.showAboutPanel()
                        click() {
                            app.setAboutPanelOptions({
                                applicationName: app.name,
                                applicationVersion: app.getVersion(),
                                copyright: '© 2024 Cosmos. All rights reserved.', // 可以根据需要修改版权信息
                                credits: '由 Electron 构建', // 默认信息
                                website: 'https://github.com/karappo-yu/SketchTool-Electron' // 添加您的 GitHub 地址
                            });
                            app.showAboutPanel();
                        }
                    },
                    { type: 'separator' }, // 分隔线
                    { role: 'services', submenu: [] }, // 服务菜单
                    { type: 'separator' },
                    { role: 'hide', label: `隐藏 ${app.name}` }, // 隐藏应用程序
                    { role: 'hideOthers', label: '隐藏其他' }, // 隐藏其他应用程序
                    { role: 'unhide', label: '全部显示' }, // 显示所有应用程序
                    { type: 'separator' },
                    { role: 'quit', label: `退出 ${app.name}` } // 退出应用程序
                ]
            },
            {
                label: '编辑',
                submenu: [
                    { role: 'undo', label: '撤销' },
                    { role: 'redo', label: '重做' },
                    { type: 'separator' },
                    { role: 'cut', label: '剪切' },
                    { role: 'copy', label: '复制' },
                    { role: 'paste', label: '粘贴' },
                    { role: 'selectAll', label: '全选' }
                ]
            },
            {
                label: '窗口',
                submenu: [
                    { role: 'minimize', label: '最小化' },
                    { role: 'zoom', label: '缩放' },
                    { type: 'separator' },
                    { role: 'front', label: '前置所有窗口' } // 将应用程序窗口带到前台
                ]
            }
        ];

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    } else {
        // 对于 Windows/Linux，如果不需要显示菜单栏，可以设置为 null
        // 否则，可以在这里定义一个针对这些平台的菜单
        Menu.setApplicationMenu(null);
    }
});

// 当所有窗口都关闭时退出应用 (macOS 除外)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 应用激活时 (例如点击 dock 图标) 重新创建窗口 (macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

/**
 * IPC 通道：设置窗口置顶状态。
 * @param {Event} event - IPC 事件对象。
 * @param {boolean} alwaysOnTop - 是否置顶。
 */
ipcMain.on('set-always-on-top', (event, alwaysOnTop) => {
    if (mainWindow) {
        // 更新置顶状态，并为 macOS 确保在全屏模式下也可见
        mainWindow.setAlwaysOnTop(alwaysOnTop, { visibleOnFullScreen: true });
        // 回复置顶状态给渲染进程，以便同步 UI 按钮
        event.sender.send('always-on-top-status', mainWindow.isAlwaysOnTop());
    }
});

/**
 * IPC 通道：设置 macOS 窗口交通灯按钮的可见性。
 * 此方法仅在 macOS 上有效。
 * @param {Event} event - IPC 事件对象。
 * @param {boolean} visible - 是否可见。
 */
ipcMain.on('set-traffic-light-visibility', (event, visible) => {
    if (process.platform === 'darwin' && mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.setWindowButtonVisibility(visible);
    }
});


/**
 * IPC 通道：在 Finder 中打开文件并选中
 * @param {Event} event - IPC 事件对象
 * @param {string} filePath - 要打开的文件路径
 */
ipcMain.handle('open-file-in-finder', (event, filePath) => {
    try {
        shell.showItemInFolder(filePath);
        return { success: true };
    } catch (error) {
        console.error('Failed to open file in finder:', error);
        return { success: false, message: error.message };
    }
});

/**
 * IPC 通道：在系统默认应用程序中打开文件。
 * @param {Event} event - IPC 事件对象。
 * @param {string} filePath - 要打开的文件路径。
 */
ipcMain.handle('open-file-in-default-app', async (event, filePath) => {
    console.log(`Main Process: Attempting to open file in default app: ${filePath}`); // Debug log
    try {
        const result = await shell.openPath(filePath);
        console.log(`Main Process: shell.openPath result for ${filePath}: ${result}`); // Debug log
        if (result.startsWith('Error')) {
            return { success: false, message: result };
        }
        return { success: true };
    } catch (error) {
        console.error('Main Process: Failed to open file in default app:', error); // Debug log
        return { success: false, message: error.message };
    }
});


/**
 * IPC 通道：打开文件选择对话框
 * @returns {Promise<string|null>} - 选择的图片路径
 */
ipcMain.handle('open-file-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg'] }]
    });
    if (canceled) {
        return null;
    } else {
        return filePaths[0];
    }
});

/**
 * IPC 通道：打开文件夹选择对话框。
 * @param {Event} event - IPC 事件对象。
 * @param {string} [currentPath] - 文件夹选择对话框的默认打开路径。
 * @returns {Promise<string|null>} - 选择的文件夹路径。
 */
ipcMain.handle('open-folder-dialog', async (event, currentPath) => {
    const defaultPath = currentPath || app.getPath('pictures'); // 如果没有提供当前路径，默认为用户图片文件夹
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
        defaultPath: defaultPath
    });
    if (canceled) {
        return null;
    } else {
        return filePaths[0];
    }
});

/**
 * IPC 通道：读取指定文件夹内的图片文件和子文件夹。
 * 已修改：增加逻辑以过滤掉以点号（.）开头的隐藏文件夹。
 * @param {Event} event - IPC 事件对象。
 * @param {string} folderPath - 要读取的文件夹路径。
 * @returns {Promise<Array<Object>>} - 包含文件和文件夹信息的数组。
 */
ipcMain.handle('read-folder-images', async (event, folderPath) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.svg'];
    const results = [];
    try {
        // 使用 withFileTypes: true 来获取 Dirent 对象，这样可以直接访问 .name 和 .isDirectory() / .isFile()
        const items = await fs.promises.readdir(folderPath, { withFileTypes: true });
        for (const item of items) {
            // 过滤掉以点号 '.' 开头的文件夹（通常是隐藏文件夹，例如 .git, .vscode 等）
            if (item.isDirectory() && item.name.startsWith('.')) {
                continue; // 跳过此隐藏文件夹
            }

            const itemPath = path.join(folderPath, item.name); 
            
            if (item.isDirectory()) { 
                results.push({
                    name: item.name,
                    path: itemPath, 
                    type: 'directory'
                });
            } else if (item.isFile()) { 
                const ext = path.extname(item.name).toLowerCase(); 
                if (imageExtensions.includes(ext)) {
                    results.push({
                        name: item.name,
                        path: `file://${itemPath.replace(/\\/g, '/')}`, 
                        originalPath: itemPath, 
                        type: 'file'
                    });
                }
            }
        }
        return results;
    } catch (error) {
        console.error('Failed to read folder contents:', error);
        return []; 
    }
});


/**
 * IPC 通道：保存设置。
 * @param {Event} event - IPC 事件对象。
 * @param {string} key - 设置的键名。
 * @param {any} value - 设置的值。
 */
ipcMain.handle('save-setting', (event, key, value) => {
    try {
        store.set(key, value);
        return { success: true };
    } catch (error) {
        console.error(`Failed to save setting ${key}:`, error);
        return { success: false, message: error.message };
    }
});

/**
 * IPC 通道：加载设置。
 * @param {Event} event - IPC 事件对象。
 * @param {string} key - 设置的键名。
 * @returns {Promise<any>} - 设置的值。
 */
ipcMain.handle('load-setting', (event, key) => {
    try {
        return store.get(key);
    } catch (error) {
        console.error(`Failed to load setting ${key}:`, error);
        return null;
    }
});

/**
 * IPC 通道：保存图片标记。
 * 同时会将标记事件写入独立的速写日志文件。
 * @param {Event} event - IPC 事件对象。
 * @param {string} filePath - 图片的原始文件路径。
 * @param {number} duration - 标记时的速写时长（秒）。
 * @returns {Promise<Object>} - 成功或失败状态。
 */
ipcMain.handle('save-image-mark', async (event, filePath, duration) => {
    try {
        const marks = store.get('imageMarks') || {};
        if (!marks[filePath]) {
            marks[filePath] = [];
        }
        marks[filePath].push({ duration: duration, timestamp: Date.now() });
        store.set('imageMarks', marks);

        // 写入速写日志
        const fileName = path.basename(filePath);
        const durationText = duration === 0 ? '无限制' : `${duration}秒`;
        // 现在传递 filePath 参数给 writeToSketchLog
        writeToSketchLog(`标记图片：${fileName} (用时：${durationText})`, filePath);

        return { success: true };
    } catch (error) {
        console.error('Failed to save image mark:', error);
        return { success: false, message: error.message };
    }
});

/**
 * IPC 通道：获取所有图片标记。
 * @param {Event} event - IPC 事件对象。
 * @returns {Promise<Object>} - 包含所有图片标记的对象。
 */
ipcMain.handle('get-image-marks', async () => {
    try {
        return store.get('imageMarks') || {};
    } catch (error) {
        console.error('Failed to get image marks:', error);
        return {};
    }
});

/**
 * IPC 通道：清除指定路径的图片标记。
 * 同时会将取消标记事件写入独立的速写日志文件。
 * @param {Event} event - IPC 事件对象。
 * @param {string} filePath - 图片的原始文件路径。
 * @returns {Promise<Object>} - 成功或失败状态。
 */
ipcMain.handle('clear-image-marks-for-path', async (event, filePath) => {
    try {
        const marks = store.get('imageMarks') || {};
        const fileName = path.basename(filePath); 
        
        if (marks[filePath]) { 
            delete marks[filePath]; 
            store.set('imageMarks', marks);
            writeToSketchLog(`取消标记图片：${fileName}`, filePath);
        } else {
            console.log(`No marks found for ${fileName} to clear.`);
        }

        return { success: true };
    } catch (error) {
        console.error('Failed to clear image marks for path:', error);
        return { success: false, message: error.message };
    }
});

/**
 * IPC 通道：打开速写日志文件（现在是独立的 `sketch_log.txt`）。
 * @param {Event} event - IPC 事件对象。
 * @returns {Promise<Object>} - 成功或失败状态。
 */
ipcMain.handle('open-sketch-log', async (event) => {
    try {
        if (!fs.existsSync(SKETCH_LOG_FILE)) {
            fs.writeFileSync(SKETCH_LOG_FILE, '速写日志文件已创建。\n');
        }
        shell.openPath(SKETCH_LOG_FILE); 
        return { success: true };
    } catch (error) {
        console.error('Failed to open sketch log file:', error);
        return { success: false, message: error.message };
    }
});

// /**
//  * IPC 通道：关闭发送此消息的窗口。 - 已移除
//  * @param {Event} event - IPC 事件对象。
//  */
// ipcMain.on('close-current-window', (event) => {
//     const webContents = event.sender;
//     const win = BrowserWindow.fromWebContents(webContents);
//     if (win) {
//         win.close();
//     }
// });

// /**
//  * IPC 通道：打开外部链接。 - 已移除
//  * @param {Event} event - IPC 事件对象。
//  * @param {string} url - 要打开的 URL。
//  * @returns {Promise<Object>} - 成功或失败状态。
//  */
// ipcMain.handle('open-external-link', async (event, url) => {
//     try {
//         await shell.openExternal(url);
//         return { success: true };
//     } catch (error) {
//         console.error('Failed to open external link:', error);
//         return { success: false, message: error.message };
//     }
// });
