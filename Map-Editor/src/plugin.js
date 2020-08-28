import { CyclonePlugin } from '../../Core/main';

const layerVisibility = [true, true, true, true, true, false, false, false];
let editorActive = true;
let windowWidth = 408;

let currentLayer = 7;
let currentTab = 'A';
let currentTileId = 0;
let tileCols = 1;
let tileRows = 1;
let selectedTileList = [];
let multiLayerSelection = [];
let tileWidth = 48;
let tileHeight = 48;
let currentTool = 'pencil';
let lastDrawingTool = 'pencil';
let wasPressing = false;
let isRightButtonDown = false;
let wasRightButtonDown = false;
let rectangleStartMouseX = 0;
let rectangleStartMouseY = 0;
let rectangleStartX = 0;
let rectangleStartY = 0;
let rectangleWidth = 0;
let rectangleHeight = 0;
let rectangleBackWidth = 0;
let rectangleBackHeight = 0;
const tabs = ['A', 'B', 'C', 'D', 'E'];
let changeHistory = [];
let undoHistory = [];
let currentChange = false;
let previewChanges = {};
let messySelection = false;
let showGrid = true;
let statusTileId = 0;
let statusMapX = 0;
let statusMapY = 0;
let statusTile1 = 0;
let statusTile2 = 0;
let statusTile3 = 0;
let statusTile4 = 0;
let statusRegion = 0;
let gridPreviewBlockHandler = false;
let gridNeedsRefresh = false;
let currentZoom = 1;

const _ = '';
const o = true;
const x = false;
const autoTileShapeTable = [
  // o means there's a compatible tile on that position,
  // x means there is no compatible tile on that position
  // _ means that position doesn't matter
  [o, o, o, o, o, o, o, o], // 0
  [x, o, o, o, o, o, o, o], // 1
  [o, o, x, o, o, o, o, o], // 2
  [x, o, x, o, o, o, o, o], // 3
  [o, o, o, o, o, o, o, x], // 4
  [x, o, o, o, o, o, o, x], // 5
  [o, o, x, o, o, o, o, x], // 6
  [x, o, x, o, o, o, o, x], // 7
  [o, o, o, o, o, x, o, o], // 8
  [x, o, o, o, o, x, o, o], // 9
  [o, o, x, o, o, x, o, o], //10
  [x, o, x, o, o, x, o, o], //11
  [o, o, o, o, o, x, o, x], //12
  [x, o, o, o, o, x, o, x], //13
  [o, o, x, o, o, x, o, x], //14
  [x, o, x, o, o, x, o, x], //15
  [_, o, o, x, o, _, o, o], //16
  [_, o, x, x, o, _, o, o], //17
  [_, o, o, x, o, _, o, x], //18
  [_, o, x, x, o, _, o, x], //19
  [_, x, _, o, o, o, o, o], //20
  [_, x, _, o, o, o, o, x], //21
  [_, x, _, o, o, x, o, o], //22
  [_, x, _, o, o, x, o, x], //23
  [o, o, _, o, x, o, o, _], //24
  [o, o, _, o, x, x, o, _], //25
  [x, o, _, o, x, o, o, _], //26
  [x, o, _, o, x, x, o, _], //27
  [o, o, o, o, o, _, x, _], //28
  [x, o, o, o, o, _, x, _], //29
  [o, o, x, o, o, _, x, _], //30
  [x, o, x, o, o, _, x, _], //31
  [_, o, _, x, x, _, o, _], //32
  [_, x, _, o, o, _, x, _], //33
  [_, x, _, x, o, _, o, o], //34
  [_, x, _, x, o, _, o, x], //35
  [_, x, _, o, x, o, o, _], //36
  [_, x, _, o, x, x, o, _], //37
  [o, o, _, o, x, _, x, _], //38
  [x, o, _, o, x, _, x, _], //39
  [_, o, o, x, o, _, x, _], //40
  [_, o, x, x, o, _, x, _], //41
  [_, x, _, x, x, _, o, _], //42
  [_, x, _, x, o, _, x, _], //43
  [_, o, _, x, x, _, x, _], //44
  [_, x, _, o, x, _, x, _], //45
  [_, x, _, x, x, _, x, _]  //46
];

const highLayerAutotiles = [
  1,
  2,
  3,
  20,
  21,
  22,
  23,
  28,
  29,
  30,
  31,
  36,
  37,
  38,
  39,
  44,
  45,
  46,
  47,
];

class CycloneMapEditor extends CyclonePlugin {
  static get currentTab() {
    return currentTab;
  }
  static get active() {
    return editorActive;
  }
  static set active(value) {
    editorActive = value;
  }
  static get tileWidth() {
    return tileWidth;
  }
  static set tileWidth(value) {
    tileWidth = value;
  }
  static get tileHeight() {
    return tileHeight;
  }
  static set tileHeight(value) {
    tileHeight = value;
  }
  static get windowWidth() {
    return windowWidth;
  }
  static set windowWidth(value) {
    windowWidth = value;
  }

  static get isRightButtonDown() {
    return isRightButtonDown;
  }
  static set isRightButtonDown(value) {
    isRightButtonDown = value;
  }

  // the size of the rectangle tool when the user stretches it right
  static get rectangleWidth() { return rectangleWidth; }
  static set rectangleWidth(value) { rectangleWidth = value; }

  // The size of the rectangle tool when the user stretches it down
  static get rectangleHeight() { return rectangleHeight; }
  static set rectangleHeight(value) { rectangleHeight = value; }

  // the size of the rectangle tool when the user stretches it left
  static get rectangleBackWidth() { return rectangleBackWidth; }
  static set rectangleBackWidth(value) { rectangleBackWidth = value; }

  // The size of the rectangle tool when the user stretches it up
  static get rectangleBackHeight() { return rectangleBackHeight; }
  static set rectangleBackHeight(value) { rectangleBackHeight = value; }

  // The X tile where the rectangle started
  static get rectangleStartX() { return rectangleStartX; }
  static set rectangleStartX(value) { rectangleStartX = value; }

  // The Y tile where the rectangle started
  static get rectangleStartY() { return rectangleStartY; }
  static set rectangleStartY(value) { rectangleStartY = value; }

  static get tileCols() { return tileCols; }
  static set tileCols(value) { tileCols = value; }
  static get tileRows() { return tileRows; }
  static set tileRows(value) { tileRows = value; }

  // The Mouse X position where the rectangle started
  static get rectangleStartMouseX() { return rectangleStartMouseX; }
  static set rectangleStartMouseX(value) { rectangleStartMouseX = value; }

  // The Mouse Y position where the rectangle started
  static get rectangleStartMouseY() { return rectangleStartMouseY; }
  static set rectangleStartMouseY(value) { rectangleStartMouseY = value; }

  static get messySelection() { return messySelection; }
  static set messySelection(value) { messySelection = value; }

  static get changeHistory() { return changeHistory; }
  static get undoHistory() { return undoHistory; }
  static get layerVisibility() { return layerVisibility; }

  static get wasRightButtonDown() { return wasRightButtonDown; }
  static set wasRightButtonDown(value) { wasRightButtonDown = value; }
  static get wasPressing() { return wasPressing; }
  static set wasPressing(value) { wasPressing = value; }

  static get currentTool() { return currentTool; }
  static get currentLayer() { return currentLayer; }
  static get showGrid() { return showGrid; }
  static get previewChanges() { return previewChanges; }

  static get currentTileId() { return currentTileId; }
  static set currentTileId(value) { currentTileId = value; }
  static get selectedTileList() { return selectedTileList; }
  static set selectedTileList(value) { selectedTileList = value; }
  static get multiLayerSelection() { return multiLayerSelection; }
  static set multiLayerSelection(value) { multiLayerSelection = value; }

