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
    // A点設定ボタン
    const setAButton = document.getElementById("setAButton");
    // B点設定ボタン
    const setBButton = document.getElementById("setBButton");
    // A-B開始/停止ボタン
    const toggleLoopButton = document.getElementById("toggleLoopButton");
    // A-B解除ボタン
    const clearLoopButton = document.getElementById("clearLoopButton");
    // ショートカット用のフォーカス受け皿
    const controller = document.getElementById("controller");
    // A-B状態表示
    const loopStatus = document.getElementById("loopStatus");
    const repeatTimeAElement = document.getElementById("repeatTimeA");
    const repeatTimeBElement = document.getElementById("repeatTimeB");

    //スキップ時間（秒）の設定
    const SKIP_TIME = 4;



    //------------------------ABリピートの処理

    let repeatTime_A = 0;
    let repeatTime_B = Infinity;
    let enable_loop = false;
    let hasLoopRange = false;
    console.log(repeatTime_A, repeatTime_B, enable_loop);

    function formatTime(seconds) {
        if (!Number.isFinite(seconds)) {
            return "--:--";
        }

        const totalSeconds = Math.max(0, Math.floor(seconds));
        const minutes = Math.floor(totalSeconds / 60);
        const remainSeconds = totalSeconds % 60;
        return String(minutes).padStart(2, "0") + ":" + String(remainSeconds).padStart(2, "0");
    }

    function updateLoopDisplay() {
        if (!hasLoopRange) {
            loopStatus.textContent = "未設定";
            toggleLoopButton.textContent = "リピート開始";
        } else if (enable_loop) {
            loopStatus.textContent = "リピート中";
            toggleLoopButton.textContent = "リピート停止";
        } else {
            loopStatus.textContent = "一時停止中";
            toggleLoopButton.textContent = "リピート開始";
        }
        repeatTimeAElement.textContent = hasLoopRange ? formatTime(repeatTime_A) : "--:--";
        repeatTimeBElement.textContent = hasLoopRange && Number.isFinite(repeatTime_B) ? formatTime(repeatTime_B) : "--:--";
    }

    function pauseLoop() {
        enable_loop = false;
        updateLoopDisplay();
        console.log("repeat", enable_loop);
    }

    function resumeLoop() {
        if (!hasLoopRange) {
            updateLoopDisplay();
            return;
        }
        video.currentTime = repeatTime_A;
        enable_loop = true;
        updateLoopDisplay();
        console.log("repeat", repeatTime_A, repeatTime_B);
    }

    function clearLoopRange() {
        enable_loop = false;
        hasLoopRange = false;
        repeatTime_A = 0;
        repeatTime_B = Number.isFinite(video.duration) ? video.duration : Infinity;
        updateLoopDisplay();
        console.log("repeat", enable_loop);
    }

    function setRepeatPointA() {
        const now = video.currentTime;
        repeatTime_A = now;
        if (now > repeatTime_B) {
            repeatTime_B = Number.isFinite(video.duration) ? video.duration : Infinity;
        }
        hasLoopRange = true;
        enable_loop = true;
        if (video.currentTime < repeatTime_A || video.currentTime > repeatTime_B) {
            video.currentTime = repeatTime_A;
        }
        updateLoopDisplay();
        console.log("repeat", repeatTime_A, repeatTime_B);
    }

    function setRepeatPointB() {
        const now = video.currentTime;
        repeatTime_B = now < 1 ? 1 : now;
        if (now <= repeatTime_A) {
            repeatTime_A = 0;
        }
        hasLoopRange = true;
        enable_loop = true;
        updateLoopDisplay();
        console.log("repeat", repeatTime_A, repeatTime_B);
    }

    updateLoopDisplay();

    video.addEventListener("loadedmetadata", function () {
        repeatTime_A = 0;
        repeatTime_B = video.duration;
        enable_loop = false;
        hasLoopRange = false;
        updateLoopDisplay();
    }, false);

    video.addEventListener("seeked", function () {
        controller.focus({ preventScroll: true });
    }, false);



    video.addEventListener("seeking", (e) => {
        const now = video.currentTime;
        if (now > repeatTime_B || now < repeatTime_A) {
            pauseLoop();
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
        video.playbackRate = Math.min(video.playbackRate + 0.1, 4);
        document.getElementById("rate").innerHTML = video.playbackRate.toFixed(2);
    }, false);

    // 低速再生ボタンをクリックされたら、再生速度を下げる
    slowButton.addEventListener("click", function () {
        video.playbackRate = Math.max(video.playbackRate - 0.1, 0.1);
        document.getElementById("rate").innerHTML = video.playbackRate.toFixed(2);
    }, false);

    // 通常再生ボタンをクリックされたら、再生速度をリセット
    normalButton.addEventListener("click", function () {
        video.playbackRate = 1;
        document.getElementById("rate").innerHTML = video.playbackRate.toFixed(2);
    }, false);

    setAButton.addEventListener("click", function () {
        setRepeatPointA();
        controller.focus({ preventScroll: true });
    }, false);

    setBButton.addEventListener("click", function () {
        setRepeatPointB();
        controller.focus({ preventScroll: true });
    }, false);

    toggleLoopButton.addEventListener("click", function () {
        if (enable_loop) {
            pauseLoop();
        } else {
            resumeLoop();
        }
        controller.focus({ preventScroll: true });
    }, false);

    clearLoopButton.addEventListener("click", function () {
        clearLoopRange();
        controller.focus({ preventScroll: true });
    }, false);




    //---------------------------------------ショートカットキーの処理-----------------------

    window.document.onkeydown = function (evt) {
        if (evt.target.tagName.toLowerCase() === 'input') {
            return; // input要素での入力中は何もしない
        }

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

        console.log(evt.key);
        if (evt.shiftKey || evt.ctrlKey || evt.metaKey || evt.altKey || evt.isComposing) return;
        switch (evt.code) {
            case 'KeyA':
                setRepeatPointA();
                break;
            case 'KeyB':
                setRepeatPointB();
                break;
            case 'KeyN':
                pauseLoop();
                break;
        }


    }





}  // onload処理の終わり


//新しいビデオのパスを取得してセット
function setFilePath() {
    var fileInput = document.getElementById("fileInput");
    var file = fileInput.files[0];
    if (!file) {
        return;
    }
    var video = document.getElementById("media");
    video.src = URL.createObjectURL(file);
}
