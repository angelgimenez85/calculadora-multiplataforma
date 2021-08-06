const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain, MenuItem } = electron;


let ventanaPrincipal;

app.on('ready', () => {
    ventanaPrincipal = new BrowserWindow({
        width: 350,
        height: 450,
        resizable: false,
        title: 'Calculadora',
        transparent: true,
        frame: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    ventanaPrincipal.loadURL(`file://${__dirname}/index.html`);

    const plantillaMenu = Menu.buildFromTemplate([
        {
            label: 'Opciones',
            submenu: [
                {
                    label: 'Recargar',
                    accelerator: 'CommandOrControl+R',
                    role: 'reload'
                },
                {
                    label: 'Cerrar',
                    accelerator: 'CommandOrControl+W',
                    role: 'close'
                }
            ]
        }
    ]);

    Menu.setApplicationMenu(plantillaMenu);
});

const menuPrincipal = new Menu();

menuPrincipal.append(
    new MenuItem({
            label: 'Recargar',
            accelerator: 'CommandOrControl+R',
            role: 'reload'
    })
);
menuPrincipal.append(
    new MenuItem({
            label: 'Cerrar',
            accelerator: 'CommandOrControl+W',
            role: 'close'
    })
);

app.on('browser-window-created', (ev, ventana) => {
    ventana.on('context-menu', (e, parametros) => {
        menuPrincipal.popup(ventana, parametros.x, parametros.y);
    });
});

ipcMain.on('show-context-menu', (e) => {
    const ventana = BrowserWindow.fromWebContents(e.sender);
    menuPrincipal.popup(ventana);
});

ipcMain.on('finalizar-aplicacion', () => {
    app.exit();
});