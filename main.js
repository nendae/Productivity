const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron
// process.env.NODE_ENV = 'production'
let mainWindow
let addWindow


//listen for the app to be ready
app.on('ready', function (){
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
      }
  })
  //fancy way to create path into url
  mainWindow.loadURL(url.format({
    pathname:path.join(__dirname, 'mainWindow.html'),
    protocol:'file:',
    slashes:true
  }))

  mainWindow.on('close', function(){
    app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
})

function createAddWindow(){
  addWindow = new BrowserWindow({
    width:300,
    height:200,
    title:'Add website to block',
    webPreferences: {
      nodeIntegration: true
      }
  })
  //fancy way to create path into url
  addWindow.loadURL(url.format({
    pathname:path.join(__dirname, 'addWindow.html'),
    protocol:'file:',
    slashes:true
  }))
  //garbage collection
  addWindow.on('close', function(){
    addWindow = null
  })
}

ipcMain.on('item:add', function(evt, item){
  console.log(item)
  mainWindow.webContents.send('item:add', item)
  addWindow.close()
})

const mainMenuTemplate = [
  {
    label:'File',
    submenu: [
      {
        label: 'Add website',
        click(){
          createAddWindow()
        }
      },
      {
        label: 'Clear websites',
        click(){
          mainWindow.webContents.send('item:clear')
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform == 'darwin'?
          'Command+Q':'Ctrl+Q',
        click(){
          app.quit()
       }
      }

    ]
  }
]

//if mac add empty object to menuTemplate
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({label:'',})
  }

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
      label:'Developer Tools',
      accelerator: process.platform == 'darwin'?
          'Command+I':'Ctrl+I',
    submenu:[
      {
        label: 'Toggel DevTools',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools()
        }
      },
      {
        role:'reload'
      }
    ]})
    }
