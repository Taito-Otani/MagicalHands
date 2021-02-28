var s = function(p) {
  let handpose;
  let video;
  let predictions = [];
  var v1 = 0;
  var v2 = 0;
  var v3 = 0;
  //--------------- Setup ---------------------
  p.setup = function() {
    p.createCanvas(innerWidth, innerHeight);
    // カンマ区切りで入力したい値を追加できます。
    video = p.createCapture(p.VIDEO);
    video.size(p.width, p.height);
    p.frameRate(30);

    handpose = ml5.handpose(video, p.modelReady);

    // This sets up an event that fills the global variable "predictions"
    // with an array every time new hand poses are detected
    handpose.on("predict", results => {
      predictions = results;
    });

    // Hide the video element, and just show the canvas
    video.hide();
    window.max.bindInlet('set_value', function(_v1, _v2, _v3) {
      v1 = _v1;
      v2 = _v2;
      v3 = _v3;
    });
  };

  p.modelReady = function() {

    console.log("Model ready!");
  }
  //--------------- Draw ---------------------
  p.draw = function() {
    p.background(0);
    p.push();
    p.scale(-1, 1);
    p.image(video, -p.width, 0, p.width, p.height);
    // We can call both functions to draw all keypoints and the skeletons
    //           p.drawKeypoints();
    // カンマ区切りで出力したい値を追加できます
    var pointX = [];
    var pointY = [];

    p.noStroke();
    for (let i = 0; i < predictions.length; i++) {
      const prediction = predictions[i];

      for (let j = 0; j < prediction.landmarks.length; j++) {
        const keypoint = prediction.landmarks[j];
        if (j == 5) {
          pointX[0] = keypoint[0];
          pointY[0] = keypoint[0];
        } else if (j == 9) {
          pointX[1] = keypoint[0];
          pointY[1] = keypoint[0];
        } else if (j == 13) {
          pointX[2] = keypoint[0];
          pointY[2] = keypoint[0];
        } else if (j == 17) {
          pointX[3] = keypoint[0];
          pointY[3] = keypoint[0];
        }
        p.fill(13 * j, 175, i);
        p.ellipse(keypoint[0] * 0.5 - p.width, keypoint[1] * 0.5, 10, 10);
      }
    }
    p.pop();
    p.fill(255, 100, 0, 20);
    p.rect(p.width*0.5-p.width*0.3, p.height*0.5-p.height*0.3, p.width*0.6,p.height*0.6);
    let dist = p.sqrt(p.pow(pointX[2] - pointX[0], 2) + p.pow(pointY[2] - pointY[0], 2));
    window.max.outlet('output', p.frameCount, p.windowWidth, dist);


  };

  // マウスを押した時に呼ばれる関数
  p.mousePressed = function() {

  }
  //  p.drawKeypoints = function() {
  //   p.fill(255, 175, 0);
  //   p.noStroke();
  //   for (let i = 0; i < predictions.length; i ++) {
  //     const prediction = predictions[i];
  //     for (let j = 0; j < prediction.landmarks.length; j ++) {
  //       const keypoint = prediction.landmarks[j];
  //
  //       p.ellipse(keypoint[0]*0.5 - p.width, keypoint[1]*0.5, 10, 10);
  //     }
  //   }
  // }

  //--------------- ReSize---------------------
  //画面サイズの自動調整
  p.windowResized = function() {
    p.resizeCanvas(innerWidth, innerHeight);
  }

};

const myp5 = new p5(s);
