window.onload = function () {

    //----------------------------ページロード後に変数を取得---------------------
    // ビデオ要素
    const video = document.getElementById("media");
    // 再生／中断ボタン
    const playOrPauseButton = document.getElementById("playOrPauseButton");
    // 先頭にボタン
    const stopButton = document.getElementById("stopButton");
    // 少し戻るボタン
    const backButton = document.getElementById("backButton");
    // 少し進むボタン
    const forwardButton = document.getElementById("forwardButton");
    // 高速再生ボタン
    const quickButton = document.getElementById("quickButton");
    // 低速再生ボタン
    const slowButton = document.getElementById("slowButton");
    // 通常再生ボタン
    const normalButton = document.getElementById("normalButton");

    //スキップ時間（秒）の設定
    const SKIP_TIME = 4;



    //------------------------ABリピートの処理

    let repeatTime_A = 0;
    let repeatTime_B = video.duration;
    let enable_loop = false;
    console.log(repeatTime_A, repeatTime_B, enable_loop);



    video.addEventListener("seeking", (e) => {
        const now = video.currentTime;
        if (now > repeatTime_B || now < repeatTime_A) {
            enable_loop = false;
            console.log("repeat is off");
        }
        // else {
        //   enable_loop = true;
        //   console.log("repeat is on");
        // }
    });

    video.addEventListener("timeupdate", (e) => {
        const now = video.currentTime;
        if (enable_loop) {
            if (now > repeatTime_B) {
                video.currentTime = repeatTime_A;
            } else if (now < repeatTime_A) {
                video.currentTime = repeatTime_A;
            }
        }
    });



    //-------------------------各種ボタンが押された時の処理-----------------------------------
    // 再生が開始されたら、ボタンのラベルを変更
    video.addEventListener("play", function () {
        if (video.src) {
            playOrPauseButton.textContent = "停止";
            document.getElementById("rate").innerHTML = video.playbackRate.toFixed(2);
        }
        // this.blur();
    }, false);

    // 一時中断されたら、ボタンのラベルを変更
    video.addEventListener("pause", function () {
        playOrPauseButton.textContent = "再生";
    }, false);

    // 再生／中断ボタンを押された
    playOrPauseButton.addEventListener("click", function () {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }, false);

    // 少し戻るボタンが押されたら、動画の再生位置を変更
    backButton.addEventListener("click", function () {
        video.currentTime = video.currentTime - SKIP_TIME;
    }, false);

    // 少し進むボタンが押されたら、動画の再生位置を変更
    forwardButton.addEventListener("click", function () {
        video.currentTime = video.currentTime + SKIP_TIME;
    }, false);


    // 終了ボタンをクリックされたら、ビデオを一時停止し、再生位置を初期に戻す
    stopButton.addEventListener("click", function () {
        video.pause();
        video.currentTime = video.initialTime || 0;
    }, false);

    // 高速再生ボタンをクリックされたら、再生速度を上げる
    quickButton.addEventListener("click", function () {
        video.playbackRate = video.playbackRate + 0.1;
        document.getElementById("rate").innerHTML = video.playbackRate.toFixed(2);
    }, false);

    // 低速再生ボタンをクリックされたら、再生速度を下げる
    slowButton.addEventListener("click", function () {
        video.playbackRate = video.playbackRate - 0.1;
        document.getElementById("rate").innerHTML = video.playbackRate.toFixed(2);
    }, false);

    // 通常再生ボタンをクリックされたら、再生速度をリセット
    normalButton.addEventListener("click", function () {
        video.playbackRate = 1;
        document.getElementById("rate").innerHTML = video.playbackRate.toFixed(2);
    }, false);




    //---------------------------------------ショートカットキーの処理-----------------------

    window.document.onkeydown = function (evt) {

        const keyCode = evt.code;

        if (evt.shiftKey && !evt.altKey && !evt.ctrlKey && keyCode == "Space") { //Shift+Spaceで少し戻る
            backButton.click();
            evt.preventDefault();//テキストに改行やスペースが入らないようにイベントを無効化する
        }

        if (!evt.shiftKey && !evt.altKey && !evt.ctrlKey && keyCode == "Enter") { //Returnで再生・停止
            playOrPauseButton.click();
            evt.preventDefault();//テキストに改行やスペースが入らないようにイベントを無効化する
        }

        if (!evt.shiftKey && !evt.altKey && !evt.ctrlKey && keyCode == "Space") { //Spaceで再生・停止
            playOrPauseButton.click();
            evt.preventDefault();//テキストに改行やスペースが入らないようにイベントを無効化する
        }


        if (evt.shiftKey && evt.altKey && !evt.ctrlKey && keyCode == "Space") { //Shift+option(alt)+Spaceで少し進める
            forwardButton.click();
            evt.preventDefault();//テキストに改行やスペースが入らないようにイベントを無効化する
        }


        if (evt.target.tagName.toLowerCase() === 'input') {
            return; // input要素での入力中は何もしない
        }
        const now = video.currentTime;
        console.log(evt.key);
        if (evt.shiftKey || evt.ctrlKey || evt.metaKey || evt.altKey || evt.isComposing) return;
        switch (evt.code) {
            case 'KeyA':
                repeatTime_A = now;
                if (now > repeatTime_B) repeatTime_B = video.duration;
                enable_loop = true;
                console.log("repeat", repeatTime_A, repeatTime_B);
                break;
            case 'KeyB':
                repeatTime_B = now < 1 ? 1 : now;
                if (now <= repeatTime_A) repeatTime_A = 0;
                enable_loop = true;
                console.log("repeat", repeatTime_A, repeatTime_B);
                break;
            case 'KeyN':
                enable_loop = !enable_loop;
                console.log("repeat", enable_loop);
                break;
        }


    }





}  // onload処理の終わり


//新しいビデオのパスを取得してセット
function setFilePath() {
    var fileInput = document.getElementById("fileInput");
    file = fileInput.files[0];
    var video = document.getElementById("media");
    video.src = URL.createObjectURL(file);
}


