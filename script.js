let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";
let recordFlag = false;
let recorder;
let capturePressed = false;
let chunks = []; //mediaData in chunks

let constraints = {
    video: true,
    audio: true
}
navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=> {
    video.srcObject = stream;
    recorder = new MediaRecorder(stream);

    recorder.addEventListener('start', (e) => {
        chunks = [];
    })
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    })
    recorder.addEventListener("stop", (e) => {
        //conversion of chunks to media(video)
        let blob = new Blob(chunks, {type : "video/mp4"});

        if(db){
            let videoId = shortid();
            let dbTransaction = db.transaction("video", "readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `video-${videoId}`,
                blobData: blob
            }
            videoStore.add(videoEntry);
        }

        // let videoURL = URL.createObjectURL(blob);
        // let a = document.createElement("a");
        // a.href = videoURL;
        // a.download = "stream.mp4";
        // a.click();
    })
})

recordBtnCont.addEventListener("click", (e) => {
    if(!recorder) return;
    recordFlag = !recordFlag;

    if(recordFlag){
        recorder.start();
        recordBtn.classList.add("rec-anim");
        startTimer();
    }else{
        recorder.stop();
        recordBtn.classList.remove("rec-anim");
        stopTimer();
    }
})

captureBtn.addEventListener("click", (e)=>{
    captureBtn.classList.add("cap-anim");
    
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext("2d");
    tool.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();
    
    if(db){
        let imageId = shortid();
        let dbTransaction = db.transaction("image", "readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageId}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }
    
    // let a = document.createElement("a");
    // a.href = imageURL;
    // a.download = "image.jpg";
    // a.click();
    
    setTimeout(() => {
        captureBtn.classList.remove("cap-anim");
    }, 500);
})

let timerId;
let counter = 0;
let timer = document.querySelector(".timer");
function startTimer(){
    function displayTimer(){
        timer.style.display = "block";
        let tmp = counter;
        let hr = Number.parseInt(tmp/3600);
        tmp = tmp%3600;
        let min = Number.parseInt(tmp/60);
        tmp = tmp%60;
        let sec = tmp;
        
        hr = (hr<10) ? `0${hr}`: hr;
        min = (min<10) ? `0${min}`: min;
        sec = (sec<10) ? `0${sec}`: sec;
        
        timer.innerText = `${hr}:${min}:${sec}`;
        counter++;
    }
    timerId = setInterval(displayTimer, 1000);
}

function stopTimer(){
    counter = 0;
    clearInterval(timerId);
    timer.innerText = "00:00:00";
    timer.style.display = "none";
}

//filter
let allFilters = document.querySelectorAll(".filter");
let filterLayer = document.querySelector(".filter-layer");
allFilters.forEach(filterElem => {
    filterElem.addEventListener("click", (e) => {
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filterLayer.style.backgroundColor = transparentColor;
    })
});
