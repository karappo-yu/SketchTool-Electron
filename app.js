// Get DOM elements
const appContainer = document.getElementById('app-container');
// New: Dedicated layer for dynamic preview backgrounds
const dynamicBackgroundLayer = document.getElementById('dynamic-background-layer');

const controlsMenu = document.getElementById('controls-menu');
const sketchFolderInputDisplay = document.getElementById('sketchFolderInputDisplay'); // Main menu sketch folder display/selection area
const displayTimeInput = document.getElementById('displayTime');
const startButton = document.getElementById('startButton');
const mirrorToggle = document.getElementById('mirrorToggle');
const grayscaleToggle = document.getElementById('grayscaleToggle');
const gridToggle = document.getElementById('gridToggle');
const mainMenuHintText = document.getElementById('mainMenuHintText'); // New: Main menu hint text element

// Preset time buttons and their container
const presetTimeButtonsContainer = document.getElementById('preset-time-buttons');
const preset30sButton = document.getElementById('preset30s');
const preset60sButton = document.getElementById('preset60s'); 
const preset120sButton = document.getElementById('preset120s');
const preset300sButton = document.getElementById('preset300s'); 
const preset600sButton = document.getElementById('preset600s'); 
const presetInfiniteTime = document.getElementById('presetInfiniteTime'); // NEW: Infinite time option
const presetTimes = [30, 60, 120, 300, 600, Infinity]; // Array of preset times, including Infinity

const imageDisplayArea = document.getElementById('image-display-area');
const currentImage = document.getElementById('current-image');
const countdownElement = document.getElementById('countdown');
const gridCanvas = document.getElementById('grid-canvas');
const ctx = gridCanvas.getContext('2d'); 

// Right floating control menu and hover area
const rightControlsHoverZone = document.getElementById('right-controls-hover-hoverZone');
const overlayControls = document.getElementById('overlay-controls');
const openInFinderButton = document.getElementById('openInFinderButton'); 

// New: Mark Star Button
const markStarButton = document.getElementById('markStarButton'); 

const overlayMirrorToggle = document.getElementById('overlayMirrorToggle');
const overlayGrayscaleToggle = document.getElementById('overlayGrayscaleToggle');
const overlayGridToggle = document.getElementById('overlayGridToggle');
const toggleAlwaysOnTopButton = document.getElementById('toggleAlwaysOnTopButton'); 
const backToMenuButton = document.getElementById('backToMenuButton');

// Image bottom navigation buttons and hover area
const bottomControlsHoverZone = document.getElementById('bottom-controls-hover-zone');
const imageNavigationControls = document.getElementById('image-navigation-controls'); 
const prevImageButton = document.getElementById('prevImageButton'); 
const nextImageButton = document.getElementById('nextImageButton');
const pausePlayButton = document.getElementById('pausePlayButton'); 

// Settings modal related elements
const settingsButton = document.getElementById('settings-button'); 
const randomPlaybackToggle = document.getElementById('random-playback-toggle'); // New random/sequential playback button
// New: Filter Marked Images Toggle
const filterMarkedToggle = document.getElementById('filter-marked-toggle');
// Main Menu Always On Top Toggle (now consistent with Mirror/Grayscale/Grid)
const mainMenuAlwaysOnTopToggle = document.getElementById('mainMenuAlwaysOnTopToggle');

// New: Top-right menu buttons container
const topRightMenuButtons = document.getElementById('top-right-menu-buttons');

const settingsModalOverlay = document.getElementById('settings-modal-overlay');
const closeSettingsModalButton = document.getElementById('closeSettingsModal');
// Main Menu Background New Elements
const mainMenuBackgroundChoiceRadios = document.querySelectorAll('input[name="mainMenuBackgroundChoice"]');
const mainMenuStaticImagePathRow = document.getElementById('mainMenuStaticImagePathRow');
const mainMenuBackgroundPathDisplay = document.getElementById('mainMenuBackgroundPathDisplay');
const selectMainMenuImageButton = document.getElementById('selectMainMenuImageButton');
const clearMainMenuImageButton = document.getElementById('clearMainMenuImageButton');

// Renamed/Refactored Preview Background Buttons
const previewBackgroundChoiceRadios = document.querySelectorAll('input[name="previewBackgroundChoice"]');
const staticImagePathRow = document.getElementById('staticImagePathRow');
const previewBackgroundPathDisplay = document.getElementById('previewBackgroundPathDisplay');
const selectStaticImageButton = document.getElementById('selectStaticImageButton');
const clearStaticImageButton = document.getElementById('clearStaticImageButton');

const gridColorPicker = document.getElementById('gridColorPicker'); 
const resetGridSettingsButton = document.getElementById('resetGridSettingsButton'); // Combined reset button
const gridSizeInput = document.getElementById('gridSizeInput'); 
const timeFormatRadios = document.querySelectorAll('input[name="timeFormat"]'); 
const countdownVisibilityRadios = document.querySelectorAll('input[name="countdownVisibility"]'); // NEW: Countdown visibility radios
const settingsModalThemeToggle = document.getElementById('settings-modal-theme-toggle'); // New theme toggle button inside settings modal
const openSketchLogButton = document.getElementById('openSketchLogButton'); // New: Open Sketch Log Button

// Default image folder settings related DOM elements
const defaultImageFolderPathDisplay = document.getElementById('defaultImageFolderPathDisplay');
const setDefaultImageFolderButton = document.getElementById('setDefaultImageFolderButton');
const clearDefaultImageFolderButton = document.getElementById('clearDefaultImageFolderButton');

// NEW: Startup mode radio buttons
const startupModeChoiceRadios = document.querySelectorAll('input[name="startupMode"]');


// Folder browser view DOM elements
const folderBrowserView = document.getElementById('folder-browser-view');
const currentLibraryPathDisplay = document.getElementById('current-library-path');
const thumbnailsGridContainer = document.getElementById('thumbnails-grid-container');
const selectFolderForSketchAndReturnToMenuButton = document.getElementById('selectFolderForSketchAndReturnToMenuButton'); 
const selectNewFolderFromBrowserButton = document.getElementById('selectNewFolderFromBrowserButton');
// const backFromBrowserToMenuButton = document.getElementById('backFromBrowserToMenuButton'); // Removed, replaced by closeFolderBrowserButton
const folderBrowserInfoMessage = document.getElementById('folderBrowserInfoMessage'); 
const goUpFolderButton = document.getElementById('goUpFolderButton'); 
// New: Library Filter Marked Toggle
const libraryFilterMarkedToggle = document.getElementById('libraryFilterMarkedToggle');
// NEW: Close button for Folder Browser
const closeFolderBrowserButton = document.getElementById('closeFolderBrowserButton');


// Pagination elements
const prevPageButton = document.getElementById('prevPageButton');
const nextPageButton = document.getElementById('nextPageButton');
const pageInfoDisplay = document.getElementById('pageInfoDisplay'); // Corrected from document('pageInfoDisplay')

// New: Hidden Canvas for Average Color Calculation
const hiddenImageCanvas = document.getElementById('hidden-image-canvas');
const hiddenImageCtx = hiddenImageCanvas.getContext('2d', { willReadFrequently: true }); // Optimized for frequent reads


// State variables
let imageFiles = []; // Stores image file objects (including original path etc.) for sketching
let imageUrls = []; // Stores file:// URLs for displaying images for sketching
let currentPlaybackImageIndexes = []; // Stores raw indices of images currently eligible for playback
let currentImageIndex = -1; 
let displayTime = 60; 
let countdownTimer; 
let remainingTime; 
let isPlaying = false; 
let isPaused = false; 
let currentDefaultImageFolderPath = ''; // Saves current default image folder path
let currentLoadedFolderPath = ''; // Saves current folder path loaded in image library view (for browsing)
let mainMenuSelectedFolderPath = ''; // Stores the path explicitly selected for sketching in the main menu


// Effect states
let isMirrorEnabled = false;
let isGrayscaleEnabled = false;
let isGridEnabled = false;
let isAlwaysOnTop = false; 
let isRandomPlayback = true; // New: default to random playback
let isFilterMarkedEnabled = true; // New: default to true (filter marked images) - for playback
let isLibraryFilterMarkedEnabled = false; // New: default to false (show all images) - for library view
let isCountdownHidden = false; // NEW: default to false (show countdown)
let isLightThemeEnabled = false; // New: default to dark theme
// Updated: Preview background choice can be 'solidColor', 'averageColor', 'staticImage'
let previewBackgroundChoice = 'solidColor'; // New: default preview background mode
let mainMenuBackgroundChoice = 'solidColor'; // New: default main menu background mode
let startupMode = 'lastUsedPath'; // NEW: Default startup mode


// Image playback history
let displayedImageHistory = [];
let historyPointer = -1; 

// New: Global image marks object. Keys are original file paths, values are arrays of { duration, timestamp }
let imageMarks = {}; 

// Default settings values
const defaultGridColorHex = '#FFFFFF'; 
const defaultGridSize = 50; 
const defaultTimeFormat = 'hours:minutes:seconds'; // Changed default to "时:分:秒"
const gridAlpha = 0.3; 

// Current setting values (will be loaded from storage)
let currentMainMenuBackgroundPath = ''; // This will store the path for 'staticImage' mode for main menu
let currentPreviewBackgroundPath = ''; // This will store the path for 'staticImage' mode for preview
let currentGridColorHex = defaultGridColorHex;
let currentGridSize = defaultGridSize;
let currentTimeFormat = defaultTimeFormat;

// Pagination state
const itemsPerPage = 30; // Number of items (folders + images) to display per page
let currentFolderItems = []; // Stores ALL sorted items (directories + files) for the current folder view
let currentPage = 0; // 0-indexed page number


/**
 * Natural sort comparator function for strings, handling numbers correctly.
 * From: https://stackoverflow.com/questions/38640203/javascript-sort-array-of-objects-by-property-containing-numbers-and-letters
 * @param {object} a - First object with a 'name' property to compare.
 * @param {object} b - Second object with a 'name' property to compare.
 * @returns {number} - Comparison result.
 */
function naturalSort(a, b) {
    // Ensure 'name' properties exist before calling localeCompare
    const nameA = a.name || '';
    const nameB = b.name || '';
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
}


/**
 * Displays a custom alert box, replacing the native alert.
 * @param {string} message - Message to display.
 * @param {string} [title="Tip"] - Title of the alert box.
 */
function showCustomAlert(message, title = "Tip") {
    // Remove existing alert box if any
    const existingAlert = document.getElementById('custom-alert-box');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertBox = document.createElement('div');
    alertBox.id = 'custom-alert-box'; // Assign ID for easy removal
    alertBox.innerHTML = `
        <h3 style="margin-bottom: 15px; font-size: 1.3em;">${title}</h3>
        <p style="margin-bottom: 20px; font-size: 1em; line-height: 1.5;">${message}</p>
        <button id="alertCloseButton" style="
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease, color 0.3s ease;
        ">确定</button>
    `;
    document.body.appendChild(alertBox);

    document.getElementById('alertCloseButton').addEventListener('click', () => {
        document.body.removeChild(alertBox);
    });
}

/**
 * Applies the selected theme to the body element.
 * @param {boolean} isLight - True for light theme, false for dark theme.
 */
function applyTheme(isLight) {
    isLightThemeEnabled = isLight;
    document.body.classList.toggle('light-theme', isLight);
    // Update settings modal theme toggle button state
    settingsModalThemeToggle.classList.toggle('active', isLight);
    if (window.electronAPI) {
        window.electronAPI.saveSetting('isLightThemeEnabled', isLight);
    }
    // Reapply current background to ensure theme changes reflect
    if (!imageDisplayArea.classList.contains('hidden')) {
        // If in preview mode, reapply preview background based on choice
        updatePreviewBackground(); // Use unified function
    } else {
        // If in menu/browser mode, reapply main menu background
        updateMainMenuBackground(); // Use unified function
    }
    // Redraw grid if enabled to update its color based on theme
    if (isGridEnabled && !imageDisplayArea.classList.contains('hidden')) {
        setGridColor(currentGridColorHex); // This will trigger drawGrid
    }
}

