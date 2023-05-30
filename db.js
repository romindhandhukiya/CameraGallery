let db;
let openReq = indexedDB.open("myDataBase");

openReq.addEventListener("success", (e)=> {
    db = openReq.result;
})

openReq.addEventListener("error", (e)=> {
    console.log(error);
})

openReq.addEventListener("upgradeneeded", (e)=>{
    db = openReq.result;
    
    db.createObjectStore("video", { keyPath: "id" });
    db.createObjectStore("image", { keyPath: "id" });
})