  static get statusTileId() { return statusTileId; }
  static set statusTileId(value) { statusTileId = value; }
  static get statusMapX() { return statusMapX; }
  static set statusMapX(value) { statusMapX = value; }
  static get statusMapY() { return statusMapY; }
  static set statusMapY(value) { statusMapY = value; }
  static get statusTile1() { return statusTile1; }
  static set statusTile1(value) { statusTile1 = value; }
  static get statusTile2() { return statusTile2; }
  static set statusTile2(value) { statusTile2 = value; }
  static get statusTile3() { return statusTile3; }
  static set statusTile3(value) { statusTile3 = value; }
  static get statusTile4() { return statusTile4; }
  static set statusTile4(value) { statusTile4 = value; }
  static get statusRegion() { return statusRegion; }
  static set statusRegion(value) { statusRegion = value; }

  static get currentZoom() { return currentZoom; }
  static set currentZoom(value) {
    currentZoom = value;
    $gameScreen._zoomScale = value;

    if (SceneManager._scene instanceof Scene_Map) {
      $gameMap.zoom = new Point(value, value);
      SceneManager._scene._mapEditorGrid.refresh();
      SceneManager._scene._spriteset.updatePosition();
    }
  }

  static register() {
    super.initialize('CycloneMapEditor');

    this.structs.set('CycloneRegionIcon', {
      regionId: 'int',
      icon: 'int',
    });

    super.register({
      regionIcons: {
        type: 'struct<CycloneRegionIcon>[]',
        defaultValue: '[]',
      },
    });

    document.addEventListener('keydown', (...args) => {
      this.onKeyDown(...args);
    });
    document.addEventListener('keypress', (...args) => {
      this.onKeyPress(...args);
    });
    document.addEventListener('keyup', (...args) => {
      this.onKeyUp(...args);
    });

    const regionIcons = this.params.regionIcons;
    this.regionIcons = new Map();
    if (regionIcons) {
      for (const { regionId, icon } of regionIcons) {
        if (regionId && icon) {
          this.regionIcons.set(regionId, icon);
        }
      }
    }

    this.addMenuBar();
  }

