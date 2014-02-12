require(['lib/headtrackr', 'js/radar'], function(h, Radar) {
    var htracker = new h.Tracker({
        // ui: false,
        calcAngles: true
    });

    // function faceTrackerRect(ctx, x, y, width, height, angle) {
    //     ctx.clearRect(320, 240);
    //     ctx.traslate(x, y);
    //     ctx.rotate(angle - (Math.PI) / 2);
    //     ctx.strokeStyle = 'green';
    //     ctx.strokeRect((-(x / 2)) >> 0, (-(y / 2)) >> 0, width, height);
    //     ctx.rotate((Math.PI / 2) - angle);
    //     ctx.translate(-x, -y);
    // }

    $(function() {
        var videoInput = $('#inputVideo')[0];
        var canvasInput = $('#inputCanvas')[0];
        // var overlay = $('#overlay')[0];
        // var overlayContext = overlay.getContext('2d');
        var output = $('#output');

        htracker.init(videoInput, canvasInput);
        htracker.start();

        var canvas = $('#radar')[0];
        var ctx = canvas.getContext('2d');

        // 定位坐标为画布中心
        ctx.translate(canvas.width / 2, canvas.height / 2);

        var radar = new Radar({
            ctx: ctx,
            width: canvas.width,
            height: canvas.height
        });

        radar.init();

        document.addEventListener('facetrackingEvent', function(event) {
            var str = 'height: ' + event.height + '<br>';
            str += 'width: ' + event.width + '<br>';
            str += 'angle: ' + (event.angle / Math.PI) * 180 + '<br>';
            str += 'x-pos: ' + event.x + '<br>';
            str += 'y-pos: ' + event.y + '<br>';
            output.html(str);

            // var params = {
                // x: event.x, 
                // y: event.y
            // };

            // $.post('http://localhost:5000/note', params);

            coord = discrete(event.x, event.y);
            bodyEvent(coord);


            radar.point(coord[0], 0);
        });

        document.addEventListener('headtrackingEvent', function(event) {
            // console.log(event.x, event.y, event.z);
        });

    });

    function bodyEvent(coord){
        if(coord[0] == 1){
            console.log('R');

        } else if(coord[0] == -1){
            console.log('L');

        } else if(coord[0] == 0){
            console.log('S');

        }
    }

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
});
