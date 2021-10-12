// アプリケーション作成用のモジュールを読み込み
const {app, BrowserWindow} = require('electron');


// function gCreateWindow(html_file){
//     win = new BrowserWindow({
//       webPreferences: {
//         nodeIntegration: true,
//         contextIsolation: false
//       },
//       // transparent: true,
//       // frame: false,
//       // toolbar: false
//       // width: 800, height: 600,
//       // fullscreen: true,
//       // alwaysOnTop: true
//     });

//     win.loadFile(html_file);
    
//     // win.webContents.openDevTools();
    
//     return win;
//   }


class TimerApp {
  constructor(work_sec, calm_sec) {
    this.mode = 0; // init
    this.counter = work_sec; // init
    this.intervals = [work_sec, calm_sec];

    this.timer1 = null;
    this.win0 = null;
    this.win1 = null;
    this.wins = [null, null];
    
    this.win0 = this.getWindow(0)
    // this.win1 = this.getWindow(1)

    this.win0.show();
    // this.win1.hide();
  }

  getWindow(win_id){
    console.log(this.timer1);

    if(win_id == 0){
      let win = this.win0;
      if(win===null){

        win = new BrowserWindow({
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false
            },
            width:480, height:360,
            fullscreen: false,
            alwaysOnTop: false
          });

          win.loadFile("work.html");

        this.win0 = win;
        this.win0.on('closed', () => {
          this.win0 = null;
        });

        var timerTime = this.counter;
        win.webContents.on('did-finish-load', () => {
            win.webContents.send('timer-change',  timerTime);
        });

      }

      return win;

    }else if(win_id==1){

      let win = this.win1;

      if(win===null){
        win = new BrowserWindow({
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false
            },
            fullscreen: true,
            alwaysOnTop: true
          });

          win.loadFile("calm.html");

        this.win1 = win;
        // this.win1.on('close', (e) => {
          // e.preventDefault();
          // this.win1 = null;
        // });
        this.win1.on('closed', () => {
          this.win1 = null;
        });

        var timerTime = this.counter;
        win.webContents.on('did-finish-load', () => {
          win.webContents.send('timer-change',  timerTime);
        });

      }

      return win;

    }
  }

  showWindow(win_id){
    console.log('showWindow');
    console.log(win_id);

    let win = this.getWindow(win_id);

    console.log(win);

    win.show();
    win.moveTop();
  }


  hideWindow(win_id){
    console.log('hideWindow');
    console.log(win_id);
    // let win = this.getWindow(win_id);
    switch(win_id){
      case 0:
        if(this.win0===null){this.win0.hide();};
        break;
      case 1:
        if(this.win1===null){this.win1.hide();};
        break;
    }
    // console.log(win);
    // win.hide();
  }

  closeWindow(win_id){
    console.log('closeWindow');
    console.log(win_id);
    // let win = this.getWindow(win_id);
    switch(win_id){
      case 0:
        if(this.win0!==null){this.win0.close();};
        break;
      case 1:
        if(this.win1!==null){this.win1.close();};
        break;
    }
  }


  showCurrentWindow(){
    this.showWindow(this.mode);
  }

  main(){

    let mode = this.mode;

    this.counter -= 1;

    console.log(this.counter);

    if(this.counter <= 0){
      if(mode == 0){
        this.mode = 1;
      }else if(mode == 1){
        this.mode = 0;
      }

      this.counter = this.intervals[this.mode];

      if(mode == 0){
        this.closeWindow(0);
        this.showWindow(1);
        this.mode = 1;
      }else if(mode == 1){
        this.closeWindow(1);
        this.showWindow(0);
        this.mode = 0;
      }
    }
  }

  stop(){
    clearInterval(this.timer1);
  }

  start(){
    this.timer1 = setInterval(()=>{
      this.main();
    }, 1000);
  }

}

// ************************************************************
//
// sequences
//
// ************************************************************

let timer_app;

function startTimerApp(){
  // timer_app = new TimerApp(25*60, 5*60);
  timer_app = new TimerApp(5, 50); // [sec]
  timer_app.start();
}

// ************************************************************
//
// sequences
//
// ************************************************************

//  初期化が完了した時の処理
app.on('ready', startTimerApp);

// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  // macOSのとき以外はアプリケーションを終了させます
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  timer_app.showCurrentWindow();
});

