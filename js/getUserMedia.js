navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                            ||navigator.mozGetUserMedia;


//To ask only for video
var constraints = {audio : false, video:true};
var video = document.querySelector("video");

function successCallback(stream){
    //Note :make the return stream available to  console for inspection 
    window.stream = stream;
    if(window.URL){
        //Chrome case : URL.createObjectURL() converts a MediaStream to blob url
        // video.srcObject = window.URL.createObjectURL(stream);
        video.srcObject = stream;
    }else{
        // Firefox and Opera: the src of the video can be set directly from the stream
        video.src = stream;
    }
    video.play();
}

function errorCallback(error){
    console.log("navigator.getUserMedia error :" , error);
}

navigator.getUserMedia(constraints,successCallback,errorCallback);