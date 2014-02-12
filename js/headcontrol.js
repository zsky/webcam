 var canvas = document.getElementById('radar');
 var radarCtx = canvas.getContext('2d');
  

        // 定位坐标为画布中心
        radarCtx.translate(canvas.width / 2, canvas.height / 2);

        var radar = new Radar({
            ctx: radarCtx,
            width: canvas.width,
            height: canvas.height
        });

        radar.init();

var bodyControl = "S";  // s- still, l,r,u,d - left,right, up, down


statusMessages = {
    "whitebalance" : "checking for stability of camera whitebalance",
    "detecting" : "Detecting face",
    "hints" : "Hmm. Detecting the face is taking a long time",
    "redetecting" : "Lost track of face, redetecting",
    "lost" : "Lost track of face",
    "found" : "Tracking face"
};

var video = document.getElementById('video');
var canvas = document.getElementById('input');
var overlay = document.getElementById('overlay');
var debug = document.getElementById('debug');

var debugCheck = document.querySelector('.debug');
var message = document.querySelector('.message');
var overlayCtx = overlay.getContext('2d');

var htracker = new headtrackr.Tracker({calcAngles: true, ui: false, debug: debug});
htracker.init(video, canvas);
htracker.start();

debugCheck.addEventListener('change', function(e){
    if(debugCheck.checked){
        debug.style.display = 'block';
    }else{
        debug.style.display = 'none';
    }
})

document.addEventListener('headtrackrStatus', function(event){
    if (event.status in statusMessages){
        message.innerHTML = statusMessages[event.status];
    } else { 
        message.innerHTML = 'oh, denied';
    }

});


document.addEventListener('facetrackingEvent', function(event){
    // radar canvas
    coord = discrete(event.x, event.y);
    bodyEvent(coord[0]);


    radar.point(coord[0], 0);

    // clear canvas
    overlayCtx.clearRect(0,0,320,240);
    // once we have stable tracking, draw rectangle
    if (event.detection == "CS") {
        overlayCtx.translate(event.x, event.y);
        overlayCtx.rotate(event.angle-(Math.PI/2));
        overlayCtx.strokeStyle = "#00CC00";
        overlayCtx.strokeRect((-(event.width/2)) >> 0, (-(event.height/2)) >> 0, event.width, event.height);
        overlayCtx.rotate((Math.PI/2)-event.angle);
        overlayCtx.translate(-event.x, -event.y);
    }
    //faceX.innerHTML = event.x;
    //faceY.innerHTML = event.y;

});



    function discrete(x, y){
        // 平均值，表征中间位置
        var X_AVERAGE = 89;
        var Y_AVERAGE = 124;
        // 阈区间
        var X_THRESHOLD = 0.3;
        var Y_THRESHOLD = 0.3;
        
        var min_x = X_AVERAGE * (1 - X_THRESHOLD);
        var max_x = X_AVERAGE * (1 + X_THRESHOLD);

        var min_y = Y_AVERAGE * (1 - Y_THRESHOLD);
        var max_y = Y_AVERAGE * (1 + Y_THRESHOLD);
        
        var result = new Array();

        if(x > min_x && x < max_x){
            result[0] = 0;
        }
        else{
            if(x < min_x){
                result[0] = 1;
            }
            else{
                result[0] = -1;
            }
        }

        if(y > min_y && y < min_y){
            result[1] = 0;
        }
        else{
            if(y < min_y){
                result[1] = -1;
            }
            else{
                result[1] = 1;
            }
        }

        return result;
    }