/**
 * Calculates the average RGB color of an image loaded onto a canvas.
 * @param {HTMLImageElement} imgElement - The image element to analyze.
 * @returns {string} - The average color in 'rgb(R,G,B)' format.
 */
function getAverageColor(imgElement) {
    if (!imgElement.complete) {
        console.warn('Image not fully loaded for average color calculation.');
        return 'rgb(0,0,0)'; // Return black or transparent if not loaded
    }

    // Set canvas dimensions to image natural dimensions for full resolution sampling
    // Use Math.max to prevent zero dimensions if image is not yet fully rendered
    hiddenImageCanvas.width = Math.max(1, imgElement.naturalWidth || imgElement.offsetWidth);
    hiddenImageCanvas.height = Math.max(1, imgElement.naturalHeight || imgElement.offsetHeight);

    if (hiddenImageCanvas.width === 0 || hiddenImageCanvas.height === 0) {
        console.warn('Cannot get average color for an image with zero dimensions after setting canvas.');
        return 'rgb(0,0,0)';
    }

    hiddenImageCtx.clearRect(0, 0, hiddenImageCanvas.width, hiddenImageCanvas.height);
    hiddenImageCtx.drawImage(imgElement, 0, 0, hiddenImageCanvas.width, hiddenImageCanvas.height);

    const imageData = hiddenImageCtx.getImageData(0, 0, hiddenImageCanvas.width, hiddenImageCanvas.height).data;
    let r = 0, g = 0, b = 0;
    let count = 0;
    const pixelCount = hiddenImageCanvas.width * hiddenImageCanvas.height;
    // Sample up to 10,000 pixels for performance, or every pixel if image is small
    const step = Math.max(1, Math.floor(pixelCount / 10000)); 

    for (let i = 0; i < imageData.length; i += 4 * step) { // Increment by 4 (RGBA) * step
        // const alpha = imageData[i + 3]; // Alpha component (not used for average color)
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
    }

    if (count === 0) return 'rgb(0,0,0)'; // Avoid division by zero if all pixels are transparent or image is too small

    const avgR = Math.floor(r / count);
    const avgG = Math.floor(g / count);
    const avgB = Math.floor(b / count);

    return `rgb(${avgR},${avgG},${avgB})`;
}


/**
 * Applies background to a specified element based on type and source.
 * @param {HTMLElement} targetElement - The element to apply the background to (e.g., document.body or dynamicBackgroundLayer).
 * @param {'menuGradient'|'previewSolid'|'staticImage'|'averageColor'} backgroundType - The type of background to apply.
 * @param {string} [sourcePath=''] - The file path for 'staticImage' type, or a dynamic color for 'averageColor'.
 */
function applyBackground(targetElement, backgroundType, sourcePath = '') {
    // Clear previous styles from the target element first
    targetElement.style.backgroundImage = '';
    targetElement.style.backgroundColor = '';
    targetElement.style.backgroundSize = '';
    targetElement.style.backgroundPosition = '';
    targetElement.style.backgroundRepeat = '';
    targetElement.style.backgroundAttachment = '';

    if (backgroundType === 'menuGradient') {
        targetElement.style.backgroundImage = `linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-mid), var(--bg-gradient-end))`;
    } else if (backgroundType === 'previewSolid') {
        targetElement.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--default-preview-bg');
    } else if (backgroundType === 'staticImage' && sourcePath) {
        targetElement.style.backgroundImage = `url('file://${sourcePath}')`;
        targetElement.style.backgroundSize = 'cover';
        targetElement.style.backgroundPosition = 'center center';
        targetElement.style.backgroundRepeat = 'no-repeat';
        targetElement.style.backgroundAttachment = 'fixed';
    } else if (backgroundType === 'averageColor' && sourcePath) {
        targetElement.style.backgroundColor = sourcePath;
    } else {
        // Fallback to default solid preview background
        targetElement.style.backgroundColor = getComputedStyle(document.body).getPropertyValue('--default-preview-bg');
        console.warn(`Invalid backgroundType or missing sourcePath for background application on ${targetElement.id}: ${backgroundType}, ${sourcePath}`);
    }
}

/**
 * Updates the main menu and folder browser background based on selected choice.
 */
function updateMainMenuBackground() {
    // Ensure the dynamic layer is not showing its background
    dynamicBackgroundLayer.style.backgroundImage = 'none';
    dynamicBackgroundLayer.style.backgroundColor = 'transparent';
    dynamicBackgroundLayer.classList.remove('grayscale-active-bg'); // Ensure grayscale is off for this layer

    if (mainMenuBackgroundChoice === 'staticImage') {
        applyBackground(document.body, 'staticImage', currentMainMenuBackgroundPath);
    } else { // 'solidColor' (which maps to 'menuGradient' for main menu)
        applyBackground(document.body, 'menuGradient');
    }
}

/**
 * Updates the preview background based on selected choice (solid, average, static image).
 * This function now only handles setting the background image/color.
 * Grayscale effect is handled by updatePreviewBackgroundGrayscaleEffect().
 */
function updatePreviewBackground() {
    // Ensure the body's background is transparent when preview layer is active
    document.body.style.backgroundColor = 'transparent';
    document.body.style.backgroundImage = 'none';

    if (previewBackgroundChoice === 'averageColor') {
        if (currentImage.complete && currentImage.naturalWidth > 0) {
            const avgColor = getAverageColor(currentImage);
            applyBackground(dynamicBackgroundLayer, 'averageColor', avgColor);
        } else {
            applyBackground(dynamicBackgroundLayer, 'previewSolid'); // Fallback
        }
    } else if (previewBackgroundChoice === 'staticImage') {
        applyBackground(dynamicBackgroundLayer, 'staticImage', currentPreviewBackgroundPath);
    } else { // 'solidColor'
        applyBackground(dynamicBackgroundLayer, 'previewSolid');
    }
}

/**
 * Controls the grayscale filter on the background (dynamicBackgroundLayer).
 * Applies grayscale only if grayscale effect is enabled AND background is 'averageColor' or 'solidColor'.
 */
function updatePreviewBackgroundGrayscaleEffect() {
    if (isGrayscaleEnabled && (previewBackgroundChoice === 'averageColor' || previewBackgroundChoice === 'solidColor')) {
        dynamicBackgroundLayer.classList.add('grayscale-active-bg');
    } else {
        dynamicBackgroundLayer.classList.remove('grayscale-active-bg');
    }
}

/**
 * Displays the main menu interface.
 * When called without a parameter, it relies on `mainMenuSelectedFolderPath` to restore the state.
 * @param {string} [folderPathToSetAsSelected] - The folder path to set as the *new* selected sketch folder in the main menu. If null/undefined, it retains the existing `mainMenuSelectedFolderPath`.
 */
async function showMainMenu(folderPathToSetAsSelected = null) {
    controlsMenu.classList.remove('hidden');
    folderBrowserView.classList.add('hidden'); // Hide image library view
    imageDisplayArea.classList.add('hidden'); // Hide image display area
    topRightMenuButtons.classList.remove('hidden'); // Show top-right menu buttons

    // Clear background from dynamic layer and apply to body
    dynamicBackgroundLayer.style.backgroundImage = 'none';
    dynamicBackgroundLayer.style.backgroundColor = 'transparent';
    dynamicBackgroundLayer.classList.remove('grayscale-active-bg'); // Ensure grayscale is off for this layer
    updateMainMenuBackground(); // Apply main menu background to body

    updateNavigationButtons(); // Update button states

    // IMPORTANT: Determine the folder to display and load for sketching
    let targetFolderForSketch = mainMenuSelectedFolderPath; // Default to existing selection

    if (folderPathToSetAsSelected) {
        // If a new folder is explicitly provided (e.g., from "选择此文件夹" button)
        targetFolderForSketch = folderPathToSetAsSelected;
        mainMenuSelectedFolderPath = folderPathToSetAsSelected; // Update the persistent state
    } else if (startupMode === 'defaultPath' && currentDefaultImageFolderPath) {
        // If startup mode is default path, and a default path exists, use it
        targetFolderForSketch = currentDefaultImageFolderPath;
        mainMenuSelectedFolderPath = currentDefaultImageFolderPath; // Also update persistent state to reflect what's being shown
    } else if (startupMode === 'lastUsedPath' && mainMenuSelectedFolderPath) {
        // If startup mode is last used path, and a last used path exists, use it
        targetFolderForSketch = mainMenuSelectedFolderPath;
    }
    // If none of the above, targetFolderForSketch remains whatever mainMenuSelectedFolderPath was,
    // which might be empty, leading to the "Click to select" message.


    if (targetFolderForSketch) {
        // If there's a folder to display, update the UI and load its images for playback
        sketchFolderInputDisplay.textContent = targetFolderForSketch;
        
        // Re-read images for the *selected* folder to ensure `imageFiles` and `imageUrls` are accurate
        // This is crucial if user browsed around in the library but came back without selecting
        // a new folder for sketching. The old `imageFiles` might be from a different folder.
        try {
            const items = await window.electronAPI.readFolderImages(targetFolderForSketch);
            let allImageFilesForPlayback = items.filter(item => item.type === 'file');
            allImageFilesForPlayback.sort((a, b) => naturalSort(a, b));
            imageFiles = allImageFilesForPlayback.map(file => ({ name: file.name, path: file.originalPath }));
            imageUrls = allImageFilesForPlayback.map(file => file.path);
        } catch (error) {
            console.error('Failed to load images for main menu selected folder:', error);
            imageFiles = [];
            imageUrls = [];
            sketchFolderInputDisplay.textContent = '无法加载上次选择的文件夹。请重新选择。';
            showCustomAlert('无法加载上次选择的文件夹。请尝试重新选择一个文件夹。', '错误');
            mainMenuSelectedFolderPath = ''; // Clear corrupted state
        }
    } else {
        // No folder selected or default path, reset display
        sketchFolderInputDisplay.textContent = '点击选择速写文件夹...';
        imageFiles = [];
        imageUrls = [];
    }

    updatePlaybackImagePool(); // Recalculate playback pool based on potentially reloaded imageFiles
    updateMainMenuHintText(); // Update hint text based on current selection

    // Show traffic lights when in main menu
    if (window.electronAPI) {
        window.electronAPI.setTrafficLightVisibility(true);
    }
}

/**
 * Checks if all images directly within a given folder are marked.
 * This function does NOT recurse into subdirectories.
 * @param {string} folderPath - The path to the folder to check.
 * @returns {Promise<boolean>} - True if all direct images are marked, false otherwise.
 */
async function isFolderCompleted(folderPath) {
    if (!window.electronAPI) {
        console.warn('Electron API not available for folder completion check.');
        return false;
    }

    try {
        const items = await window.electronAPI.readFolderImages(folderPath);
        const directImages = items.filter(item => item.type === 'file');

        if (directImages.length === 0) {
            return false; // A folder with no direct images cannot be "completed"
        }

        for (const imageFile of directImages) {
            // Note: imageFile.originalPath is used here because imageMarks keys are original paths
            if (!imageMarks[imageFile.originalPath] || imageMarks[imageFile.originalPath].length === 0) {
                return false; // Found an unmarked image
            }
        }
        return true; // All direct images found were marked
    } catch (error) {
        console.error(`Error checking folder completion for ${folderPath}:`, error);
        return false; // Assume not completed if an error occurs
    }
}


/**
 * Renders thumbnails for the current page in the folder browser.
 * This function is now async because it awaits `isFolderCompleted`.
 */
