
var localStream, localPeerConnection,remotePeerConnection;
var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangUpButton = document.getElementById("hangUpButton");

startButton.disabled = false;
callButton.disabled = true;
hangUpButton.disabled = true;

startButton.onclick = start;
callButton.onclick = call;
hangUpButton.onclick = hangUp;

function log(text) {
    console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> " + text);
}
function successCallback(stream){
    if(window.URL){
        //Chrome case : URL.createObjectURL() converts a MediaStream to blob url
        // video.srcObject = window.URL.createObjectURL(stream);
        localVideo.srcObject = stream;
    }else{
        // Firefox and Opera: the src of the video can be set directly from the stream
        localVideo.src = stream;
    }
    localStream = stream;
    callButton.disabled = false;
}

function start(){
    startButton.disabled = true;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
                            ||navigator.mozGetUserMedia;
    
                            
    navigator.getUserMedia({audio:true,video:true},successCallback,
        function(error){
            log("navigation.getUserMedia error:",error);
        });                           
}

function call(){
    callButton.disabled =true;
    hangUpButton.disabled = false;
    log("start Calling");
    // Note that getVideoTracks() and getAudioTracks() are not currently // supported in Firefox...
    // ...just use them with Chrome
    if(navigator.webkitGetUserMedia){
        if(localStream.getVideoTracks().length > 0){
            log('Using video device: ' + localStream.getVideoTracks()[0].label);
        }
        if(localStream.getAudioTracks().length > 0){
            log('Using audio device: ' + localStream.getAudioTracks()[0].label);
        }
    }

    //Chrome
    if(navigator.webkitGetUserMedia){
        RTCPeerConnection = webkitRTCPeerConnection;
    }else if(navigator.mozGetUserMedia){  //firefox
        RTCPeerConnection = mozRTCPeerConnection;
        RTCSessionDescription = mozRTCSessionDescription;
        RTCIceCandidate = mozRTCIceCandidate;
    }
    log("RTCPeerConnection object: " + RTCPeerConnection);

    var servers = null;


    //create the local PeerConnection object
    localPeerConnection = new RTCPeerConnection(servers);
    log("Created local peer connection object localPeerConnection");
    localPeerConnection.onicecandidate = gotLocalIceCandidate;

    //creat remote PeerConnection object
    remotePeerConnection = new RTCPeerConnection(servers);
    log("Created remote peer connection object remotePeerConnection");
    // Add a handler associated with ICE protocol events...
    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
    // ...and a second handler to be activated as soon as the remote // stream becomes available.
    remotePeerConnection.onaddstream = gotRemoteStream;

    // Add the local stream (as returned by getUserMedia()) // to the local PeerConnection.
    localPeerConnection.addStream(localStream);
    log("Added localStream to localPeerConnection");

    localPeerConnection.createOffer(gotLocalDescription,onSignalingError);
}

function onSignalingError(error){
    console.log('Failed to create signaling message : ' + error.name);
}
function gotLocalDescription(description){
    localPeerConnection.setLocalDescription(description);
    log("Offer from localPeerConnection: \n" + description.sdp);

    // ...do the same with the 'pseudoremote' PeerConnection
// Note: this is the part that will have to be changed if you want // the communicating peers to become remote
// (which calls for the setup of a proper signaling channel)

    remotePeerConnection.setRemoteDescription(description);
    remotePeerConnection.createAnswer(gotRemoteDescription,onSignalingError);

}
function gotRemoteDescription(description){
    remotePeerConnection.setLocalDescription(description);
    log("Answer from remotePeerConnection: \n" + description.sdp);
    // Conversely, set the remote description as the remote description of the // local PeerConnection
    localPeerConnection.setRemoteDescription(description);
}
function hangUp(){
    log("Ending call");
// Close PeerConnection(s) l
localPeerConnection.close(); 
remotePeerConnection.close();
// Reset local variables
localPeerConnection = null;
remotePeerConnection = null;
// Disable Hangup button
hangUpButton.disabled = true;
// Enable Call button to allow for new calls to be established 
callButton.disabled = false;
}

    // Handler to be called as soon as the remote stream becomes available
function gotRemoteStream(event){
    // Associate the remote video element with the retrieved stream

    //chrome
    if(window.URL){
        remoteVideo.srcObject = event.stream;
    }else{
        remoteVideo.src = event.stream;
    }
    log("Received remote stream");
}
function gotLocalIceCandidate(event){
    if(event.candidate){
    // Add candidate to the remote PeerConnection
     remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
     log("Local ICE candidate: \n" + event.candidate.candidate);
    }
}
function gotRemoteIceCandidate(event){
    if(event.candidate){
       // Add candidate to the local PeerConnection
       localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
       log("Remote ICE candidate: \n " + event.candidate.candidate);
    
    }
}