  static addMenuBar() {
    const menu = new nw.Menu({ type: 'menubar' });

    const fileMenu = new nw.Menu();
    fileMenu.append(new nw.MenuItem( {
      label: 'Save',
      key: 's',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor.saveButton();
      }
    }));
    fileMenu.append(new nw.MenuItem( {
      label: 'Reload',
      key: 'r',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor.reloadButton();
      }
    }));

    fileMenu.append(new nw.MenuItem( {type: 'separator'}));
    fileMenu.append(new nw.MenuItem( {label: 'Exit', click: () => {
      window.close();
    }}));

    menu.append(new nw.MenuItem({
      label: 'File',
      submenu: fileMenu,
    }));

    const editMenu = new nw.Menu();
    editMenu.append(new nw.MenuItem( {
      label: 'Undo',
      key: 'z',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor.undoButton();
      }
    }));
    editMenu.append(new nw.MenuItem( {
      label: 'Redo',
      key: 'y',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor.redoButton();
      }
    }));
    editMenu.append(new nw.MenuItem( {type: 'separator'}));
    this.showGridMenu = new nw.MenuItem( {
      label: 'Show Grid',
      type: 'checkbox',
      checked: showGrid,
      key: 'g',
      modifiers: 'ctrl',
      click: () => {
        CycloneMapEditor.showGridButton();
      }
    });
    editMenu.append(this.showGridMenu);

    // const zoomMenu = new nw.Menu();
    // this.zoom30Menu = new nw.MenuItem({
    //   label: '30%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.3,
    //   click: () => {
    //     this.currentZoom = 0.3;

    //   },
    // });
    // zoomMenu.append(this.zoom30Menu);
    // this.zoom50Menu = new nw.MenuItem({
    //   label: '50%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.5,
    //   click: () => {
    //     this.currentZoom = 0.5;

    //   },
    // });
    // zoomMenu.append(this.zoom50Menu);
    // this.zoom67Menu = new nw.MenuItem({
    //   label: '67%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.67,
    //   click: () => {
    //     this.currentZoom = 0.67;

    //   },
    // });
    // zoomMenu.append(this.zoom67Menu);
    // this.zoom75Menu = new nw.MenuItem({
    //   label: '75%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.75,
    //   click: () => {
    //     this.currentZoom = 0.75;

    //   },
    // });
    // zoomMenu.append(this.zoom75Menu);
    // this.zoom90Menu = new nw.MenuItem({
    //   label: '90%',
    //   type: 'checkbox',
    //   checked: currentZoom === 0.9,
    //   click: () => {
    //     this.currentZoom = 0.9;

    //   },
    // });
    // zoomMenu.append(this.zoom90Menu);
    // this.zoom100Menu = new nw.MenuItem({
    //   label: '100%',
    //   type: 'checkbox',
    //   checked: currentZoom === 1,
    //   click: () => {
    //     this.currentZoom = 1;

    //   },
    // });
    // zoomMenu.append(this.zoom100Menu);
    // this.zoom150Menu = new nw.MenuItem({
    //   label: '150%',
    //   type: 'checkbox',
    //   checked: currentZoom === 1.5,
    //   click: () => {
    //     this.currentZoom = 1.5;

    //   },
    // });
    // zoomMenu.append(this.zoom150Menu);

    // editMenu.append(new nw.MenuItem({
    //   label: 'Zoom',
    //   submenu: zoomMenu,
    // }));

    menu.append(new nw.MenuItem({
      label: 'Edit',
      submenu: editMenu,
    }));

    const drawMenu = new nw.Menu();
    this.pencilMenu = new nw.MenuItem( {
      label: 'Pencil',
      type: 'checkbox',
      checked: currentTool === 'pencil',
      key: 'p',
      click: () => {
        CycloneMapEditor.pencilButton();
      }
    });
    drawMenu.append(this.pencilMenu);
    this.rectangleMenu = new nw.MenuItem( {
      label: 'Rectangle',
      type: 'checkbox',
      checked: currentTool === 'rectangle',
      key: 'r',
      click: () => {
        CycloneMapEditor.rectangleButton();
      }
    });
    drawMenu.append(this.rectangleMenu);
    this.fillMenu = new nw.MenuItem( {
      label: 'Flood Fill',
      type: 'checkbox',
      checked: currentTool === 'fill',
      key: 'f',
      click: () => {
        CycloneMapEditor.fillButton();
      }
    });
    drawMenu.append(this.fillMenu);
    drawMenu.append(new nw.MenuItem( {type: 'separator'}));
    this.eraserMenu = new nw.MenuItem( {
      label: 'Eraser',
      type: 'checkbox',
      checked: currentTool === 'eraser',
      key: 'e',
      click: () => {
        CycloneMapEditor.eraserButton();
      }
    });
    drawMenu.append(this.eraserMenu);

    menu.append(new nw.MenuItem({
      label: 'Draw',
      submenu: drawMenu,
    }));

    const layerMenu = new nw.Menu();
    this.autoLayerButton = new nw.MenuItem( {
      label: 'Automatic',
      type: 'checkbox',
      checked: currentLayer === 7,
      key: '0',
      click: () => {
        CycloneMapEditor.changeCurrentLayer(7);
      }
    });
    this.layer1Button = new nw.MenuItem( {
      label: 'Layer 1',
      type: 'checkbox',
      checked: currentLayer === 0,
      key: '1',
      click: () => {
        CycloneMapEditor.changeCurrentLayer(0);
      }
    });
    this.layer2Button = new nw.MenuItem( {
      label: 'Layer 2',
      type: 'checkbox',
      checked: currentLayer === 1,
      key: '2',
      click: () => {
        CycloneMapEditor.changeCurrentLayer(1);
      }
    });
    this.layer3Button = new nw.MenuItem( {
      label: 'Layer 3',
      type: 'checkbox',
      checked: currentLayer === 2,
      key: '3',
      click: () => {
        CycloneMapEditor.changeCurrentLayer(2);
      }
    });
    this.layer4Button = new nw.MenuItem( {
      label: 'Layer 4',
      type: 'checkbox',
      checked: currentLayer === 3,
      key: '4',
      click: () => {
        CycloneMapEditor.changeCurrentLayer(3);
      }
    });
    layerMenu.append(this.autoLayerButton);
    layerMenu.append(this.layer1Button);
    layerMenu.append(this.layer2Button);
    layerMenu.append(this.layer3Button);
    layerMenu.append(this.layer4Button);

    layerMenu.append(new nw.MenuItem( {type: 'separator'}));
    this.shadowsButton = new nw.MenuItem( {
      label: 'Shadows',
      type: 'checkbox',
      checked: currentLayer === 4,
      key: '5',
      click: () => {
        CycloneMapEditor.changeCurrentLayer(4);
      }
    });
    layerMenu.append(this.shadowsButton);
    this.regionsButton = new nw.MenuItem( {
      label: 'Regions',
      type: 'checkbox',
      checked: currentLayer === 5,
      key: '6',
      click: () => {
        CycloneMapEditor.changeCurrentLayer(5);
      }
    });
    layerMenu.append(this.regionsButton);

    menu.append(new nw.MenuItem({
      label: 'Layer',
      submenu: layerMenu,
    }));

    const helpMenu = new nw.Menu();
    helpMenu.append(new nw.MenuItem( {
      label: 'Plugin Page',
      key: 'F1',
      click: () => {
        require('nw.gui').Shell.openExternal('https://makerdevs.com/plugin/cyclone-map-editor');
      },
    }));

    menu.append(new nw.MenuItem({
      label: 'Help',
      submenu: helpMenu,
    }));

    this.menu = menu;
  }

  static clearAllData() {
    changeHistory = [];
    undoHistory = [];
    currentTileId = 0;
    tileCols = 1;
    tileRows = 1;
    rectangleStartMouseX = 0;
    rectangleStartMouseY = 0;
    rectangleStartX = 0;
    rectangleStartY = 0;
    rectangleWidth = 0;
    rectangleHeight = 0;
    rectangleBackWidth = 0;
    rectangleBackHeight = 0;
    selectedTileList = [];
  }

  static shouldDisplayMenu() {
    if (!editorActive) {
      return false;
    }

    if (!(SceneManager._scene instanceof Scene_Map)) {
      return false;
    }

    return true;
  }

  static refreshScreenSize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    if (Graphics._isFullScreen()) {
      return;
    }

    this.resizeTimeout = setTimeout(() => {
      // Adds a second timeout to block the show/hide functionality for a little while
      this.resizeTimeout = setTimeout(() => {
        this.resizeTimeout = false;
      }, 500);

      const xDelta = Graphics.width - window.innerWidth;
      const yDelta = Graphics.height - window.innerHeight;
      window.moveBy(-xDelta / 2, -yDelta / 2);
      window.resizeBy(xDelta, yDelta);
    }, 20);
  }

  static refreshMenuVisibility() {
    const display = this.shouldDisplayMenu();
    const win = nw.Window.get();

    if (display && win.menu === this.menu) {
      return;
    }

    if (display) {
      win.menu = this.menu;

      // return;
    } else {
      win.menu = null;
    }

    this.refreshScreenSize();
  }

  static isTabValid(tab) {
    const tileset = $gameMap.tileset();
    if (!tileset) {
      return false;
    }

    const names = tileset.tilesetNames;

    if (tab === 'A') {
      return Boolean(names[0] || names[1] || names[2] || names[3] || names[4]);
    }

    const tilesetIndex = tabs.indexOf(tab) + 4;
    return Boolean(names[tilesetIndex]);
  }

  static validTabs() {
    return tabs.filter(tab => this.isTabValid(tab));
  }

  static areRegionsVisible() {
    return layerVisibility[5];
  }

  static selectPreviousTab() {
    const validTabs = this.validTabs();
    const oldIndex = validTabs.indexOf(currentTab).clamp(0, validTabs.length - 1);

    const index = oldIndex === 0 ? validTabs.length -1 : oldIndex -1;
    this.changeCurrentTab(validTabs[index % validTabs.length]);
  }

  static selectNextTab() {
    const validTabs = this.validTabs();
    const oldIndex = validTabs.indexOf(currentTab).clamp(0, validTabs.length - 1);

    const index = oldIndex +1;
    this.changeCurrentTab(validTabs[index % validTabs.length]);
  }

  static onKeyDown(event) {
    if (!editorActive) {
      return;
    }

    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map)) {
      return;
    }

    if (event.keyCode === 8 || event.keyCode === 46) {
      this.eraserButton();
      return;
    }

    if (event.keyCode === 33) {
      this.selectPreviousTab();
      return;
    }

    if (event.keyCode === 34) {
      this.selectNextTab();
      return;
    }
  }

  static checkNumKeys(code) {
    switch(code) {
      case 'Numpad0':
        this.changeCurrentLayer(7);
        break;
      case 'Numpad1':
        this.changeCurrentLayer(0);
        break;
      case 'Numpad2':
        this.changeCurrentLayer(1);
        break;
      case 'Numpad3':
        this.changeCurrentLayer(2);
        break;
      case 'Numpad4':
        this.changeCurrentLayer(3);
        break;
      case 'Numpad5':
        this.changeCurrentLayer(4);
        break;
      case 'Numpad6':
        this.changeCurrentLayer(5);
        break;
    }
  }

  static checkScrollKeys(key) {
    switch(key) {
      case 'w':
        $gameMap.scrollUp(3);
        break;
      case 'a':
        $gameMap.scrollLeft(3);
        break;
      case 's':
        $gameMap.scrollDown(3);
        break;
      case 'd':
        $gameMap.scrollRight(3);
        break;
    }
  }

  static loadMapFile() {
    SceneManager._scene._mapEditorCommands.hide();
    const fileName = `Map${ $gameMap._mapId.padZero(3) }.json`;

    const xhr = new XMLHttpRequest();
    const url = `data/${ fileName }`;

    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);

        // eslint-disable-next-line no-global-assign
        $dataMap = data;
        SoundManager.playLoad();
        SceneManager.goto(Scene_Map);
      } catch (e) {
        alert('Failed to parse map data.');
        SceneManager._scene.refreshMapEditorWindows();
      }
    };
    xhr.onerror = () => {
      alert('Failed to load map file from disk.');
      SceneManager._scene.refreshMapEditorWindows();
    };

    xhr.send();
  }

  static undoButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    if (changeHistory.length) {
      this.undoLastChange();
    }
  }

  static redoButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    if (undoHistory.length) {
      this.redoLastUndoneChange();
    }
  }

  // eslint-disable-next-line complexity
  static updateStatus({ tileId, mapX, mapY, tile1, tile2, tile3, tile4, region } = {}) {
    const oldTileId = statusTileId;
    const oldX = statusMapX;
    const oldY = statusMapY;
    const oldTile1 = statusTile1;
    const oldTile2 = statusTile2;
    const oldTile3 = statusTile3;
    const oldTile4 = statusTile4;
    const oldRegion = region;

    statusTileId = tileId ?? statusTileId;
    statusMapX = mapX ?? statusMapX;
    statusMapY = mapY ?? statusMapY;
    statusTile1 = tile1 ?? statusTile1;
    statusTile2 = tile2 ?? statusTile2;
    statusTile3 = tile3 ?? statusTile3;
    statusTile4 = tile4 ?? statusTile4;
    statusRegion = region ?? statusRegion;

    const changedTile = oldTile1 !== statusTile1 || oldTile2 !== statusTile2 || oldTile3 !== statusTile3 || oldTile4 !== statusTile4;
    const changed = changedTile || oldTileId !== statusTileId || oldX !== statusMapX || oldY !== statusMapY || oldRegion !== statusRegion;
    if (!changed) {
      return;
    }

    if (SceneManager._scene instanceof Scene_Map) {
      SceneManager._scene._mapEditorStatus.refresh();
    }
  }

  static showGridButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    showGrid = !showGrid;
    this.showGridButton.checked = showGrid;
    SceneManager._scene._mapEditorGrid.refresh();
  }

  static selectHigherLayer(x, y) {
    for (let z = 3; z >= 0; z--) {
      const tileIndex = this.tileIndex(x, y, z);
      const tileId = $dataMap.data[tileIndex];

      if (tileId) {
        this.changeCurrentLayer(z);
        return;
      }
    }
  }

  static updateCurrentTool() {
    rectangleWidth = 0;
    rectangleHeight = 0;
    rectangleBackWidth = 0;
    rectangleBackHeight = 0;
    rectangleStartX = 0;
    rectangleStartY = 0;
    rectangleStartMouseX = 0;
    rectangleStartMouseY = 0;

    this.pencilMenu.checked = currentTool === 'pencil';
    this.rectangleMenu.checked = currentTool === 'rectangle';
    this.fillMenu.checked = currentTool === 'fill';
    this.eraserMenu.checked = currentTool === 'eraser';
    this.refreshMapEditor();
  }

  static pencilButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    currentTool = 'pencil';
    lastDrawingTool = 'pencil';

    this.updateCurrentTool();
  }

  static rectangleButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    currentTool = 'rectangle';
    lastDrawingTool = 'rectangle';

    this.updateCurrentTool();
  }

  static fillButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    currentTool = 'fill';
    this.updateCurrentTool();
  }

  static eraserButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    currentTool = 'eraser';

    this.updateCurrentTool();
  }

  static _doSave() {
    const fs = require('fs');
    const path = require('path');

    const projectFolder = path.dirname(process.mainModule.filename);
    const dataFolder = path.join(projectFolder, 'data');
    const fileName = `Map${ $gameMap._mapId.padZero(3) }.json`;

    const filePath = path.join(dataFolder, fileName);

    const json = JSON.stringify($dataMap, null, 2);
    fs.writeFileSync(filePath, json);

    SoundManager.playSave();
  }

  static saveButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    if (!confirm('Are you sure you want to SAVE the map file?')) {
      SceneManager._scene.refreshMapEditorWindows();
      return;
    }

    SceneManager._scene._mapEditorCommands.hide();

    this._doSave();
    SceneManager._scene.refreshMapEditorWindows();
  }

  static reloadButton() {
    if (!(SceneManager._scene instanceof Scene_Map)) {
      return;
    }

    if (!confirm('Are you sure you want to RELOAD the map file?')) {
      SceneManager._scene.refreshMapEditorWindows();
      return;
    }

    changeHistory = [];
    undoHistory = [];
    currentTileId = 0;
    tileCols = 1;
    tileRows = 1;
    rectangleWidth = 0;
    rectangleHeight = 0;
    rectangleBackWidth = 0;
    rectangleBackHeight = 0;
    rectangleStartX = 0;
    rectangleStartY = 0;
    rectangleStartMouseX = 0;
    rectangleStartMouseY = 0;

    this.loadMapFile();
  }

  static onKeyPress(event) {
    if (editorActive) {
      this.checkScrollKeys(event.key);
    }
  }

  static onKeyUp(event) {
    if (event.key === 'h') {
      this.toggleMapEditor();
      return;
    }

    this.checkNumKeys(event.code);
  }

  static toggleMapEditor() {
    if (this.resizeTimeout) {
      return;
    }

    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map)) {
      return;
    }

    scene.toggleMapEditor();
  }

  static refreshMapEditor() {
    const scene = SceneManager._scene;
    if (!(scene instanceof Scene_Map)) {
      return;
    }

    scene.refreshMapEditorWindows();
  }

  static getTileIdTilesetIndex(tileId) {
    if (tileId < Tilemap.TILE_ID_A5) {
      const tilesetIndex = Math.floor(tileId / 256);
      if (tilesetIndex >= 0 && tilesetIndex < 4) {
        return 5 + tilesetIndex;
      }

      return -1;
    }

    if (tileId < Tilemap.TILE_ID_A1) {
      return 4;
    }

    if (tileId < Tilemap.TILE_ID_A2) {
      return 0;
    }

    if (tileId < Tilemap.TILE_ID_A3) {
      return 1;
    }

    if (tileId < Tilemap.TILE_ID_A4) {
      return 2;
    }

    if (tileId < Tilemap.TILE_ID_MAX) {
      return 3;
    }

    return -1;
  }

  static getTilesetName(tileId) {
    const tileset = $gameMap.tileset();
    if (!tileset) {
      return;
    }

    const tilesetIndex = this.getTileIdTilesetIndex(tileId);
    if (tilesetIndex < 0) {
      return;
    }

    return tileset.tilesetNames[tilesetIndex];
  }

  static loadTilesetBitmap(tileId) {
    const realFileName = this.getTilesetName(tileId);
    if (realFileName) {
      return ImageManager.loadTileset(realFileName);
    }
  }

  static changeCurrentLayer(newIndex) {
    if (newIndex >= layerVisibility.length) {
      return;
    }

    currentLayer = newIndex;
    this.layer1Button.checked = newIndex === 0;
    this.layer2Button.checked = newIndex === 1;
    this.layer3Button.checked = newIndex === 2;
    this.layer4Button.checked = newIndex === 3;
    this.shadowsButton.checked = newIndex === 4;
    this.regionsButton.checked = newIndex === 5;
    this.autoLayerButton.checked = newIndex === 7;

    if (SceneManager._scene instanceof Scene_Map) {
      SceneManager._scene._mapEditorLayerListWindow.refresh();
      SceneManager._scene._mapEditorWindow.refresh();
      SceneManager._scene._mapEditorStatus.refresh();
    }
  }

  static changeCurrentTab(tabLetter) {
    currentTab = tabLetter;
    this.refreshMapEditor();
  }

  static tileIndex(x, y, z) {
    return (z * $gameMap.height() + (y % $gameMap.height())) * $gameMap.width() + (x % $gameMap.width());
  }

  static indexPositionX(index, z) {
    const y = this.indexPositionY(index, z);
    return index - this.tileIndex(0, y, z);
  }

  static indexPositionY(index, z) {
    return Math.floor((index / $gameMap.width()) - (z * $gameMap.height()));
  }

  static getCurrentTileAtPosition(x, y, z, skipPreview = true) {
    if (x < 0 || y < 0 || x >= $gameMap.width() || y >= $gameMap.height()) {
      return 0;
    }

    const tileIndex = this.tileIndex(x, y, z);
    if (!skipPreview) {
      if (previewChanges[tileIndex] !== undefined) {
        return previewChanges[tileIndex];
      }
    }

    return $dataMap.data[tileIndex] ?? 0;
  }

  static isSameKindTile(tileId, x, y, z, skipPreview = true) {
    return Tilemap.isSameKindTile(tileId, this.getCurrentTileAtPosition(x, y, z, skipPreview));
  }

  static getWallColumnTypeForPosition(x, y, z, tileId, skipPreview = true) {
    // wall auto tiles need the left and right columns to have the same amount of rows for it to match
    let hasLeftColumn = true;
    let hasRightColumn = true;

    const compareWallAutoTileLine = (newY, sameCenter) => {
      const leftTileId = this.getCurrentTileAtPosition(x -1, newY, z, skipPreview);
      const rightTileId = this.getCurrentTileAtPosition(x + 1, newY, z, skipPreview);

      if (sameCenter) {
        if (!Tilemap.isSameKindTile(tileId, leftTileId)) {
          hasLeftColumn = false;
        }
        if (!Tilemap.isSameKindTile(tileId, rightTileId)) {
          hasRightColumn = false;
        }
      } else {
        if (Tilemap.isSameKindTile(tileId, leftTileId)) {
          hasLeftColumn = false;
        }
        if (Tilemap.isSameKindTile(tileId, rightTileId)) {
          hasRightColumn = false;
        }
      }
    };

    for (let newY = y; y < $gameMap.height(); y++) {
      const centerTileId = this.getCurrentTileAtPosition(x, newY, z, skipPreview);
      const sameCenter = Tilemap.isSameKindTile(tileId, centerTileId);
      compareWallAutoTileLine(newY, sameCenter);
      if (!sameCenter) {
        break;
      }
    }

    for (let newY = y -1; y >= 0; y--) {
      const centerTileId = this.getCurrentTileAtPosition(x, newY, z, skipPreview);
      const sameCenter = Tilemap.isSameKindTile(tileId, centerTileId);
      compareWallAutoTileLine(newY, sameCenter);
      if (!sameCenter) {
        break;
      }
    }

    if (hasLeftColumn) {
      if (hasRightColumn) {
        return 1;
      }

      return 2;
    }

    if (hasRightColumn) {
      return 0;
    }

    return 3;
  }

  static getWaterfallShapeForPosition(x, y, z, tileId, skipPreview = true) {
    const left = this.isSameKindTile(tileId, x - 1, y, z, skipPreview);
    const right = this.isSameKindTile(tileId, x + 1, y, z, skipPreview);

    if (left && right) {
      return 0;
    }

    if (left) {
      return 1;
    }

    if (right) {
      return 2;
    }

    return 3;
  }

  static getWallShapeForPosition(x, y, z, tileId, skipPreview = true) {
    const columnType = this.getWallColumnTypeForPosition(x, y, z, tileId, skipPreview);

    let shape = 0;
    const above = this.isSameKindTile(tileId, x, y -1, z, skipPreview);
    const below = this.isSameKindTile(tileId, x, y +1, z, skipPreview);

    if (above && below) {
      shape = 0;
    } else if (above) {
      shape = 8;
    } else if (below) {
      shape = 2;
    } else {
      shape = 10;
    }

    switch (columnType) {
      case 0:
        shape += 1;
        break;
      case 2:
        shape += 4;
        break;
      case 3:
        shape += 5;
        break;
    }

    return shape;
  }

  static getShapeForConfiguration(configuration) {
    for (let shape = 0; shape < autoTileShapeTable.length; shape++) {
      const shapeData = autoTileShapeTable[shape];
      let valid = true;

      for (let i = 0; i < configuration.length; i++) {
        const config = shapeData[i];

        if (config === true) {
          if (!configuration[i]) {
            valid = false;
            break;
          }
        } else if (config === false) {
          if (configuration[i]) {
            valid = false;
            break;
          }
        }
      }

      if (valid) {
        return shape;
      }
    }

    return 46;
  }


  static isAutotileMatch(tileId, x, y, z, skipPreview = true) {
    if (!$gameMap.isValid(x, y)) {
      return true;
    }

    const otherTileId = this.getCurrentTileAtPosition(x, y, z, skipPreview);

    if (Tilemap.isSameKindTile(tileId, otherTileId)) {
      return true;
    }

    const specialTiles = [5, 7, 13];
    const leftKind = Tilemap.getAutotileKind(tileId);
    const rightKind = Tilemap.getAutotileKind(otherTileId);

    const leftSpecial = specialTiles.includes(leftKind);
    const rightSpecial = specialTiles.includes(rightKind);
    if (leftSpecial !== rightSpecial) {
      return true;
    }

    return false;
  }

  static getAutoTileShapeForPosition(x, y, z, tileId, skipPreview = true) {
    if (Tilemap.isWallSideTile(tileId) || Tilemap.isRoofTile(tileId)) {
      return this.getWallShapeForPosition(x, y, z, tileId, skipPreview);
    }

    if (Tilemap.isWaterfallTile(tileId)) {
      return this.getWaterfallShapeForPosition(x, y, z, tileId, skipPreview);
    }

    const a = this.isAutotileMatch(tileId, x -1, y -1, z, skipPreview);
    const b = this.isAutotileMatch(tileId, x, y -1, z, skipPreview);
    const c = this.isAutotileMatch(tileId, x +1, y -1, z, skipPreview);

    const d = this.isAutotileMatch(tileId, x -1, y, z, skipPreview);
    const e = this.isAutotileMatch(tileId, x +1, y, z, skipPreview);

    const f = this.isAutotileMatch(tileId, x -1, y +1, z, skipPreview);
    const g = this.isAutotileMatch(tileId, x, y +1, z, skipPreview);
    const h = this.isAutotileMatch(tileId, x +1, y +1, z, skipPreview);

    const config = [a, b, c, d, e, f, g, h];
    return this.getShapeForConfiguration(config);
  }

  static isShiftMapping() {
    if (Input.isPressed('shift')) {
      return true;
    }

    if (SceneManager._scene._mapEditorWindow._manualTileSelected !== undefined) {
      return true;
    }

    return false;
  }

  static changeAutoTileShapeForPosition(x, y, z, tileId, skipPreview = true) {
    if (this.isShiftMapping()) {
      return tileId;
    }

    const shape = this.getAutoTileShapeForPosition(x, y, z, tileId, skipPreview);
    return Tilemap.TILE_ID_A1 + Math.floor((tileId - Tilemap.TILE_ID_A1) / 48) * 48 + shape;
  }

  static resetTileShape(x, y, z, previewOnly = false) {
    if (x < 0 || x >= $gameMap.width()) {
      return;
    }

    if (y < 0 || y >= $gameMap.height()) {
      return;
    }

    const tileId = this.getCurrentTileAtPosition(x, y, z, !previewOnly);
    if (Tilemap.isAutotile(tileId)) {
      const effectiveTileId = this.changeAutoTileShapeForPosition(x, y, z, tileId, !previewOnly);
      if (tileId !== effectiveTileId) {
        this.setMapTile(x, y, z, effectiveTileId, false, previewOnly);
      }
    }
  }

  static undoLastChange() {
    if (changeHistory.length === 0) {
      SoundManager.playBuzzer();
      return;
    }

    const lastChange = changeHistory.pop();
    currentChange = {};
    for (const tileIndex in lastChange) {
      currentChange[tileIndex] = $dataMap.data[tileIndex];
      $dataMap.data[tileIndex] = lastChange[tileIndex];
    }

    undoHistory.push(currentChange);
    currentChange = false;
    SceneManager._scene._mapEditorCommands.redraw();
    SceneManager._scene._mapEditorGrid.refresh();
  }

  static redoLastUndoneChange() {
    if (undoHistory.length === 0) {
      SoundManager.playBuzzer();
      return;
    }

    const lastChange = undoHistory.pop();
    currentChange = {};
    for (const tileIndex in lastChange) {
      currentChange[tileIndex] = $dataMap.data[tileIndex];
      $dataMap.data[tileIndex] = lastChange[tileIndex];
    }

    this.logChange(false);
  }

  static logChange(clearUndo = true) {
    const hasChanges = Object.keys(currentChange).length > 0;

    if (hasChanges) {
      changeHistory.push(currentChange);
      if (clearUndo) {
        undoHistory = [];
      }
    }
    currentChange = false;

    while (changeHistory.length > 300) {
      changeHistory.shift();
    }

    SceneManager._scene._mapEditorCommands.redraw();
    SceneManager._scene._mapEditorGrid.refresh();
  }

  static maybeUpdateTileNeighbors(x, y, z, expectedUpdate = true, previewOnly = false) {
    if (this.isShiftMapping()) {
      return;
    }

    if (!expectedUpdate) {
      return;
    }

    this.resetTileShape(x -1, y -1, z, previewOnly);
    this.resetTileShape(x, y -1, z, previewOnly);
    this.resetTileShape(x +1, y -1, z, previewOnly);

    this.resetTileShape(x -1, y, z, previewOnly);
    this.resetTileShape(x +1, y, z, previewOnly);

    this.resetTileShape(x -1, y +1, z, previewOnly);
    this.resetTileShape(x, y + 1, z, previewOnly);
    this.resetTileShape(x +1, y +1, z, previewOnly);
  }

  static getDefaultLayerForTileId(tileId) {
    if (!Tilemap.isAutotile(tileId)) {
      return 3;
    }

    if (tileId >= Tilemap.TILE_ID_A3) {
      return 0;
    }

    const kind = Tilemap.getAutotileKind(tileId);
    if (highLayerAutotiles.includes(kind)) {
      return 1;
    }

    return 0;
  }

  static getItemsToChange(x, y, z, tileId, skipPreview = true, updateHigherLayers = true) {
    if (z !== 7) {
      return [{
        x,
        y,
        z,
        tileId,
      }];
    }

    // When using automatic mode, we may need to change more than one layer at the same time
    const items = [];
    let layerId = this.getDefaultLayerForTileId(tileId);

    if (layerId === 1 && Tilemap.isTileA1(tileId)) {
      items.push({
        x,
        y,
        z: 0,
        tileId: Tilemap.TILE_ID_A1,
      });
    }

    if (layerId === 3) {
      // If there's already something on the fourth layer, then move it to the third and place the new tile on the 4th
      const currentTile = this.getCurrentTileAtPosition(x, y, 3, skipPreview);
      if (currentTile === tileId) {
        return [];
      }

      if (currentTile) {
        items.push({
          x,
          y,
          z: 2,
          tileId: currentTile,
        });
      }
    }

    items.push({
      x,
      y,
      z: layerId,
      tileId,
    });

    // Remove anything above the new tile
    if (updateHigherLayers) {
      for (let i = layerId + 1; i <= 3; i++) {
        items.push({
          x,
          y,
          z: i,
          tileId: 0,
        });
      }
    }

    return items;
  }

  static _applySingleMapTile(x, y, z, tileId, updateNeighbors = true, previewOnly = false) {
    const itemsToChange = this.getItemsToChange(x, y, z, tileId, !previewOnly, updateNeighbors);
    for (const {x, y, z, tileId} of itemsToChange) {
      const tileIndex = this.tileIndex(x, y, z);
      let effectiveTileId = tileId;
      if (Tilemap.isAutotile(tileId)) {
        effectiveTileId = this.changeAutoTileShapeForPosition(x, y, z, tileId, false);
      }

      if (previewOnly) {
        previewChanges[tileIndex] = effectiveTileId;
      } else {
        const oldTile = $dataMap.data[tileIndex];
        if (currentChange[tileIndex] === undefined && oldTile !== effectiveTileId) {
          currentChange[tileIndex] = oldTile;
        }

        $dataMap.data[tileIndex] = effectiveTileId;
      }

      this.maybeUpdateTileNeighbors(x, y, z, updateNeighbors, previewOnly);
    }
  }

  static setMapTile(x, y, z, tileId, updateNeighbors = true, previewOnly = false) {
    if (!$gameMap.isValid(x, y)) {
      return;
    }

    this._applySingleMapTile(x, y, z, tileId, updateNeighbors, previewOnly);
  }

  static getSelectedTileIndex(col, row) {
    if (currentTool === 'eraser') {
      return;
    }

    if (!currentTileId) {
      return;
    }

    if (selectedTileList.length < tileCols * tileRows) {
      return;
    }

    const realCol = col % tileCols;
    const realRow = row % tileRows;
    return realRow * tileCols + realCol;
  }

  static getSelectedTileCell(col, row) {
    const index = this.getSelectedTileIndex(col, row);
    if (index || index === 0) {
      return selectedTileList[index];
    }
  }

  static setSelectionTileMaybeMultiLayer(tileX, tileY, selectionCol, selectionRow, previewOnly = false) {
    const index = this.getSelectedTileIndex(selectionCol, selectionRow);

    if (currentLayer === 7 && multiLayerSelection.length) {
      for (let z = 0; z <= 3; z++) {
        const tileId = multiLayerSelection[z][index] ?? 0;
        this.setMapTile(tileX, tileY, z, tileId, true, previewOnly);
      }
    } else {
      const tileId = selectedTileList[index] ?? 0;
      this.setMapTile(tileX, tileY, currentLayer, tileId, true, previewOnly);
    }
  }

  static applyRectangle(startX, startY, width, height, previewOnly = false) {
    if (!currentTileId && currentTool !== 'eraser') {
      return;
    }

    this.ensureLayerVisibility();
    let initialRow = 0;
    let initialCol = 0;
    let rowIncrement = 1;
    let colIncrement = 1;

    if (rectangleBackWidth > 0) {
      initialCol = width - 1;
      colIncrement *= -1;
    }

    if (rectangleBackHeight > 0) {
      initialRow = height - 1;
      rowIncrement *= -1;
    }

    let selectionRow = initialRow;
    let selectionCol = initialCol;

    if (previewOnly) {
      previewChanges = {};
    } else {
      currentChange = {};
    }

    for (let tileY = startY; tileY < startY + height; tileY++) {
      selectionCol = initialCol;
      for (let tileX = startX; tileX < startX + width; tileX++) {
        this.setSelectionTileMaybeMultiLayer(tileX, tileY, selectionCol, selectionRow, previewOnly);
        selectionCol += colIncrement;
      }
      selectionRow += rowIncrement;
    }

    if (previewOnly) {
      SceneManager._scene._spriteset._tilemap.refresh();
      this.maybeRefreshGrid();
    } else {
      this.logChange();
      this.refreshTilemap();
    }
  }

  static maybeRefreshGrid() {
    if (currentLayer !== 5) {
      return;
    }

    // Grid refresh is a heavy operation, so let's limit how often we do it
    if (!gridPreviewBlockHandler) {
      gridPreviewBlockHandler = setTimeout(() => {
        gridPreviewBlockHandler = false;
        if (gridNeedsRefresh) {
          setTimeout(() => {
            this.maybeRefreshGrid();
          }, 50);
        }
      }, 50);

      SceneManager._scene._mapEditorGrid.refresh();
      return;
    }

    gridNeedsRefresh = true;
  }

  static refreshTilemap() {
    previewChanges = {};
    SceneManager._scene._spriteset._tilemap.refresh();
    SceneManager._scene._mapEditorGrid.refresh();
  }

  static copyAutoRectangle(startX, startY, width, height) {
    let index = 0;
    for (let z = 0; z <= 3; z++) {
      multiLayerSelection[z] = Array(width * height);
    }

    for (let tileY = startY; tileY < startY + height; tileY++) {
      for (let tileX = startX; tileX < startX + width; tileX++) {
        for (let z = 0; z <= 3; z++) {
          const tileIndex = this.tileIndex(tileX, tileY, z);
          multiLayerSelection[z][index] = $dataMap.data[tileIndex] || 0;
          selectedTileList[index] = $dataMap.data[tileIndex] || selectedTileList[index] || 0;
          if (!currentTileId) {
            currentTileId = selectedTileList[index];
          }
        }
        index++;
      }
    }
  }

  static copyHigherRectangle(startX, startY, width, height) {
    let index = 0;

    for (let tileY = startY; tileY < startY + height; tileY++) {
      for (let tileX = startX; tileX < startX + width; tileX++) {
        for (let z = 0; z <= 3; z++) {
          const tileIndex = this.tileIndex(tileX, tileY, z);
          selectedTileList[index] = $dataMap.data[tileIndex] || selectedTileList[index] || 0;
          if (!currentTileId) {
            currentTileId = selectedTileList[index];
          }
        }
        index++;
      }
    }
  }

  static copyManualRectangle(startX, startY, width, height) {
    let index = 0;

    for (let tileY = startY; tileY < startY + height; tileY++) {
      for (let tileX = startX; tileX < startX + width; tileX++) {
        const tileIndex = this.tileIndex(tileX, tileY, currentLayer);
        selectedTileList[index] = $dataMap.data[tileIndex] || 0;
        if (!currentTileId) {
          currentTileId = selectedTileList[index];
        }
        index++;
      }
    }
  }

  static copyRectangle(startX, startY, width, height) {
    if (!wasRightButtonDown) {
      return;
    }

    multiLayerSelection = [];
    selectedTileList = Array(width * height);
    currentTileId = 0;

    if (Input.isPressed('shift')) {
      this.copyHigherRectangle(startX, startY, width, height);
    } else if (currentLayer === 7) {
      this.copyAutoRectangle(startX, startY, width, height);
    } else {
      this.copyManualRectangle(startX, startY, width, height);
    }

    tileCols = width;
    tileRows = height;
    messySelection = true;

    if (currentTool == 'eraser') {
      this.restoreLastDrawingTool();
    }

    this.refreshTilemap();
    SceneManager._scene._mapEditorWindow._manualTileSelected = undefined;
    SceneManager._scene._mapEditorWindow.refresh();
    SceneManager._scene._mapEditorWindow.ensureSelectionVisible();
  }

  static restoreLastDrawingTool() {
    if (lastDrawingTool === 'rectangle') {
      this.rectangleButton();
    } else {
      this.pencilButton();
    }
  }

  static isSameKindTileCurrentLayer(layers, index) {
    const size = $gameMap.width() * $gameMap.height();

    if (currentLayer > 3) {
      for (let z = 0; z <= 3; z++) {
        const tileId = $dataMap.data[index + z * size];
        if (!Tilemap.isSameKindTile(tileId, layers[z])) {
          return false;
        }
      }

      return true;
    }

    const tileId = $dataMap.data[index];
    return Tilemap.isSameKindTile(layers[currentLayer], tileId);
  }

  static _maybeValidateTileIndexForCollectionList(list, index, area, initialTileIds) {
    if (area[index] !== undefined) {
      return;
    }

    const height = $gameMap.height();
    const width = $gameMap.width();

    area[index] = this.isSameKindTileCurrentLayer(initialTileIds, index);

    if (!area[index]) {
      return;
    }

    const workLayer = currentLayer <= 3 ? currentLayer : 0;

    const y = this.indexPositionY(index, workLayer);
    const x = index - this.tileIndex(0, y, workLayer);

    const leftIndex = x > 0 ? this.tileIndex(x - 1, y, workLayer) : -1;
    const rightIndex = x < width -1 ? this.tileIndex(x + 1, y, workLayer) : -1;
    const upIndex = y > 0 ? this.tileIndex(x, y - 1, workLayer) : -1;
    const downIndex = y < height - 1 ? this.tileIndex(x, y + 1, workLayer) : -1;

    const maybeAddIndex = (index) => {
      if (index >= 0 && !list.includes(index)) {
        list.push(index);
      }
    };

    maybeAddIndex(leftIndex);
    maybeAddIndex(rightIndex);
    maybeAddIndex(upIndex);
    maybeAddIndex(downIndex);
  }

  static collectFillAreaFrom(mapX, mapY) {
    const list = [];
    const initialTileIds = [];

    const area = {};
    for (let z = 0; z <= 3; z++) {
      const tileIndex = this.tileIndex(mapX, mapY, z);

      initialTileIds[z] = $dataMap.data[tileIndex];
      if (z === currentLayer || (currentLayer === 7 && z === 0)) {
        list.push(tileIndex);
      }
    }

    for (let i = 0; i < list.length; i++) {
      const index = list[i];
      this._maybeValidateTileIndexForCollectionList(list, index, area, initialTileIds);
    }

    return Object.keys(area).filter(key => area[key]);
  }

  static applyFillArea(mapX, mapY) {
    if (!currentTileId) {
      return;
    }

    this.ensureLayerVisibility();
    const affectedArea = this.collectFillAreaFrom(mapX, mapY);
    const height = $gameMap.height();
    const width = $gameMap.width();
    const workLayer = currentLayer <= 3 ? currentLayer : 0;

    currentChange = {};
    for (const tileIndex of affectedArea) {
      const y = this.indexPositionY(tileIndex, workLayer);
      const x = tileIndex - this.tileIndex(0, y, workLayer);

      const xDiff = (x + width - mapX) % tileCols;
      const yDiff = (y + height - mapY) % tileRows;

      this.setSelectionTileMaybeMultiLayer(x, y, xDiff, yDiff, false);
    }

    this.logChange();
    this.refreshTilemap();
  }

  static ensureLayerVisibility() {
    if (!layerVisibility[currentLayer]) {
      layerVisibility[currentLayer] = true;

      if (SceneManager._scene instanceof Scene_Map) {
        SceneManager._scene._mapEditorLayerListWindow.refresh();
      }
    }
  }

  static applySelectedTiles(mapX, mapY) {
    if (!currentTileId) {
      return;
    }

    if (selectedTileList.length < tileCols * tileRows) {
      return;
    }

    this.ensureLayerVisibility();
    let index = 0;
    for (let y = mapY; y < mapY + tileRows; y++) {
      for (let x = mapX; x < mapX + tileCols; x++) {
        if (!$gameMap.isValid(x, y)) {
          continue;
        }

        if (currentLayer === 7 && multiLayerSelection.length) {
          for (let z = 0; z <= 3; z++) {
            this.setMapTile(x, y, z, multiLayerSelection[z][index]);
          }
        } else {
          this.setMapTile(x, y, currentLayer, selectedTileList[index]);
        }

        index++;
      }
    }

    this.refreshTilemap();
  }

  static updateRightTouch(x, y) {
    if (CycloneMapEditor.isRightButtonDown) {
      if (!CycloneMapEditor.wasRightButtonDown) {
        CycloneMapEditor.rectangleStartX = x;
        CycloneMapEditor.rectangleStartY = y;
        CycloneMapEditor.rectangleStartMouseX = TouchInput.x;
        CycloneMapEditor.rectangleStartMouseY = TouchInput.y;
      }

      CycloneMapEditor.rectangleWidth = (x - CycloneMapEditor.rectangleStartX + 1).clamp(0, 30);
      CycloneMapEditor.rectangleHeight = (y - CycloneMapEditor.rectangleStartY + 1).clamp(0, 30);
      CycloneMapEditor.rectangleBackWidth = (CycloneMapEditor.rectangleStartX - x).clamp(0, 30);
      CycloneMapEditor.rectangleBackHeight = (CycloneMapEditor.rectangleStartY - y).clamp(0, 30);

      if (this.crossedHorizontalLoop()) {
        // moved right through the edge, limit the width to it
        if (CycloneMapEditor.rectangleStartX > x) {
          CycloneMapEditor.rectangleWidth = $gameMap.width() - CycloneMapEditor.rectangleStartX;
          CycloneMapEditor.rectangleBackWidth = 0;
        } else if (x > CycloneMapEditor.rectangleStartX) {
          CycloneMapEditor.rectangleBackWidth = CycloneMapEditor.rectangleStartX;
          CycloneMapEditor.rectangleWidth = 0;
        }
      }

      if (this.crossedVerticalLoop()) {
        if (CycloneMapEditor.rectangleStartY > y) {
          CycloneMapEditor.rectangleHeight = $gameMap.height() - CycloneMapEditor.rectangleStartY;
          CycloneMapEditor.rectangleBackHeight = 0;
        } else if (y > CycloneMapEditor.rectangleStartY) {
          CycloneMapEditor.rectangleBackHeight = CycloneMapEditor.rectangleStartY;
          CycloneMapEditor.rectangleHeight = 0;
        }
      }
      SceneManager._scene._spriteset._mapEditorCursor.updateDrawing();
      return;
    }

    if (CycloneMapEditor.wasRightButtonDown) {
      this.updateRectangleReleased();
      return;
    }
  }

  static updateCurrentToolTouch(x, y) {
    switch(CycloneMapEditor.currentTool) {
      case 'fill':
        this.updateFill(x, y);
        break;
      case 'pencil':
        this.updatePencil(x, y);
        break;
      case 'rectangle':
        this.updateRectangle(x, y);
        break;
      case 'eraser':
        this.updateEraser(x, y);
        break;
    }
  }

  static changeRectangleArea(previewOnly = false) {
    let startX = CycloneMapEditor.rectangleStartX;
    let startY = CycloneMapEditor.rectangleStartY;
    let applyWidth = 0;
    let applyHeight = 0;

    if (CycloneMapEditor.rectangleWidth > 0) {
      applyWidth = CycloneMapEditor.rectangleWidth;
    } else if (CycloneMapEditor.rectangleBackWidth > 0) {
      startX -= CycloneMapEditor.rectangleBackWidth;
      applyWidth = CycloneMapEditor.rectangleBackWidth +1;
    }

    if (CycloneMapEditor.rectangleHeight > 0) {
      applyHeight = CycloneMapEditor.rectangleHeight;
    } else if (CycloneMapEditor.rectangleBackHeight > 0) {
      startY -= CycloneMapEditor.rectangleBackHeight;
      applyHeight = CycloneMapEditor.rectangleBackHeight + 1;
    }

    if (applyWidth > 0 && applyHeight > 0) {
      if (CycloneMapEditor.wasRightButtonDown) {
        if (!previewOnly) {
          CycloneMapEditor.copyRectangle(startX, startY, applyWidth, applyHeight);
        }
      } else {
        CycloneMapEditor.applyRectangle(startX, startY, applyWidth, applyHeight, previewOnly);
      }
    }
  }

  static updateRectangleReleased() {
    this.changeRectangleArea();

    CycloneMapEditor.rectangleWidth = 0;
    CycloneMapEditor.rectangleHeight = 0;
    CycloneMapEditor.rectangleBackWidth = 0;
    CycloneMapEditor.rectangleBackHeight = 0;
    SceneManager._scene._spriteset._mapEditorCursor.updateDrawing();
  }

  static crossedHorizontalLoop() {
    if (!$gameMap.isLoopHorizontal()) {
      return false;
    }

    // if moved left but the end position is to the right
    if ((CycloneMapEditor.rectangleStartMouseX > TouchInput.x && CycloneMapEditor.rectangleWidth > 0) ) {
      return true;
    }

    if ((CycloneMapEditor.rectangleStartMouseX < TouchInput.x && CycloneMapEditor.rectangleBackWidth > 0)) {
      return true;
    }

    return false;
  }

  static crossedVerticalLoop() {
    if (!$gameMap.isLoopVertical()) {
      return false;
    }

    if ((CycloneMapEditor.rectangleStartMouseY > TouchInput.y && CycloneMapEditor.rectangleHeight > 0)) {
      return true;
    }

    if ((CycloneMapEditor.rectangleStartMouseY < TouchInput.y && CycloneMapEditor.rectangleBackHeight > 0)) {
      return true;
    }

    return false;
  }

  static updateRectangle(x, y) {
    if (TouchInput.isPressed()) {
      if (!wasPressing) {
        CycloneMapEditor.rectangleStartX = x;
        CycloneMapEditor.rectangleStartY = y;
        CycloneMapEditor.rectangleStartMouseX = TouchInput.x;
        CycloneMapEditor.rectangleStartMouseY = TouchInput.y;
      }

      CycloneMapEditor.rectangleWidth = (x - CycloneMapEditor.rectangleStartX + 1).clamp(0, 30);
      CycloneMapEditor.rectangleHeight = (y - CycloneMapEditor.rectangleStartY + 1).clamp(0, 30);
      CycloneMapEditor.rectangleBackWidth = (CycloneMapEditor.rectangleStartX - x).clamp(0, 30);
      CycloneMapEditor.rectangleBackHeight = (CycloneMapEditor.rectangleStartY - y).clamp(0, 30);

      if (this.crossedHorizontalLoop()) {
        // moved right through the edge, limit the width to it
        if (CycloneMapEditor.rectangleStartX > x) {
          CycloneMapEditor.rectangleWidth = $gameMap.width() - CycloneMapEditor.rectangleStartX;
          CycloneMapEditor.rectangleBackWidth = 0;
        } else if (x > CycloneMapEditor.rectangleStartX) {
          CycloneMapEditor.rectangleBackWidth = CycloneMapEditor.rectangleStartX;
          CycloneMapEditor.rectangleWidth = 0;
        }
      }

      if (this.crossedVerticalLoop()) {
        if (CycloneMapEditor.rectangleStartY > y) {
          CycloneMapEditor.rectangleHeight = $gameMap.height() - CycloneMapEditor.rectangleStartY;
          CycloneMapEditor.rectangleBackHeight = 0;
        } else if (y > CycloneMapEditor.rectangleStartY) {
          CycloneMapEditor.rectangleBackHeight = CycloneMapEditor.rectangleStartY;
          CycloneMapEditor.rectangleHeight = 0;
        }
      }

      this.changeRectangleArea(true);
      SceneManager._scene._spriteset._mapEditorCursor.updateDrawing();
      return;
    }

    if (wasPressing) {
      this.updateRectangleReleased();
      return;
    }
  }

  static updateFill(x, y) {
    if (!TouchInput.isPressed() || wasPressing) {
      return;
    }

    CycloneMapEditor.applyFillArea(x, y);
  }

  static updateEraser(x, y) {
    this.updateRectangle(x, y);
  }

  static updatePencil(x, y) {
    if (TouchInput.isPressed()) {
      if (!currentChange) {
        currentChange = {};
      }

      CycloneMapEditor.applySelectedTiles(x, y);
      return;
    }

    if (wasPressing) {
      CycloneMapEditor.logChange();
    }
  }
}

globalThis.CycloneMapEditor = CycloneMapEditor;
CycloneMapEditor.register();