async function renderCurrentPageThumbnails() {
    thumbnailsGridContainer.innerHTML = ''; // Clear previous thumbnails
    folderBrowserInfoMessage.classList.add('hidden'); // Hide info message by default

    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, currentFolderItems.length);
    const itemsToDisplay = currentFolderItems.slice(startIndex, endIndex);

    if (itemsToDisplay.length === 0 && currentFolderItems.length === 0) {
        folderBrowserInfoMessage.textContent = '当前文件夹为空。';
        folderBrowserInfoMessage.classList.remove('hidden');
    } else if (itemsToDisplay.length === 0 && currentFolderItems.length > 0) {
         // Should not happen if pagination logic is correct, but as a safeguard
        folderBrowserInfoMessage.textContent = '没有更多项目了。';
        folderBrowserInfoMessage.classList.remove('hidden');
    }

    for (const item of itemsToDisplay) { // Changed to for...of loop to use await
        const thumbnailItem = document.createElement('div');
        thumbnailItem.classList.add('thumbnail-item');
        
        if (item.type === 'directory') {
            thumbnailItem.innerHTML = `
                <span class="folder-icon">📁</span>
                <div class="thumbnail-label">${item.name}</div>
            `;
            thumbnailItem.addEventListener('click', () => showFolderBrowserView(item.path)); // Click folder to enter

            // New: Check if folder is completed and add a mark
            const completed = await isFolderCompleted(item.path); // Await this async call
            if (completed) {
                const completedInfoDiv = document.createElement('div');
                completedInfoDiv.classList.add('thumbnail-folder-completed-info');
                completedInfoDiv.textContent = '已完成';
                thumbnailItem.appendChild(completedInfoDiv);
            }

        } else if (item.type === 'file') {
            const imgElement = document.createElement('img');
            imgElement.src = item.path; // Use file:// protocol path
            imgElement.alt = item.name;

            const labelElement = document.createElement('div');
            labelElement.classList.add('thumbnail-label');
            labelElement.textContent = item.name;

            thumbnailItem.appendChild(imgElement);
            thumbnailItem.appendChild(labelElement);

            // Add mark info and delete button
            const marks = imageMarks[item.originalPath];
            if (marks && marks.length > 0) {
                const latestMark = marks.sort((a, b) => b.timestamp - a.timestamp)[0];
                const date = new Date(latestMark.timestamp);
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const formattedDateShort = `${month}/${day}`;

                const markInfoDiv = document.createElement('div');
                markInfoDiv.classList.add('thumbnail-mark-info');
                markInfoDiv.innerHTML = `
                    ${formattedDateShort} (${latestMark.duration === 0 ? '∞' : latestMark.duration + 's'})
                    <span class="delete-mark-button" data-path="${item.originalPath}">&times;</span>
                `;
                thumbnailItem.appendChild(markInfoDiv);

                // Attach event listener for the delete button
                const deleteButton = markInfoDiv.querySelector('.delete-mark-button');
                deleteButton.addEventListener('click', async (e) => { // Make this async
                    e.stopPropagation(); // Prevent opening image or folder when clicking delete
                    const pathToDelete = e.target.dataset.path;
                    const scrollPos = thumbnailsGridContainer.scrollTop; // Capture scroll position
                    if (window.electronAPI && pathToDelete) {
                        await window.electronAPI.clearImageMarksForPath(pathToDelete);
                        imageMarks = await window.electronAPI.getImageMarks(); // Reload marks
                        updatePlaybackImagePool(); // Also update the playback pool for main menu
                        await renderCurrentPageThumbnails(); // NOW AWAIT IT to ensure DOM is fully rebuilt
                        // FIX: Defer scroll restoration slightly to allow DOM to render
                        requestAnimationFrame(() => {
                            thumbnailsGridContainer.scrollTop = scrollPos; // Restore scroll position
                        });
                        updateMainMenuHintText(); // Update hint text when marks are changed
                    }
                });
            }

            // Add double-click to open image in system viewer
            thumbnailItem.addEventListener('dblclick', () => {
                if (window.electronAPI && item.originalPath) {
                    console.log(`Renderer: Double-clicked to open file: ${item.originalPath}`); // Debug log
                    window.electronAPI.openFileInDefaultApp(item.originalPath)
                        .then(result => {
                            if (!result.success) {
                                showCustomAlert(result.message || '无法打开文件。', '错误');
                                console.error('Renderer: Failed to open file in default app:', result.message || 'Unknown error'); // Debug log
                            } else {
                                console.log('Renderer: File opened successfully.'); // Debug log
                            }
                        });
                } else {
                    showCustomAlert('此功能仅在打包为桌面应用后可用。', '提示');
                }
            });
        }
        thumbnailsGridContainer.appendChild(thumbnailItem);
    }

    // Update pagination info and button states
    const totalPages = Math.ceil(currentFolderItems.length / itemsPerPage);
    pageInfoDisplay.textContent = `第 ${currentPage + 1} 页 / 共 ${totalPages === 0 ? 1 : totalPages} 页`;
    prevPageButton.disabled = (currentPage === 0);
    nextPageButton.disabled = (currentPage >= totalPages - 1 || totalPages === 0);
}

/**
 * Displays the previous page of thumbnails.
 */
function showPreviousPageOfThumbnails() {
    if (currentPage > 0) {
        currentPage--;
        renderCurrentPageThumbnails();
    }
}

/**
 * Displays the next page of thumbnails.
 */
function showNextPageOfThumbnails() {
    const totalPages = Math.ceil(currentFolderItems.length / itemsPerPage);
    if (currentPage < totalPages - 1) {
        currentPage++;
        renderCurrentPageThumbnails();
    }
}

/**
 * Display folder browser view and load images and subfolders under the specified path.
 * This function is primarily for *browsing* the folder structure.
 * It does NOT set the "sketch folder" for the main menu, unless explicitly done by "Select this folder" button.
 * @param {string} folderPath - The folder path to read and display.
 */
async function showFolderBrowserView(folderPath) {
    // If no path is explicitly provided (e.g., first launch without default),
    // or if the path is invalid, try to get a path via dialog.
    if (!folderPath) {
        if (window.electronAPI) {
            // If no folderPath, or if the current main menu selected path is invalid,
            // try to open the dialog starting from the default or last known good path.
            const initialDialogPath = mainMenuSelectedFolderPath || currentDefaultImageFolderPath || undefined;
            const newFolderPath = await window.electronAPI.openFolderDialog(initialDialogPath);
            if (newFolderPath) {
                folderPath = newFolderPath;
            } else {
                // User canceled, go back to main menu.
                showMainMenu();
                return;
            }
        } else {
            showCustomAlert('无法加载图片库，请选择一个有效文件夹。', '错误');
            showMainMenu(); // Go back to main menu for user to re-select
            return;
        }
    }


    controlsMenu.classList.add('hidden');
    imageDisplayArea.classList.add('hidden');
    folderBrowserView.classList.remove('hidden'); // Show image library view
    topRightMenuButtons.classList.remove('hidden'); // Show top-right menu buttons in folder browser view

    // Ensure the dynamic layer is not showing its background for folder browser
    dynamicBackgroundLayer.style.backgroundImage = 'none';
    dynamicBackgroundLayer.style.backgroundColor = 'transparent';
    dynamicBackgroundLayer.classList.remove('grayscale-active-bg'); // Ensure grayscale is off for this layer
    updateMainMenuBackground(); // Image library view also uses main menu background (on body)
    
    currentLoadedFolderPath = folderPath; // Update current loaded folder path for *browsing* context
    // Simplify path display, only show the last part of the folder name, but keep full path as tooltip
    const pathParts = folderPath.split(/[/\\]/);
    currentLibraryPathDisplay.textContent = `当前文件夹: ${pathParts[pathParts.length - 1]}`;
    currentLibraryPathDisplay.title = folderPath; // Full path as tooltip
    
    thumbnailsGridContainer.innerHTML = ''; // Clear previous thumbnails
    folderBrowserInfoMessage.textContent = '加载中...'; // Display loading message
    folderBrowserInfoMessage.classList.remove('hidden'); // Ensure message is displayed

    // Clear currentFolderItems, it will be repopulated with contents of `folderPath` for browsing
    currentFolderItems = []; 
    
    // Disable "Select this folder" button by default until images are loaded for this browsed folder
    selectFolderForSketchAndReturnToMenuButton.disabled = true;

    // Show "Go Up Folder" button (if not root directory)
    const parentPath = getParentPath(folderPath);
    goUpFolderButton.classList.toggle('hidden', !parentPath);

    // Update the library filter button state
    libraryFilterMarkedToggle.classList.toggle('active', isLibraryFilterMarkedEnabled);

    try {
        const items = await window.electronAPI.readFolderImages(folderPath);

        if (items.length === 0) {
            folderBrowserInfoMessage.textContent = `在 "${pathParts[pathParts.length - 1]}" 文件夹中未找到任何图片或子文件夹。`;
            await renderCurrentPageThumbnails(); // Update pagination UI to reflect empty state
            return;
        }

        const directories = items.filter(item => item.type === 'directory');
        let allImageFilesForBrowsing = items.filter(item => item.type === 'file');

        // Apply library filter here for display in the browser
        if (isLibraryFilterMarkedEnabled) {
            allImageFilesForBrowsing = allImageFilesForBrowsing.filter(file => {
                const isMarked = imageMarks[file.originalPath] && imageMarks[file.originalPath].length > 0;
                return !isMarked; // Only keep unmarked images
            });
        }
        
        // Combine all items (directories + sorted images) for pagination display in the browser
        currentFolderItems = directories.concat(allImageFilesForBrowsing.sort((a, b) => naturalSort(a, b)));
        currentFolderItems.sort((a,b) => { // Sort all items (folders first, then files)
            if (a.type === 'directory' && b.type === 'file') return -1;
            if (a.type === 'file' && b.type === 'directory') return 1;
            return naturalSort(a,b);
        });

        currentPage = 0; // Reset to first page
        await renderCurrentPageThumbnails(); // Wait for thumbnails to render including folder completion checks

        // Enable "Select this folder" button if there are images *in this browsed folder* (regardless of current main menu selection)
        // This button sets the `mainMenuSelectedFolderPath` to `currentLoadedFolderPath`.
        if (allImageFilesForBrowsing.length > 0) {
            selectFolderForSketchAndReturnToMenuButton.disabled = false;
        } else {
            selectFolderForSketchAndReturnToMenuButton.disabled = true;
        }

    }  catch (error) {
        console.error('Failed to load images/folders for folder browser:', error);
        folderBrowserInfoMessage.textContent = `加载图片库失败：${error.message || '未知错误'}`;
        folderBrowserInfoMessage.classList.remove('hidden');
        selectFolderForSketchAndReturnToMenuButton.disabled = true; // Disable on failure
        await renderCurrentPageThumbnails(); // Update pagination UI for error state
    }
    // Show traffic lights when in folder browser
    if (window.electronAPI) {
        window.electronAPI.setTrafficLightVisibility(true);
    }
}

/**
 * Get parent folder path
 * @param {string} currentPath - Current path
 * @returns {string|null} Parent path, null if it's the root directory
 */
function getParentPath(currentPath) {
    if (!currentPath) return null;
    // Use Electron API to get dirname, because renderer process does not have Node.js path module
    // Currently simplified to JS string operations, but a more robust solution is IPC to main process to get path.dirname
    const parts = currentPath.split(/[/\\]/); // Compatible with Windows and macOS
    if (parts.length <= 1) return null; // Already root directory or drive root (e.g., C:\)

    // If it's Windows drive root (e.g., C:\), there is no parent
    if (parts.length === 2 && parts[1] === '' && /^[a-zA-Z]:$/.test(parts[0])) {
        return null;
    }
    
    // Remove the last part
    parts.pop();
    // Recombine path
    let parent = parts.join(currentPath.includes('/') ? '/' : '\\');
    // Handle Windows drive root, ensure C: becomes C:\
    if (parent.match(/^[a-zA-Z]:$/) && currentPath.includes('\\')) {
        parent += '\\';
    }
    return parent || (currentPath.includes('/') ? '/' : '\\'); // If it's /a/b -> / , otherwise Windows drive root
}


/**
 * Helper function: Converts Hex color to RGBA string
 * @param {string} hex - Hex color value (e.g., #RRGGBB)
 * @param {number} alpha - Alpha transparency (0-1)
 * @returns {string} - RGBA color string (e.g., rgba(255, 255, 255, 0.3))
 */
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Sets grid color and saves to settings.
 * @param {string} hexColor - Hex color value to set.
 */
function setGridColor(hexColor) {
    currentGridColorHex = hexColor;
    ctx.strokeStyle = hexToRgba(currentGridColorHex, gridAlpha);
    if (window.electronAPI) {
        window.electronAPI.saveSetting('gridColor', currentGridColorHex);
    }
    if (isGridEnabled && !imageDisplayArea.classList.contains('hidden')) {
        drawGrid();
    }
}

/**
 * Sets grid size and saves to settings.
 * @param {number} size - Grid size (pixels).
 */
