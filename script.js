const record_btn = document.querySelector("#record-btn");
// const stop_btn = document.querySelector("#stop-btn");
const pause_resume = document.querySelector("#pause-resume");

record_btn.addEventListener("click", async () => {
    try {
        let stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
        });

        //needed for better browser support
        const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
            ? "video/webm; codecs=vp9"
            : "video/webm"

        let mediaRecorder = new MediaRecorder(stream, {
            mimeType: mime
        })

        let chunks = []
        mediaRecorder.addEventListener('dataavailable', (e) => {
            chunks.push(e.data)
        })

        mediaRecorder.addEventListener('stop', () => {
            let blob = new Blob(chunks, {
                type: chunks[0].type
            })
            let url = URL.createObjectURL(blob)
            let video = document.querySelector("video")
            video.src = url
            let a = document.createElement('a')
            a.href = url
            a.download = 'video.mp4'
            a.click()
        })

        // stop_btn.addEventListener('click', () => {
        //     mediaRecorder.stop();
        //     alert("Video saved")
        // })

        pause_resume.addEventListener('click', () => {
            if(pause_resume.classList.contains('btn')){
                pause_resume.classList.remove("btn")
                pause_resume.classList.add("pause-btn")
                pause_resume.textContent = "Resume"
                mediaRecorder.pause();
            }else{
                pause_resume.classList.remove('pause-btn')
                pause_resume.classList.add('btn')
                pause_resume.textContent = "Pause"
                mediaRecorder.resume();
            }
        });

        //we have to start the recorder manually
        mediaRecorder.start()
    } catch (error) {
        alert("Something went wrong! Please check: ", error);
    }
})
