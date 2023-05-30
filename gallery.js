setTimeout(() => {
    if(db){

        //video retrieval
        let videoTransaction = db.transaction("video", "readonly");
        let videoStore = videoTransaction.objectStore("video");
        let videoRequest = videoStore.getAll();
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            videoResult.forEach((videoObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", videoObj.id);

                let url = URL.createObjectURL(videoObj.blobData);

                mediaElem.innerHTML = ` 
                    <div class="media">
                        <video autoplay loop src="${url}"></video>
                    </div>
                    <div class="download action-btn">DOWNLOAD<i class="fa fa-download" style="padding:5px"></i></div>
                    <div class="delete action-btn">DELETE<i class="fa fa-trash" style="padding:5px"></i></div>
                `;

                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click", deleteMedia);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click", downloadMedia);
                
                galleryCont.appendChild(mediaElem);
            })
        }
        
        //image retrieval
        let imageTransaction = db.transaction("image", "readonly");
        let imageStore = imageTransaction.objectStore("image");
        let imageRequest = imageStore.getAll();
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            let galleryCont = document.querySelector(".gallery-cont");
            imageResult.forEach((imageObj) => {
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class", "media-cont");
                mediaElem.setAttribute("id", imageObj.id);

                let url = imageObj.url;

                mediaElem.innerHTML = ` 
                    <div class="media">
                    <img src="${url}"></img>
                    </div>
                    <div class="download action-btn">DOWNLOAD<i class="fa fa-download" style="padding:5px"></i></div>
                    <div class="delete action-btn">DELETE<i class="fa fa-trash" style="padding:5px"></i></div>
                    `;

                    let deleteBtn = mediaElem.querySelector(".delete");
                    deleteBtn.addEventListener("click", deleteMedia);
                    let downloadBtn = mediaElem.querySelector(".download");
                    downloadBtn.addEventListener("click", downloadMedia);
                    
                    galleryCont.appendChild(mediaElem);
                })
            }
    }
}, 100);

function deleteMedia(e){
    //db remove
    let id = e.target.parentElement.getAttribute("id");
    if(id.slice(0, 3) === "vid"){
        let videoTransaction = db.transaction("video", "readwrite");
        let videoStore = videoTransaction.objectStore("video");
        videoStore.delete(id);
    }
    else if(id.slice(0, 3) === "img"){
        let imageTransaction = db.transaction("image", "readwrite");
        let imageStore = imageTransaction.objectStore("image");
        imageStore.delete(id);
    } 

    //ui remove
    e.target.parentElement.remove();
}

function downloadMedia(e){
    let id = e.target.parentElement.getAttribute("id");
    let type = id.slice(0, 3); //slice 0 to 2, index 3 is remain

    if(type === "vid"){
        let videoTransaction = db.transaction("video", "readwrite");
        let videoStore = videoTransaction.objectStore("video");
        let videoRequest = videoStore.get(id);
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;

            let videoURL = URL.createObjectURL(videoResult.blobData);
            let a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    }
    else if(type === "img"){
        let imageTransaction = db.transaction("image", "readwrite");
        let imageStore = imageTransaction.objectStore("image");
        let imageRequest = imageStore.get(id);
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;

            let a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpg";
            a.click();
        }
    }
}