function setGridSize(size) {
    currentGridSize = size;
    if (window.electronAPI) {
        window.electronAPI.saveSetting('gridSize', currentGridSize);
    }
    if (isGridEnabled && !imageDisplayArea.classList.contains('hidden')) {
        drawGrid();
    }
}

/**
 * Sets time display format and saves to settings.
 * @param {string} format - Time format ('hours:minutes:seconds' or 'seconds').
 */
function setTimeFormat(format) {
    currentTimeFormat = format;
    if (window.electronAPI) {
        window.electronAPI.saveSetting('timeFormat', currentTimeFormat);
    }
    updateCountdownDisplay(); // Update display immediately
}

/**
 * Initialization function, loads all saved settings and determines initial view.
 */
document.addEventListener('DOMContentLoaded', async () => {
    if (window.electronAPI) {
        // Load theme setting first
        isLightThemeEnabled = await window.electronAPI.loadSetting('isLightThemeEnabled') ?? false; // Default to dark theme
        applyTheme(isLightThemeEnabled); // Apply theme immediately

        // Load main menu background settings
        mainMenuBackgroundChoice = await window.electronAPI.loadSetting('mainMenuBackgroundChoice') ?? 'solidColor';
        currentMainMenuBackgroundPath = await window.electronAPI.loadSetting('mainMenuBackgroundPath') || '';
        
        mainMenuBackgroundChoiceRadios.forEach(radio => {
            if (radio.value === mainMenuBackgroundChoice) {
                radio.checked = true;
            }
        });
        mainMenuStaticImagePathRow.style.display = (mainMenuBackgroundChoice === 'staticImage') ? 'flex' : 'none';
        mainMenuBackgroundPathDisplay.value = currentMainMenuBackgroundPath || '未选择静态图片';


        // Load preview background settings
        previewBackgroundChoice = await window.electronAPI.loadSetting('previewBackgroundChoice') ?? 'solidColor'; // Default to 'solidColor'
        currentPreviewBackgroundPath = await window.electronAPI.loadSetting('previewBackgroundPath') || ''; // Path for 'staticImage' mode

        previewBackgroundChoiceRadios.forEach(radio => {
            if (radio.value === previewBackgroundChoice) {
                radio.checked = true;
            }
        });
        // Initialize visibility of staticImagePathRow
        staticImagePathRow.style.display = (previewBackgroundChoice === 'staticImage') ? 'flex' : 'none';
        previewBackgroundPathDisplay.value = currentPreviewBackgroundPath || '未选择静态图片';
        
        // Load grid color
        const savedGridColor = await window.electronAPI.loadSetting('gridColor');
        if (savedGridColor) {
            gridColorPicker.value = savedGridColor;
            setGridColor(savedGridColor); 
        } else {
            gridColorPicker.value = defaultGridColorHex;
            setGridColor(defaultGridColorHex);
        }

        // Load grid size
        const savedGridSize = await window.electronAPI.loadSetting('gridSize');
        if (savedGridSize) {
            gridSizeInput.value = savedGridSize;
            setGridSize(savedGridSize); 
        } else {
            gridSizeInput.value = defaultGridSize;
            setGridSize(defaultGridSize);
        }

        // Load time format
        const savedTimeFormat = await window.electronAPI.loadSetting('timeFormat');
        if (savedTimeFormat) {
            currentTimeFormat = savedTimeFormat;
            // Ensure the correct radio button is checked even if the value changed
            timeFormatRadios.forEach(radio => {
                if (radio.value === savedTimeFormat) {
                    radio.checked = true;
                } else {
                     // Handle old "minutes:seconds" format by mapping it to "hours:minutes:seconds"
                    if (savedTimeFormat === "minutes:seconds" && radio.value === "hours:minutes:seconds") {
                        radio.checked = true;
                        currentTimeFormat = "hours:minutes:seconds"; // Update internal state
                    }
                }
            });
            setTimeFormat(currentTimeFormat); // Call setTimeFormat with the potentially updated format
        } else {
            currentTimeFormat = defaultTimeFormat;
            timeFormatRadios.forEach(radio => {
                if (radio.value === defaultTimeFormat) {
                    radio.checked = true;
                }
            });
            setTimeFormat(defaultTimeFormat);
        }

        // Load countdown visibility setting
        isCountdownHidden = await window.electronAPI.loadSetting('isCountdownHidden') ?? false; // Default to false (show)
        countdownVisibilityRadios.forEach(radio => {
            if ((radio.value === 'hide' && isCountdownHidden) || (radio.value === 'show' && !isCountdownHidden)) {
                radio.checked = true;
            }
        });
        updateCountdownDisplay(); // Update initial display based on loaded setting


        // Load default image folder path
        currentDefaultImageFolderPath = await window.electronAPI.loadSetting('defaultImageFolderPath') || '';
        defaultImageFolderPathDisplay.value = currentDefaultImageFolderPath || '未设置默认路径';

        // Load previously selected main menu folder path
        mainMenuSelectedFolderPath = await window.electronAPI.loadSetting('mainMenuSelectedFolderPath') || '';

        // Load random playback setting
        isRandomPlayback = await window.electronAPI.loadSetting('isRandomPlayback') ?? true; // Default to true if not set
        randomPlaybackToggle.classList.toggle('active', isRandomPlayback);

        // Load filter marked setting (for playback)
        isFilterMarkedEnabled = await window.electronAPI.loadSetting('isFilterMarkedEnabled') ?? true; // Default to true (filter marked)
        filterMarkedToggle.classList.toggle('active', isFilterMarkedEnabled);

        // Load library filter marked setting
        isLibraryFilterMarkedEnabled = await window.electronAPI.loadSetting('isLibraryFilterMarkedEnabled') ?? false; // Default to false (show all)
        libraryFilterMarkedToggle.classList.toggle('active', isLibraryFilterMarkedEnabled);

        // Load always on top setting
        isAlwaysOnTop = await window.electronAPI.loadSetting('isAlwaysOnTop') ?? false; // Default to false
        // Update both buttons here
        mainMenuAlwaysOnTopToggle.classList.toggle('active', isAlwaysOnTop);
        toggleAlwaysOnTopButton.classList.toggle('active', isAlwaysOnTop);

        // NEW: Load startup mode setting
        startupMode = await window.electronAPI.loadSetting('startupMode') ?? 'lastUsedPath'; // Default to 'lastUsedPath'
        startupModeChoiceRadios.forEach(radio => {
            if (radio.value === startupMode) {
                radio.checked = true;
            }
        });

        // New: Load image marks
        imageMarks = await window.electronAPI.getImageMarks();

        // ** IMPORTANT: Determine initial view based on startup mode and saved paths **
        let initialPathToLoad = '';
        if (startupMode === 'defaultPath') {
            initialPathToLoad = currentDefaultImageFolderPath;
        } else { // 'lastUsedPath'
            initialPathToLoad = mainMenuSelectedFolderPath;
        }
        
        // Ensure mainMenuSelectedFolderPath reflects what is *actually* being loaded on startup
        // This is important for the main menu display if we directly go to folder browser view.
        mainMenuSelectedFolderPath = initialPathToLoad;


        if (initialPathToLoad) {
            // If there's a path, try to display the folder browser (image library)
            await showFolderBrowserView(initialPathToLoad); // Ensure to await loading
            // Update main menu display to reflect the loaded path, in case we return to it
            sketchFolderInputDisplay.textContent = mainMenuSelectedFolderPath; 
            
            // Also load images for playback purposes, as showFolderBrowserView primarily focuses on browsing
            try {
                const items = await window.electronAPI.readFolderImages(initialPathToLoad);
                let allImageFilesForPlayback = items.filter(item => item.type === 'file');
                allImageFilesForPlayback.sort((a, b) => naturalSort(a, b));
                imageFiles = allImageFilesForPlayback.map(file => ({ name: file.name, path: file.originalPath }));
                imageUrls = allImageFilesForPlayback.map(file => file.path);
            } catch (error) {
                console.error('Failed to load images for initial sketch session:', error);
                imageFiles = [];
                imageUrls = [];
                sketchFolderInputDisplay.textContent = '无法加载默认文件夹。请重新选择。';
                showCustomAlert('启动时无法加载默认文件夹或上次使用的文件夹。请尝试重新选择一个文件夹。', '加载错误');
                // If initial load fails, fall back to main menu
                showMainMenu();
            }
            updatePlaybackImagePool(); // Update playback pool after loading images
            updateMainMenuHintText(); // Update hint text

        } else {
            // No path to load (neither default nor last used), show main menu with "select folder" hint
            showMainMenu();
        }

    } else {
        // If not in Electron environment, use default values and show main menu
        applyTheme(false); // Default to dark theme
        mainMenuBackgroundChoice = 'solidColor'; // Default for non-Electron
        currentMainMenuBackgroundPath = ''; // Default for non-Electron
        previewBackgroundChoice = 'solidColor'; // Preview background defaults to empty
        currentPreviewBackgroundPath = '';
        gridColorPicker.value = defaultGridColorHex;
        setGridColor(defaultGridColorHex);
        gridSizeInput.value = defaultGridSize;
        setGridSize(defaultGridSize);
        currentTimeFormat = defaultTimeFormat;
        isCountdownHidden = false; // Default for non-Electron
        mainMenuSelectedFolderPath = ''; // No default in non-electron
        startupMode = 'lastUsedPath'; // Default for non-Electron

        // Set radio buttons for non-Electron defaults
        mainMenuBackgroundChoiceRadios.forEach(radio => {
            if (radio.value === mainMenuBackgroundChoice) {
                radio.checked = true;
            }
        });
        previewBackgroundChoiceRadios.forEach(radio => {
            if (radio.value === previewBackgroundChoice) {
                radio.checked = true;
            }
        });
        countdownVisibilityRadios.forEach(radio => { // Set default for countdown visibility
            if ((radio.value === 'show' && !isCountdownHidden)) {
                radio.checked = true;
            }
        });
        startupModeChoiceRadios.forEach(radio => { // NEW: Set startup mode radio for non-Electron
            if (radio.value === startupMode) {
                radio.checked = true;
            }
        });


        mainMenuStaticImagePathRow.style.display = 'none'; // Hide if not Electron
        staticImagePathRow.style.display = 'none'; // Hide if not Electron

        showMainMenu(); // Show main menu by default in non-Electron environment
    }

    // Initialize main menu button states
    mirrorToggle.classList.toggle('active', isMirrorEnabled);
    grayscaleToggle.classList.toggle('active', isGrayscaleEnabled);
    gridToggle.classList.toggle('active', isGridEnabled);
    overlayMirrorToggle.classList.toggle('active', isMirrorEnabled);
    overlayGrayscaleToggle.classList.toggle('active', isGrayscaleEnabled);
    overlayGridToggle.classList.toggle('active', isGridEnabled); /* Fixed typo here */

    // Initialize preset time buttons
    displayTime = 60; // Ensure displayTime is initialized for updatePresetTimeButtons
    updatePresetTimeButtons(displayTime); // Call with initial displayTime value
});

/**
 * Handles folder selection event from Main Menu via the new custom button.
 * This now correctly opens image library if selected, or dialog if not.
 */
