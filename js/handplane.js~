
var bodyControl = "S";  // s- still, l,r,u,d - left,right, up, down
video = document.getElementById('video');
canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
disp_canvas = document.getElementById('comp');
disp_ctx = disp_canvas.getContext('2d');
navigator.webkitGetUserMedia({audio:false,video:true},function(stream){
    video.src = window.webkitURL.createObjectURL(stream);
    video.addEventListener('play',
        function(){ 
            setInterval(dump, 1000/25);
        }
        )
},function(){
    console.log('denied');
})

width = 300;
function dump(){
    height = video.videoHeight/(video.videoWidth/width);
    video.width = width;
    video.height = height;
    canvas.width = disp_canvas.width = width;
    canvas.height = disp_canvas.height = height;

    ctx.drawImage(video, 0, 0, width, height);
    skin_filter();
}

huemin = 0.0;
huemax = 0.10;
satmin = 0.0;
satmax = 1.0;
valmin = 0.4;
valmx = 1.0;
function skin_filter(){
    img_data = ctx.getImageData(0, 0, width, height);
    var total_pixels = img_data.width*img_data.height;

    for(var i=0;i<total_pixels*4;i+=4){


        r = img_data.data[i];
        g = img_data.data[i+1];
        b = img_data.data[i+2];
        a = img_data.data[i+3];
        hsv = rgb2Hsv(r, g, b);

        if(((hsv[0] > huemin && hsv[0] < huemax)||(hsv[0] > 0.59 && hsv[0] < 1.0))
                &&(hsv[1] > satmin && hsv[1] < satmax)&&(hsv[2] > valmin && hsv[2] < valmx)){
                }else{
                    img_data.data[i] = 0;
                    img_data.data[i+1] = 0;
                    img_data.data[i+2] = 0;
                    img_data.data[i+3] = 0;
                }
    }

    test();
}

function rgb2Hsv(r, g, b){
    r = r/255;
    g = g/255;
    b = b/255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);

    var h, s, v = max;
    var d = max - min;
    s = max ==0 ? 0 : d/max;
    if(max == min){
        h = 0;
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
}

last = false;
thresh = false;
down = false;
wasdown = false;
function test(){
    delt = ctx.createImageData(width, height);
    if(last!=false){
        var totalx=0,totaly=0,totald=0,totaln=delt.width*delt.height;
        var dscl=0,pix=totaln*4;
        while(pix-=4){
            var d=Math.abs(
                    img_data.data[pix]-last.data[pix]
                    )+Math.abs(
                        img_data.data[pix+1]-last.data[pix+1]
                        )+Math.abs(
                            img_data.data[pix+2]-last.data[pix+2]
                            )
                        if(d>thresh){
                            delt.data[pix]=160;
                            delt.data[pix+1]=255;
                            delt.data[pix+2]=
                                delt.data[pix+3]=255
                                totald+=1;
                            totalx+=((pix/4)%width);
                            totaly+=(Math.floor((pix/4)/delt.height));
                        }
                        else{
                            delt.data[pix]=
                                delt.data[pix+1]=
                                delt.data[pix+2]=0;
                            delt.data[pix+3]=0;
                        }
        }
    }

    if(totald){
        down={
            x:totalx/totald,
            y:totaly/totald,
            d:totald
        }
        handledown();
    }

    last=img_data;
    disp_ctx.putImageData(delt,0,0);
}
movethresh=2;
brightthresh=300;
overthresh=1000;
function calibrate(){
    wasdown={
        x:down.x,
        y:down.y,
        d:down.d
    }
}
avg=0;
state=0;
function handledown(){
    avg=0.9*avg+0.1*down.d;
    var davg=down.d-avg,good=davg>brightthresh;
    switch(state){
        case 0:
            if(good){
                state=1;
                calibrate();
            }
            break;
        case 2:
            if(!good){
                state=0;
            }
            break;
        case 1:
            var dx=down.x-wasdown.x,dy=down.y-wasdown.y;
            var dirx=Math.abs(dy)<Math.abs(dx);
            if(dx<-movethresh&&dirx){
                console.log('right');
                bodyControl = "R";
                tetris.moveRight();
            }
            else if(dx>movethresh&&dirx){
                console.log('left');
                bodyControl = "L";
                tetris.moveLeft();
            }
            if(dy>movethresh&&dirx){
                if(davg>overthresh){
                    console.log('over up');
                    bodyControl = "U";
                    tetris.moveUp();

                }
                else{
                    console.log('up');
                    bodyControl = "U";
                    tetris.moveUp();
                }
            }
            else if(dy<-movethresh&&!dirx){
                if(davg>overthresh){
                    console.log('over down');
                    bodyControl = "D";
                    tetris.moveDown();
                }else{
                    console.log('down');
                    bodyControl = "D";
                    tetris.moveDown();
                }
            }
            state=2;
            break;
    }
}


