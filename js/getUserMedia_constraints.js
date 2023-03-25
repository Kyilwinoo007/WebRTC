var vgaButton = document.querySelector("button#vga");
var qvgaButton = document.querySelector("button#qvga");
var hdButton = document.querySelector("button#hd");
var video = document.querySelector("video");
var stream;

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                            ||navigator.mozGetUserMedia;


//To ask only for video
var qvgaConstraints = {
    video:{
       mandatory:{
        maxWidth:320,
        maxHeight:240
       }
    }
};
var vgaconstraints = {
    video:{
        mandatory:{
            maxWidth:640,
            maxHeight:480
        }
    }
};
var hdconstraints = {
    video:{
        mandatory:{
            maxWidth:1280,
            maxHeight:960
        }
    }
};

qvgaButton.onclick = function(){getMdia(qvgaConstraints)};
vgaButton.onclick = function(){getMdia(vgaconstraints)};
hdButton.onclick = function(){getMdia(hdconstraints)};

function successCallback(gotStream){
    //Note :make the return stream available to  console for inspection 
    window.stream = gotStream;
    stream = gotStream;
    if(window.URL){
        //Chrome case : URL.createObjectURL() converts a MediaStream to blob url
        // video.srcObject = window.URL.createObjectURL(stream);
        video.srcObject = gotStream;
    }else{
        // Firefox and Opera: the src of the video can be set directly from the stream
        video.src = gotStream;
    }
    video.play();
}

function errorCallback(error){
    console.log("navigator.getUserMedia error :" , error);
}

function getMdia(constraints){
    if(!!stream){
        video.srcObject = null;
        // stream.stop();
         stream.getVideoTracks()[0].stop();
    }
    navigator.getUserMedia(constraints,successCallback,errorCallback);
}