sketchFolderInputDisplay.addEventListener('click', async () => {
    if (window.electronAPI) {
        if (mainMenuSelectedFolderPath) {
            // If a folder is already selected in main menu, directly open the image library to that path
            showFolderBrowserView(mainMenuSelectedFolderPath);
        } else {
            // No folder selected yet in main menu, open the OS folder dialog
            const folderPath = await window.electronAPI.openFolderDialog(currentDefaultImageFolderPath || undefined);
            if (folderPath) {
                // User selected a new folder, set it as the main menu's selected folder
                mainMenuSelectedFolderPath = folderPath;
                await window.electronAPI.saveSetting('mainMenuSelectedFolderPath', mainMenuSelectedFolderPath); // Save this selection
                
                // Update the display immediately
                sketchFolderInputDisplay.textContent = mainMenuSelectedFolderPath;
                
                // Load images for *this* newly selected path for playback purposes
                try {
                    const items = await window.electronAPI.readFolderImages(mainMenuSelectedFolderPath);
                    let allImageFilesForPlayback = items.filter(item => item.type === 'file');
                    allImageFilesForPlayback.sort((a, b) => naturalSort(a, b));
                    imageFiles = allImageFilesForPlayback.map(file => ({ name: file.name, path: file.originalPath }));
                    imageUrls = allImageFilesForPlayback.map(file => file.path);
                } catch (error) {
                    console.error('Failed to load images for newly selected folder:', error);
                    imageFiles = [];
                    imageUrls = [];
                    showCustomAlert('无法加载所选文件夹中的图片。请确保文件夹包含图片并尝试重新选择。', '加载错误');
                    sketchFolderInputDisplay.textContent = '无法加载，请重新选择...';
                    mainMenuSelectedFolderPath = ''; // Clear corrupted state
                }
                updatePlaybackImagePool(); // Recalculate playback pool
                updateMainMenuHintText(); // Update hint text

                // Finally, open the image library to the newly selected folder for browsing
                showFolderBrowserView(mainMenuSelectedFolderPath);
            } else {
                // User canceled selection, do nothing (main menu selection remains unchanged)
            }
        }
    } else {
        showCustomAlert('此功能仅在打包为桌面应用后可用。', '提示');
    }
});


/**
 * Starts the sketch session.
 * Validates settings, hides the menu, displays the image area, and starts playback.
 * This function is now also called from advanceImage and when starting from the main menu.
 */
function initiateSketchSession() {
    // displayTime is now controlled directly by preset button clicks,
    // or potentially from input field.
    // When infinite time is chosen, displayTime will be Infinity.
    if (displayTime !== Infinity && (isNaN(displayTime) || displayTime <= 0)) {
        showCustomAlert('请设置一个有效的图片显示时间 (大于0的整数)。', '时间设置错误');
        return;
    }
    
    // IMPORTANT: Re-populate the playback image pool to ensure the latest filter setting is applied
    // This is crucial if the filter was changed while in main menu, or after folder selection.
    updatePlaybackImagePool(); 

    if (currentPlaybackImageIndexes.length === 0) {
        // Determine the specific error message
        let errorMessage = '没有可供播放的图片。请选择一个图片文件夹或调整筛选设置。';
        let errorTitle = '图片缺失错误';

        if (imageUrls.length > 0 && isFilterMarkedEnabled) {
            // If images were loaded but all are filtered out by marking
            errorMessage = '该文件夹下图片已全部标记';
            errorTitle = '播放结束';
        } else if (imageUrls.length === 0) {
            // No images loaded at all (no folder selected or empty folder)
            errorMessage = '没有可供播放的图片。请先在图片库中选择一个文件夹。';
            errorTitle = '图片缺失错误';
        }

        showCustomAlert(errorMessage, errorTitle);
        stopGame(); // Stop the session if no images are available in the filtered pool
        return;
    }

    // Hide traffic lights when starting sketch session
    if (window.electronAPI) {
        window.electronAPI.setTrafficLightVisibility(false);
    }

    // Reset image history (should only contain indices from currentPlaybackImageIndexes)
    displayedImageHistory = [];
    historyPointer = -1;
    isPaused = false; // Ensure not paused when starting
    pausePlayButton.textContent = '⏸'; // Reset button icon to Pause

    controlsMenu.classList.add('hidden');
    folderBrowserView.classList.add('hidden');
    imageDisplayArea.classList.remove('hidden'); // Show image display area
    topRightMenuButtons.classList.add('hidden'); // Hide top-right menu buttons during playback
    
    // Clear background from body and apply to dynamic layer
    document.body.style.backgroundColor = 'transparent';
    document.body.style.backgroundImage = 'none'; // Ensure body background is clear
    updatePreviewBackground(); // Unified background update for dynamicBackgroundLayer
    updatePreviewBackgroundGrayscaleEffect(); // Ensure grayscale is applied to dynamicBackgroundLayer if enabled

    isPlaying = true;
    
    // Start with an image from the available (filtered) list
    advanceImage(true, false); // Pass true for isStartingNewSession, filteredIndexes is now implicitly handled
    updateNavigationButtons(); 
}

// Main menu start button now calls unified initiateSketchSession
startButton.addEventListener('click', initiateSketchSession);
// "Select this folder" button in image library view now returns to main menu and sets path
selectFolderForSketchAndReturnToMenuButton.addEventListener('click', async () => {
    // This button explicitly sets the current loaded folder as the main menu's selected folder
    mainMenuSelectedFolderPath = currentLoadedFolderPath;
    await window.electronAPI.saveSetting('mainMenuSelectedFolderPath', mainMenuSelectedFolderPath); // Save this selection
    showMainMenu(currentLoadedFolderPath); // Return to main menu and pass current loaded folder path
});


/**
 * Sets preset time and updates the input field.
 * Also handles the active state of buttons.
 * @param {number} time - Preset time (seconds or Infinity).
 * @param {HTMLElement} [activeButton] - The currently clicked button element. If not provided, it's inferred.
 */
function setPresetTime(time, activeButton = null) {
    displayTime = time;
    
    // When infinite time is selected, disable the number input and clear its value
    // The '∞' symbol will be shown in the countdown display instead.
    if (time === Infinity) {
        displayTimeInput.value = ''; // Clear value
        displayTimeInput.disabled = true;
    } else {
        displayTimeInput.value = time;
        displayTimeInput.disabled = false;
    }
    
    updatePresetTimeButtons(time, activeButton);
    updateMainMenuHintText(); // Update hint text when display time changes
}

/**
 * Updates the active and disabled state of preset time buttons based on the current displayTime.
 * This function ensures that only one preset button is active at a time, and that the numeric input
 * reflects the currently selected preset or a custom value. It also manages the disabled state
 * of the numeric input based on whether 'Infinity' is selected.
 * @param {number} currentDisplayTimeValue - The current value of displayTime (seconds or Infinity).
 * @param {HTMLElement} [clickedButton=null] - The button that was just clicked, if any.
 */
function updatePresetTimeButtons(currentDisplayTimeValue, clickedButton = null) {
    const presetButtons = presetTimeButtonsContainer.querySelectorAll('.toggle');
    
    // Remove 'active' and 'disabled-preset' from all buttons first
    presetButtons.forEach(btn => {
        btn.classList.remove('active', 'disabled-preset');
    });

    if (clickedButton) {
        // If a button was explicitly clicked, activate it
        clickedButton.classList.add('active');
    } else {
        // If the change came from the input field or initial load, find the matching preset
        // and activate it.
        let matched = false;
        presetButtons.forEach(btn => {
            // Safely parse textContent, handling '∞'
            const presetValue = (btn.id === 'presetInfiniteTime') ? Infinity : parseInt(btn.textContent, 10);
            if (currentDisplayTimeValue === presetValue) {
                btn.classList.add('active');
                matched = true;
            }
        });
    }

    // Ensure the number input field is enabled/disabled correctly based on whether 'Infinity' is selected.
    // This is also handled in setPresetTime, but explicitly setting it here for robustness
    displayTimeInput.disabled = (currentDisplayTimeValue === Infinity);
}

// Input event listener for displayTimeInput
displayTimeInput.addEventListener('input', (event) => {
    const inputValue = event.target.value;
    // When user types in the number input, it's always a finite number.
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue >= 1) { 
        displayTime = numValue;
    } else if (inputValue === '') { // Allow empty input temporarily (e.g., user is typing)
        displayTime = NaN; // Set to NaN or some indicator of invalid state
    }
    // If the input is not a valid number, we don't update displayTime,
    // so the last valid displayTime remains, or it becomes NaN.
    // The preset buttons logic will handle their activation based on the actual displayTime.

    updatePresetTimeButtons(displayTime); 
    updateMainMenuHintText(); 
});


/**
 * Opens the settings modal.
 */
settingsButton.addEventListener('click', () => {
    settingsModalOverlay.classList.add('active');
});

/**
 * Closes the settings modal.
 */
closeSettingsModalButton.addEventListener('click', () => {
    settingsModalOverlay.classList.remove('active');
});

/**
 * Toggles random/sequential playback.
 */
randomPlaybackToggle.addEventListener('click', async () => {
    isRandomPlayback = !isRandomPlayback;
    randomPlaybackToggle.classList.toggle('active', isRandomPlayback);
    if (window.electronAPI) {
        await window.electronAPI.saveSetting('isRandomPlayback', isRandomPlayback);
    }
    // If in playback mode, changing this will affect the NEXT image's selection.
    // No need to stop and restart immediately, as advanceImage already checks isRandomPlayback.
});

/**
 * Toggles filtering of marked images (for playback).
 */
filterMarkedToggle.addEventListener('click', async () => {
    isFilterMarkedEnabled = !isFilterMarkedEnabled;
    filterMarkedToggle.classList.toggle('active', isFilterMarkedEnabled);
    if (window.electronAPI) {
        await window.electronAPI.saveSetting('isFilterMarkedEnabled', isFilterMarkedEnabled);
    }
    // Always update the image pool when filter setting changes
    updatePlaybackImagePool();
    updateMainMenuHintText(); // Update hint text when filter changes

    // If currently in playback mode, stop and restart to apply the new filter immediately
    // If not playing, or in the main menu, the next 'Start Sketch' will use the updated pool.
    if (isPlaying) {
        stopGame(); // Stop current playback
        showCustomAlert('已更新图片筛选设置。请重新开始速写。', '设置更新');
    }
});

/**
 * Toggles between light and dark themes (from settings modal).
 */
settingsModalThemeToggle.addEventListener('click', () => {
    applyTheme(!isLightThemeEnabled); // Toggle the theme
});

// Event listener for main menu background choice radios
mainMenuBackgroundChoiceRadios.forEach(radio => {
    radio.addEventListener('change', async (event) => {
        mainMenuBackgroundChoice = event.target.value;
        if (window.electronAPI) {
            await window.electronAPI.saveSetting('mainMenuBackgroundChoice', mainMenuBackgroundChoice);
        }
        mainMenuStaticImagePathRow.style.display = (mainMenuBackgroundChoice === 'staticImage') ? 'flex' : 'none';
        // Only update background if currently in main menu or folder browser mode
        if (controlsMenu.classList.contains('hidden') && folderBrowserView.classList.contains('hidden')) {
            // Is in image display area, do nothing
        } else { 
            updateMainMenuBackground();
        }
        if (mainMenuBackgroundChoice === 'staticImage') {
            mainMenuBackgroundPathDisplay.value = currentMainMenuBackgroundPath || '未选择静态图片';
        }
    });
});

/**
 * Handles selecting a static image for main menu background.
 */
selectMainMenuImageButton.addEventListener('click', async () => {
    if (window.electronAPI) {
        const filePath = await window.electronAPI.openFileDialog();
        if (filePath) {
            currentMainMenuBackgroundPath = filePath;
            mainMenuBackgroundPathDisplay.value = filePath;
            await window.electronAPI.saveSetting('mainMenuBackgroundPath', currentMainMenuBackgroundPath);
            // Only update background if currently in main menu or folder browser mode
            if (controlsMenu.classList.contains('hidden') && folderBrowserView.classList.contains('hidden')) {
                // Is in image display area, do nothing
            } else { 
                updateMainMenuBackground();
            }
            showCustomAlert('主菜单静态图片背景已更新并保存。', '背景设置');
        }
    } else {
        showCustomAlert('此功能仅在打包为桌面应用后可用。', '提示');
    }
});

/**
 * Clears the selected static image for main menu background.
 */
clearMainMenuImageButton.addEventListener('click', async () => {
    currentMainMenuBackgroundPath = '';
    mainMenuBackgroundPathDisplay.value = '未选择静态图片';
    if (window.electronAPI) {
        await window.electronAPI.saveSetting('mainMenuBackgroundPath', '');
    }
    // Only update background if currently in main menu or folder browser mode
    if (controlsMenu.classList.contains('hidden') && folderBrowserView.classList.contains('hidden')) {
        // Is in image display area, do nothing
    } else { 
        updateMainMenuBackground();
    }
    showCustomAlert('主菜单静态图片背景已清除，将显示纯色背景。', '背景设置');
});


// Event listener for preview background choice radios
previewBackgroundChoiceRadios.forEach(radio => {
    radio.addEventListener('change', async (event) => {
        previewBackgroundChoice = event.target.value;
        if (window.electronAPI) {
            await window.electronAPI.saveSetting('previewBackgroundChoice', previewBackgroundChoice);
        }
        // Show/hide staticImagePathRow based on selection
        staticImagePathRow.style.display = (previewBackgroundChoice === 'staticImage') ? 'flex' : 'none';

        // If currently in preview mode, immediately update background based on new choice
        if (!imageDisplayArea.classList.contains('hidden')) {
            updatePreviewBackground(); // This will handle applying solid, static or average color background
            updatePreviewBackgroundGrayscaleEffect(); // Also update grayscale effect for background
        }
        
        // If switching away from staticImage, clear the path in memory (but not from storage immediately)
        // This ensures "纯色" behaves as expected and "平均色" doesn't try to use an old path.
        if (previewBackgroundChoice !== 'staticImage') {
            // currentPreviewBackgroundPath = ''; // Don't clear from memory, keep it for next time user selects static image
        } else {
            // When switching TO staticImage, ensure path display is correct
            previewBackgroundPathDisplay.value = currentPreviewBackgroundPath || '未选择静态图片';
        }
    });
});

/**
 * Handles selecting a static image for preview background.
 */
selectStaticImageButton.addEventListener('click', async () => {
    if (window.electronAPI) {
        const filePath = await window.electronAPI.openFileDialog();
        if (filePath) {
            currentPreviewBackgroundPath = filePath;
            previewBackgroundPathDisplay.value = filePath;
            await window.electronAPI.saveSetting('previewBackgroundPath', currentPreviewBackgroundPath);
            if (!imageDisplayArea.classList.contains('hidden') && previewBackgroundChoice === 'staticImage') {
                applyBackground(dynamicBackgroundLayer, 'staticImage', currentPreviewBackgroundPath);
            }
            showCustomAlert('静态图片背景已更新并保存。', '背景设置');
        } else {
            // User canceled selection, do nothing
        }
    } else {
        showCustomAlert('此功能仅在打包为桌面应用后可用。', '提示');
    }
});

/**
 * Clears the selected static image for preview background.
 * This effectively makes it "pure color" again (default themed solid).
 */
clearStaticImageButton.addEventListener('click', async () => {
    currentPreviewBackgroundPath = '';
    previewBackgroundPathDisplay.value = '未选择静态图片';
    if (window.electronAPI) {
        await window.electronAPI.saveSetting('previewBackgroundPath', '');
    }
    if (!imageDisplayArea.classList.contains('hidden') && previewBackgroundChoice === 'staticImage') {
        applyBackground(dynamicBackgroundLayer, 'previewSolid'); // Apply default solid color
    }
    showCustomAlert('静态图片背景已清除，将显示纯色背景。', '背景设置');
});

// NEW: Event listener for startup mode radios
startupModeChoiceRadios.forEach(radio => {
    radio.addEventListener('change', async (event) => {
        startupMode = event.target.value;
        if (window.electronAPI) {
            await window.electronAPI.saveSetting('startupMode', startupMode);
        }
        // Removed showCustomAlert: The user requested to remove this pop-up.
    });
});


/**
 * Set default image folder path
 */
setDefaultImageFolderButton.addEventListener('click', async () => {
    if (window.electronAPI) {
        // When opening folder selection dialog, default to current set path
        const folderPath = await window.electronAPI.openFolderDialog(currentDefaultImageFolderPath || undefined);
        if (folderPath) {
            currentDefaultImageFolderPath = folderPath;
            await window.electronAPI.saveSetting('defaultImageFolderPath', folderPath);
            defaultImageFolderPathDisplay.value = folderPath;
            // When setting a new default, also make it the current mainMenuSelectedFolderPath
            // This ensures if '上次路径' is selected, it points to the newly set default.
            mainMenuSelectedFolderPath = folderPath;
            await window.electronAPI.saveSetting('mainMenuSelectedFolderPath', mainMenuSelectedFolderPath); // Save this selection
            showCustomAlert('默认图片文件夹路径已设置并保存。下次启动将自动加载。', '默认路径设置');
            // After setting, if currently in main menu or image library, should refresh image library view to display new default path content
            if (!controlsMenu.classList.contains('hidden') || !folderBrowserView.classList.contains('hidden')) {
                showMainMenu(); // Show main menu, which will load images from the new default path
            }
        } else {
            // User canceled selection, do nothing (keep silent)
        }
    } else {
        showCustomAlert('此功能仅在打包为桌面应用后可用。', '提示');
    }
});

/**
 * Clear default image folder path
 */
clearDefaultImageFolderButton.addEventListener('click', async () => {
    currentDefaultImageFolderPath = '';
    await window.electronAPI.saveSetting('defaultImageFolderPath', '');
    defaultImageFolderPathDisplay.value = '未设置默认路径';
    // When clearing default, also clear mainMenuSelectedFolderPath if it was pointing to the default one
    // This condition prevents clearing mainMenuSelectedFolderPath if the user explicitly selected a *different* folder.
    if (mainMenuSelectedFolderPath === currentDefaultImageFolderPath) { 
        mainMenuSelectedFolderPath = ''; 
        await window.electronAPI.saveSetting('mainMenuSelectedFolderPath', mainMenuSelectedFolderPath);
    }
    showCustomAlert('默认图片文件夹路径已清除。下次启动将显示主菜单。', '默认路径设置');
    // After clearing, if currently in image library view, should return to main menu
    if (!folderBrowserView.classList.contains('hidden')) {
        showMainMenu(); // Show main menu, which will now be in "no folder selected" state
    }
});

/**
 * Grid color picker change event
 */
gridColorPicker.addEventListener('input', (event) => {
    setGridColor(event.target.value); 
});

/**
 * Grid size input change event
 */
gridSizeInput.addEventListener('input', (event) => {
    const size = parseInt(event.target.value, 10);
    if (!isNaN(size) && size >= 10 && size <= 200) { 
        setGridSize(size);
    } else {
        console.warn('Invalid grid size input.');
    }
});

/**
 * Resets grid color and size to default.
 */
resetGridSettingsButton.addEventListener('click', () => {
    gridColorPicker.value = defaultGridColorHex;
    setGridColor(defaultGridColorHex);
    gridSizeInput.value = defaultGridSize;
    setGridSize(defaultGridSize);
    showCustomAlert('网格设置已重置为默认。', '网格设置');
});

/**
 * Time format radio button change event
 */
timeFormatRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        setTimeFormat(event.target.value);
    });
});

/**
 * NEW: Countdown visibility radio button change event
 */
countdownVisibilityRadios.forEach(radio => {
    radio.addEventListener('change', async (event) => {
        isCountdownHidden = (event.target.value === 'hide');
        if (window.electronAPI) {
            await window.electronAPI.saveSetting('isCountdownHidden', isCountdownHidden);
        }
        updateCountdownDisplay(); // Update display immediately
    });
});

/**
 * Toggles mirror effect.
 */
function toggleMirrorEffect() {
    isMirrorEnabled = !isMirrorEnabled;
    currentImage.classList.toggle('mirror-effect', isMirrorEnabled);
    mirrorToggle.classList.toggle('active', isMirrorEnabled);
    overlayMirrorToggle.classList.toggle('active', isMirrorEnabled);
}
mirrorToggle.addEventListener('click', toggleMirrorEffect);
overlayMirrorToggle.addEventListener('click', toggleMirrorEffect);

/**
 * Toggles grayscale effect.
 */
function toggleGrayscaleEffect() {
    isGrayscaleEnabled = !isGrayscaleEnabled;
    currentImage.classList.toggle('grayscale-effect', isGrayscaleEnabled);
    grayscaleToggle.classList.toggle('active', isGrayscaleEnabled);
    overlayGrayscaleToggle.classList.toggle('active', isGrayscaleEnabled);
    updatePreviewBackgroundGrayscaleEffect(); // <--- Update background grayscale
}
grayscaleToggle.addEventListener('click', toggleGrayscaleEffect);
overlayGrayscaleToggle.addEventListener('click', toggleGrayscaleEffect);

/**
 * Toggles grid overlay effect.
 */
function toggleGridEffect() {
    isGridEnabled = !isGridEnabled;
    gridCanvas.classList.toggle('active', isGridEnabled);
    gridToggle.classList.toggle('active', isGridEnabled);
    overlayGridToggle.classList.toggle('active', isGridEnabled);
    if (isGridEnabled) {
        if (currentImage.complete && currentImage.naturalWidth > 0) { // Check naturalWidth for fully loaded
            drawGrid();
        }
    } else {
        ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height); 
    }
}
gridToggle.addEventListener('click', toggleGridEffect);
overlayGridToggle.addEventListener('click', toggleGridEffect);

/**
 * Toggles window always-on-top status.
 * Updates both the main menu button and the overlay button.
 */
function toggleAlwaysOnTop() {
    isAlwaysOnTop = !isAlwaysOnTop;
    if (window.electronAPI) { 
        window.electronAPI.setAlwaysOnTop(isAlwaysOnTop);
        // Also save the setting for persistence
        window.electronAPI.saveSetting('isAlwaysOnTop', isAlwaysOnTop);
    } else {
        showCustomAlert('此功能仅在打包为桌面应用后可用。', '提示');
    }
    // Update both UI elements
    mainMenuAlwaysOnTopToggle.classList.toggle('active', isAlwaysOnTop);
    toggleAlwaysOnTopButton.classList.toggle('active', isAlwaysOnTop);
}
toggleAlwaysOnTopButton.addEventListener('click', toggleAlwaysOnTop);
mainMenuAlwaysOnTopToggle.addEventListener('click', toggleAlwaysOnTop);

// Listen for always-on-top status from main process to sync button state
if (window.electronAPI) {
    window.electronAPI.onAlwaysOnTopStatus((status) => {
        isAlwaysOnTop = status;
        mainMenuAlwaysOnTopToggle.classList.toggle('active', isAlwaysOnTop);
        toggleAlwaysOnTopButton.classList.toggle('active', isAlwaysOnTop);
    });
}

/**
 * Opens the current image in Finder.
 */
openInFinderButton.addEventListener('click', () => {
    if (window.electronAPI && currentImageIndex !== -1 && imageFiles[currentImageIndex] && imageFiles[currentImageIndex].path) {
        // Use originalPath to open file, because file:// URL cannot be directly used in Finder
        const currentFilePath = imageFiles[currentImageIndex].path; 
        window.electronAPI.openFileInFinder(currentFilePath);
    } else {
        showCustomAlert('此功能仅在打包为桌面应用后可用，且需要选择图片文件夹。', '提示');
    }
});

// New: Mark Star button click handler
markStarButton.addEventListener('click', async () => {
    if (window.electronAPI && currentImageIndex !== -1 && imageFiles[currentImageIndex]) {
        const filePath = imageFiles[currentImageIndex].path;
        const imageName = imageFiles[currentImageIndex].name; // Get image name

        // Check if current image is already marked
        const isMarked = imageMarks[filePath] && imageMarks[filePath].length > 0;

        if (isMarked) {
            // If marked, clear all marks for this image
            await window.electronAPI.clearImageMarksForPath(filePath);
            // After clearing, reload marks and update playback pool (if filter is active)
            imageMarks = await window.electronAPI.getImageMarks();
            updatePlaybackImagePool(); // Re-calculate playback pool
        } else {
            // If not marked, add a new mark
            // For infinite mode, the duration is not relevant for auto-marking, but we still store it.
            const duration = (displayTime === Infinity) ? 0 : displayTime; // Store 0 for infinite, actual duration otherwise
            await window.electronAPI.saveImageMark(filePath, duration);
            // After saving, reload marks and update playback pool (if filter is active)
            imageMarks = await window.electronAPI.getImageMarks();
            updatePlaybackImagePool(); // Re-calculate playback pool
        }
        updateMarkingUI(); // Update UI immediately
        updateMainMenuHintText(); // Update hint text when marking changes
        // Important: Re-render the folder browser view to update folder completion marks
        if (!folderBrowserView.classList.contains('hidden')) {
            await showFolderBrowserView(currentLoadedFolderPath); 
        }
    } else {
        // Keep the alert for actual operation failure, not just UI feedback
        showCustomAlert('无法操作标记。请确保已选择图片文件夹并开始速写。', '操作失败');
    }
});


/**
 * Updates the UI related to image marking (icon state and tooltip).
 */
function updateMarkingUI() {
    const markIconSpan = markStarButton.querySelector('.mark-icon'); // Get the span for icon
    if (currentImageIndex === -1 || !imageFiles[currentImageIndex]) {
        markStarButton.classList.remove('active'); // No active class
        markStarButton.setAttribute('data-tooltip', '未标记');
        return;
    }

    const currentImagePath = imageFiles[currentImageIndex].path;
    const marks = imageMarks[currentImagePath];

    if (marks && marks.length > 0) {
        markStarButton.classList.add('active'); // Add 'active' class to change background
        // Sort marks by timestamp to get the latest one
        marks.sort((a, b) => b.timestamp - a.timestamp);
        const latestMark = marks[0];
        const date = new Date(latestMark.timestamp);
        
        // Format timestamp into readable date/time (MM/DD)
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const formattedDateShort = `${month}/${day}`;

        // Show "∞" for duration if it was marked in infinite mode (duration 0)
        const displayDuration = (latestMark.duration === 0) ? '∞' : `${latestMark.duration}s`;

        // Construct a detailed tooltip string in the requested format
        markStarButton.setAttribute('data-tooltip', `${formattedDateShort} (${displayDuration})`);
    } else {
        markStarButton.classList.remove('active'); // Remove 'active' class
        markStarButton.setAttribute('data-tooltip', '未标记');
    }
}

/**
 * Updates the global currentPlaybackImageIndexes array based on the filter setting.
 * This function should be called whenever the selected folder changes or the filter setting changes.
 */
function updatePlaybackImagePool() {
    currentPlaybackImageIndexes = [];
    for (let i = 0; i < imageUrls.length; i++) {
        const filePath = imageFiles[i].path;
        // If filter is enabled AND image is marked, skip it
        if (isFilterMarkedEnabled && imageMarks[filePath] && imageMarks[filePath].length > 0) {
            continue; 
        }
        currentPlaybackImageIndexes.push(i); // Add the raw index to the eligible list
    }
    // Sort the eligible indices based on the original file names for sequential playback consistency
    currentPlaybackImageIndexes.sort((a, b) => naturalSort(imageFiles[a], imageFiles[b])); // Pass whole object for naturalSort
    
    // Re-enable/disable start button based on the filtered list length
    startButton.disabled = (currentPlaybackImageIndexes.length === 0);

    // Update tooltip for the start button
    if (startButton.disabled) {
        if (imageUrls.length > 0 && isFilterMarkedEnabled && currentPlaybackImageIndexes.length === 0) {
            // All images exist, filter is on, and all are marked
            startButton.setAttribute('data-tooltip', '该文件夹下图片已全部标记');
        } else if (imageUrls.length > 0 && currentPlaybackImageIndexes.length === 0) {
            // Images exist, filter is off, but still no playable images (e.g., all were already filtered out without marking)
            // This case should ideally not happen if filtering is the *only* reason for empty pool and images exist.
            // Fallback to a generic "no playable images"
            startButton.setAttribute('data-tooltip', '没有可播放的图片');
        } else {
            // No folder selected or empty folder
            startButton.setAttribute('data-tooltip', '请选择速写文件夹');
        }
    } else {
        startButton.setAttribute('data-tooltip', '开始速写');
    }
}

/**
 * Formats total seconds into H:M:S, M:S, or S based on duration.
 * @param {number} totalSeconds - The total number of seconds.
 * @returns {string} - Formatted time string.
 */
function formatTimeForHint(totalSeconds) {
    if (totalSeconds === Infinity) {
        return '无限制时间';
    } else if (totalSeconds < 60) {
        return `${totalSeconds}秒`;
    } else if (totalSeconds < 3600) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}分${seconds}秒`;
    } else {
        const hours = Math.floor(totalSeconds / 3600);
        const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${hours}小时${remainingMinutes}分${remainingSeconds}秒`;
    }
}

/**
 * Updates the hint text in the main menu based on selected images and time.
 */
function updateMainMenuHintText() {
    const numImages = currentPlaybackImageIndexes.length;
    let hintText = '';

    if (mainMenuSelectedFolderPath && numImages > 0) {
        if (displayTime === Infinity) {
            hintText = `当前一共选择了${numImages}张图片，时间设置为无限制。`;
        } else {
            const estimatedTotalTimeSeconds = numImages * displayTime;
            const formattedEstimatedTime = formatTimeForHint(estimatedTotalTimeSeconds);
            hintText = `当前一共选择了${numImages}张图片，估计耗时${formattedEstimatedTime}。`;
        }
    } else if (mainMenuSelectedFolderPath && numImages === 0 && imageUrls.length > 0 && isFilterMarkedEnabled) {
        // Folder selected, but all images are filtered out by marking
        hintText = '该文件夹下图片已全部标记。请调整过滤设置或选择其他文件夹。';
    } else if (mainMenuSelectedFolderPath && numImages === 0 && imageUrls.length === 0) {
         // Folder selected, but no images were found at all
        hintText = '当前文件夹中没有可速写的图片。';
    }
    else {
        hintText = '选择文件夹以开始速写。';
    }
    mainMenuHintText.textContent = hintText;
}


/**
 * Displays the next image in sequence or a random one, based on the playback mode.
 * This function handles both automatic advancement (from timer) and manual 'next' clicks.
 * It always operates on the `currentPlaybackImageIndexes` list.
 * @param {boolean} isStartingNewSession - True if this call initiates a new sketch session.
 * @param {boolean} isTimerTriggered - True if called by the timer (for auto-marking).
 */
async function advanceImage(isStartingNewSession = false, isTimerTriggered = false) {
    // First, re-check currentPlaybackImageIndexes in case the image was marked/unmarked mid-session
    updatePlaybackImagePool(); 

    if (currentPlaybackImageIndexes.length === 0) {
        // Determine the specific error message
        let errorMessage = '没有可供播放的图片。请选择一个图片文件夹或调整筛选设置。';
        let errorTitle = '图片缺失错误';

        if (imageUrls.length > 0 && isFilterMarkedEnabled) {
            // If images were loaded but all are filtered out by marking
            errorMessage = '该文件夹下图片已全部标记';
            errorTitle = '播放结束';
        } else if (imageUrls.length === 0) {
            // No images loaded at all (no folder selected or empty folder)
            errorMessage = '没有可供播放的图片。请先在图片库中选择一个文件夹。';
            errorTitle = '图片缺失错误';
        }

        showCustomAlert(errorMessage, errorTitle);
        stopGame(); // Stop the session if no images are available in the filtered pool
        return;
    }

    // Only mark automatically if the timer triggered the advance (isTimerTriggered is true)
    // AND it's not infinite mode AND it's not a brand new session start or initial load.
    if (isTimerTriggered && currentImageIndex !== -1 && isPlaying && !isPaused && displayTime !== Infinity) {
        const finishedImagePath = imageFiles[currentImageIndex].path;
        const finishedDuration = displayTime;
        await window.electronAPI.saveImageMark(finishedImagePath, finishedDuration);
        imageMarks = await window.electronAPI.getImageMarks(); // Reload marks
        updatePlaybackImagePool(); // Crucial: Re-evaluate playback pool after marking
    }

    let newIndexRaw; // This will be the index in the original imageUrls array

    if (isStartingNewSession) {
        displayedImageHistory = []; // Clear history
        historyPointer = -1; // Reset pointer

        if (isRandomPlayback) {
            newIndexRaw = currentPlaybackImageIndexes[Math.floor(Math.random() * currentPlaybackImageIndexes.length)];
        } else {
            newIndexRaw = currentPlaybackImageIndexes[0]; // Always start from the first eligible image
        }
        displayedImageHistory.push(newIndexRaw);
        historyPointer = 0;

    } else { // Not starting a new session (timer tick or manual 'next' click)
        if (!isRandomPlayback) {
            // Find the current image's index within the *current* filtered playback pool
            const currentPlaybackIndexInPool = currentPlaybackImageIndexes.indexOf(currentImageIndex);
            
            if (currentPlaybackIndexInPool === -1 || historyPointer >= displayedImageHistory.length -1) {
                // Case 1: Current image is no longer in the playback pool (e.g., just marked it).
                // Or Case 2: We are at the end of the history.
                // Find the next image in the *current* sorted playback pool.
                let nextPlaybackIndex = (currentPlaybackIndexInPool + 1) % currentPlaybackImageIndexes.length;
                // If we are at the end of the filtered list, wrap around to the beginning for sequential
                newIndexRaw = currentPlaybackImageIndexes[nextPlaybackIndex % currentPlaybackImageIndexes.length];
                
                // If current image was not in pool, or we're at end of history,
                // clear future history and add the new image
                if (historyPointer < displayedImageHistory.length -1) {
                    displayedImageHistory = displayedImageHistory.slice(0, historyPointer + 1);
                }
                displayedImageHistory.push(newIndexRaw);
                historyPointer = displayedImageHistory.length - 1;

            } else {
                // Normal sequential progression within history
                historyPointer++;
                newIndexRaw = displayedImageHistory[historyPointer];
            }
        } else {
            // Random playback: Pick a new random image from the filtered list
            if (currentPlaybackImageIndexes.length === 1) {
                newIndexRaw = currentPlaybackImageIndexes[0];
            } else {
                const previousRawIndex = currentImageIndex;
                let tempNewIndexRaw;
                do {
                    tempNewIndexRaw = currentPlaybackImageIndexes[Math.floor(Math.random() * currentPlaybackImageIndexes.length)];
                } while (tempNewIndexRaw === previousRawIndex && currentPlaybackImageIndexes.length > 1);
                newIndexRaw = tempNewIndexRaw;
            }

            // Truncate history if navigating back then picking random
            if (historyPointer < displayedImageHistory.length - 1) {
                displayedImageHistory = displayedImageHistory.slice(0, historyPointer + 1);
            }
            displayedImageHistory.push(newIndexRaw);
            historyPointer = displayedImageHistory.length - 1;
        }
    }

    currentImageIndex = newIndexRaw;
    currentImage.src = imageUrls[currentImageIndex];
    updateImageDisplay(); // <--- Call this here to handle effects and average background
    remainingTime = displayTime; // remainingTime will be Infinity if displayTime is Infinity
    updateCountdownDisplay();
    updateNavigationButtons();
    updateMarkingUI();

    if (isPaused) {
        isPaused = false;
        pausePlayButton.textContent = '⏸'; // Reset button icon to Pause
    }
    startCountdown();
}

/**
 * Displays the previous image in history.
 * This function always navigates backward through the recorded history.
 */
function showPreviousImage() {
    if (historyPointer > 0) {
        clearInterval(countdownTimer);
        historyPointer--;
        currentImageIndex = displayedImageHistory[historyPointer];
        currentImage.src = imageUrls[currentImageIndex];
        updateImageDisplay(); // <--- Call this here to handle effects and average background
        remainingTime = displayTime; // Reset time for a new image from history (can be Infinity)
        updateCountdownDisplay();
        updateMarkingUI(); // New: Update marking UI after image changes

        // Ensure playback state (resume if was paused, otherwise keep playing)
        if (!isPaused) { // Only restart countdown if not explicitly paused
            startCountdown();
        }
    } else {
        showCustomAlert('已是第一张图片。', '播放提示'); // User-friendly message
    }
    updateNavigationButtons();
}

// Navigation button event listeners
preset30sButton.addEventListener('click', (event) => setPresetTime(30, event.target));
preset60sButton.addEventListener('click', (event) => setPresetTime(60, event.target));
preset120sButton.addEventListener('click', (event) => setPresetTime(120, event.target));
preset300sButton.addEventListener('click', (event) => setPresetTime(300, event.target)); 
preset600sButton.addEventListener('click', (event) => setPresetTime(600, event.target)); 
presetInfiniteTime.addEventListener('click', (event) => setPresetTime(Infinity, event.target)); // Event for infinite button

// Main menu start button now calls unified initiateSketchSession
startButton.addEventListener('click', initiateSketchSession);
// "Select this folder" button in image library view now returns to main menu and sets path
selectFolderForSketchAndReturnToMenuButton.addEventListener('click', async () => {
    // This button explicitly sets the current loaded folder as the main menu's selected folder
    mainMenuSelectedFolderPath = currentLoadedFolderPath;
    await window.electronAPI.saveSetting('mainMenuSelectedFolderPath', mainMenuSelectedFolderPath); // Save this selection
    showMainMenu(currentLoadedFolderPath); // Return to main menu and pass current loaded folder path
});

// Navigation button event listeners
prevImageButton.addEventListener('click', showPreviousImage);
// Modified nextImageButton to NOT trigger auto-marking
nextImageButton.addEventListener('click', () => advanceImage(false, false)); // Manual next click, not timer triggered

/**
 * Toggles pause/play for the countdown.
 */
function togglePausePlay() { // Renamed for clarity, logic is the same
    if (isPaused) {
        // Currently paused, click to play
        isPaused = false;
        pausePlayButton.textContent = '⏸'; // Switch to Pause icon
        startCountdown(); // Resume from current remainingTime
    } else {
        // Currently playing, click to pause
        isPaused = true;
        pausePlayButton.textContent = '▶'; // Switch to Play icon
        clearInterval(countdownTimer);
    }
    updateNavigationButtons(); 
}
pausePlayButton.addEventListener('click', togglePausePlay);


/**
 * Starts the countdown.
 * This function now always uses the current 'remainingTime'.
 * 'remainingTime' is set to 'displayTime' only when a new image is loaded (in advanceImage).
 */
function startCountdown() {
    clearInterval(countdownTimer); 
    // If in infinite mode, or explicitly paused, do not start the interval
    if (displayTime === Infinity || isPaused) { 
        return;
    }

    // remainingTime is already set by advanceImage, or it's the value from before pausing.
    updateCountdownDisplay(); // Update display immediately when starting/resuming

    countdownTimer = setInterval(async () => { // Made async to await saveImageMark
        remainingTime--;
        updateCountdownDisplay();

        if (remainingTime <= 0) {
            clearInterval(countdownTimer); 
            // Automatically mark image as sketched ONLY when timer runs out AND it's not infinite mode
            if (currentImageIndex !== -1 && imageFiles[currentImageIndex] && displayTime !== Infinity) {
                const finishedImagePath = imageFiles[currentImageIndex].path;
                const finishedDuration = displayTime;
                await window.electronAPI.saveImageMark(finishedImagePath, finishedDuration);
                // After saving, reload marks and update playback pool (if filter is active)
                imageMarks = await window.electronAPI.getImageMarks();
                updatePlaybackImagePool(); // Crucial: Re-evaluate playback pool after marking
            }
            advanceImage(false, true); // Advance, and signal it's timer triggered for auto-marking
        }
    }, 1000); 
}

/**
 * Updates the countdown display text.
 */
function updateCountdownDisplay() {
    if (isCountdownHidden) { // NEW: If countdown is set to be hidden
        countdownElement.textContent = ''; // Clear text content
        return; // Exit function
    }
    if (displayTime === Infinity) {
        countdownElement.textContent = ''; // Empty string for infinite time
    } else if (currentTimeFormat === 'hours:minutes:seconds' && remainingTime >= 60) { // If time is 60s or more, use H:M:S
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;
        let display = '';
        if (hours > 0) {
            display += `${hours.toString().padStart(2, '0')}:`;
        }
        display += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        countdownElement.textContent = display;
    } else { // 'seconds' format OR 'hours:minutes:seconds' but < 60s
        countdownElement.textContent = `${remainingTime}`;
    }
}

/**
 * Applies currently set image effects.
 */
function applyImageEffects() {
    currentImage.classList.remove('mirror-effect', 'grayscale-effect');
    if (isMirrorEnabled) currentImage.classList.add('mirror-effect');
    if (isGrayscaleEnabled) currentImage.classList.add('grayscale-effect');
    // Grid drawing is now handled in updateImageDisplay
}

/**
 * Updates the current image display, applying effects and calculating average background color.
 */
function updateImageDisplay() {
    applyImageEffects(); // Apply mirror/grayscale

    // Clear previous onload/onerror to prevent multiple calls or outdated contexts
    // This is important to prevent "图片加载错误" when clearing src on stopGame()
    currentImage.onload = null;
    currentImage.onerror = null;

    // This will trigger after the image has loaded, ensuring its pixel data is available
    currentImage.onload = () => {
        if (isGridEnabled) {
            drawGrid();
        }
        updatePreviewBackground(); // Unified background update after image loads
        updatePreviewBackgroundGrayscaleEffect(); // <--- Apply grayscale to background after it's set
    };
    // Handle cases where the image might already be cached and onload doesn't fire
    if (currentImage.complete && currentImage.naturalWidth > 0) { // Check naturalWidth for fully loaded
        currentImage.onload(); // Manually trigger if already complete
    } else {
        // If not complete, ensure initial background is set
        updatePreviewBackground();
        updatePreviewBackgroundGrayscaleEffect(); // <--- Apply grayscale to background if image not loaded yet
    }

    // Handle image loading errors (e.g., corrupted file)
    currentImage.onerror = () => {
        // Only show alert and advance if we are actually playing and expecting an image
        // Check for valid image URL patterns to avoid false positives from clearing src
        if (isPlaying && imageFiles[currentImageIndex] && currentImage.src.startsWith('file://') && currentImage.src.match(/\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)$/i)) {
            console.error(`Error loading image: ${imageFiles[currentImageIndex]?.name || 'Unknown File Path'}: ${currentImage.src}`);
            showCustomAlert(`无法加载图片：${imageFiles[currentImageIndex]?.name || '未知文件'}。已跳过。`, '图片加载错误');
            // Skip to next image automatically if there's a loading error
            // Use a short timeout to prevent rapid recursion if many images are broken
            setTimeout(() => advanceImage(false, false), 500); 
        } else {
            // This is likely a non-critical error (e.g., src cleared on exit, or non-image URL)
            // console.warn(`Non-critical image loading issue or src cleared: ${currentImage.src}`); // For debugging non-critical cases
        }
    };
}

/**
 * Updates the enabled/disabled state of navigation buttons.
 */
function updateNavigationButtons() {
    // Check if there's sufficient history to go back
    prevImageButton.disabled = (historyPointer <= 0);
    
    // Next button is disabled if no images are left in the filtered pool
    // OR if we are at the end of the history AND there's only one image in the current filtered pool (to prevent infinite looping with 'next' on single item)
    // OR if we are at the very last image in the filtered sequence (for sequential playback)
    let disableNext = currentPlaybackImageIndexes.length === 0;
    if (!isRandomPlayback && currentPlaybackImageIndexes.length > 0) {
        // Find the index of the current image within the *sorted* currentPlaybackImageIndexes
        const currentFilteredIndex = currentPlaybackImageIndexes.indexOf(currentImageIndex);
        if (currentFilteredIndex !== -1 && currentFilteredIndex === currentPlaybackImageIndexes.length - 1) {
            disableNext = true; // If it's the last image in sequence, disable next
        }
    } else if (currentPlaybackImageIndexes.length === 1 && currentPlaybackImageIndexes[0] === currentImageIndex) {
         // If there's only one image left, and it's currently displayed, disable next
         disableNext = true;
    }


    nextImageButton.disabled = disableNext;

    // Pause/Play button should be disabled if no playable images at all.
    // If in infinite mode, it should always be enabled to allow manual pause/play.
    pausePlayButton.disabled = (currentPlaybackImageIndexes.length === 0 || (!isPlaying && displayTime !== Infinity));
}

/**
 * Draws the grid on the canvas.
 * The grid adapts to the actual display size of the current image.
 */
function drawGrid() {
    const imageRect = currentImage.getBoundingClientRect();
    
    gridCanvas.width = imageRect.width;
    gridCanvas.height = imageRect.height;

    ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height); 

    if (!isGridEnabled) return; 

    ctx.lineWidth = 1;

    // Use themed grid color
    ctx.strokeStyle = hexToRgba(currentGridColorHex, gridAlpha);

    for (let x = 0; x < gridCanvas.width; x += currentGridSize) { 
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, gridCanvas.height);
        ctx.stroke();
    }

    for (let y = 0; y < gridCanvas.height; y += currentGridSize) { 
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(gridCanvas.width, y); // Fix: line should go full width
        ctx.stroke();
    }
}

/**
 * Stops the current sketch session and returns to the main menu.
 */
function stopGame() {
    clearInterval(countdownTimer); 
    isPlaying = false;
    isPaused = false; // Reset pause state when returning to menu
    pausePlayButton.textContent = '⏸'; // Reset button icon to Pause

    // Crucial: Clear the image source and remove event listeners FIRST
    currentImage.src = ''; 
    currentImage.onload = null; // Remove onload to prevent it firing when src is cleared
    currentImage.onerror = null; // Remove onerror to prevent false alarms

    imageDisplayArea.classList.add('hidden'); 
    controlsMenu.classList.remove('hidden'); 
    folderBrowserView.classList.add('hidden'); // Ensure image library view is also hidden
    topRightMenuButtons.classList.remove('hidden'); // Show top-right menu buttons when returning to main menu
    console.log('Sketch session stopped.');

    // Clear background from dynamic layer and apply main menu background to body
    dynamicBackgroundLayer.style.backgroundImage = 'none';
    dynamicBackgroundLayer.style.backgroundColor = 'transparent';
    dynamicBackgroundLayer.classList.remove('grayscale-active-bg'); // Ensure grayscale is off for this layer
    updateMainMenuBackground(); // Restore main menu background to body

    updateNavigationButtons(); 
    updateMarkingUI(); // Reset marking UI when returning to menu
    updatePlaybackImagePool(); // Re-evaluate button tooltips on main menu
    updateMainMenuHintText(); // Update hint text when returning to main menu

    // Show traffic lights when returning to main menu
    if (window.electronAPI) {
        window.electronAPI.setTrafficLightVisibility(true);
    }
}

// Main menu return button
backToMenuButton.addEventListener('click', stopGame);

// "Select other folder" button in image library view
selectNewFolderFromBrowserButton.addEventListener('click', async () => {
    if (window.electronAPI) {
        // Open folder dialog from the current `currentLoadedFolderPath` (where we are browsing)
        const folderPath = await window.electronAPI.openFolderDialog(currentLoadedFolderPath || undefined);
        if (folderPath) {
            showFolderBrowserView(folderPath); // Load newly selected folder for browsing
        } else {
            // User canceled selection, stay in image library view (keep silent)
        }
    } else {
        showCustomAlert('此功能仅在打包为桌面应用后可用。', '提示');
    }
});

// "Go up folder" button in image library view
goUpFolderButton.addEventListener('click', () => {
    const parentPath = getParentPath(currentLoadedFolderPath);
    if (parentPath) {
        showFolderBrowserView(parentPath);
    } else {
        showCustomAlert('已是顶层文件夹。', '提示');
    }
});

// NEW: Close folder browser button (now correctly retains the mainMenuSelectedFolderPath)
closeFolderBrowserButton.addEventListener('click', () => {
    // Simply return to the main menu. The showMainMenu function will now correctly
    // restore the state based on mainMenuSelectedFolderPath.
    showMainMenu(); 
});


// Pagination button event listeners
prevPageButton.addEventListener('click', showPreviousPageOfThumbnails);
nextPageButton.addEventListener('click', showNextPageOfThumbnails);

// New: Library filter marked toggle button event listener
libraryFilterMarkedToggle.addEventListener('click', async () => {
    isLibraryFilterMarkedEnabled = !isLibraryFilterMarkedEnabled;
    libraryFilterMarkedToggle.classList.toggle('active', isLibraryFilterMarkedEnabled);
    if (window.electronAPI) {
        await window.electronAPI.saveSetting('isLibraryFilterMarkedEnabled', isLibraryFilterMarkedEnabled);
    }
    // Re-render the current folder view with the new filter applied
    showFolderBrowserView(currentLoadedFolderPath);
});

// New: Open Sketch Log button event listener
openSketchLogButton.addEventListener('click', async () => {
    if (window.electronAPI) {
        const result = await window.electronAPI.openLogFile();
        if (!result.success) {
            showCustomAlert(result.message || '无法打开日志文件。', '错误');
        }
    } else {
        showCustomAlert('此功能仅在打包为桌面应用后可用。', '提示');
    }
});
