const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const resetBtn = document.getElementById('resetBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const videoContainer = document.getElementById('videoContainer');
const errorMessage = document.getElementById('errorMessage');
const successToast = document.getElementById('successToast');
const radios = document.querySelectorAll('input[name="choice"]');
var checked = "";
radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {(
        checked = radio.value);
        // alert('You selected: ' + radio.value);
      }
    });
  });
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropZone.classList.add('dragging');
}

function unhighlight() {
    dropZone.classList.remove('dragging');
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

browseBtn.addEventListener('click', () => {
    fileInput.click();
});

resetBtn.addEventListener('click', () => {
    fileInput.value = '';
    videoContainer.innerHTML = '';
    progressContainer.style.display = 'none';
    progressBar.style.width = '0%';
    progressText.textContent = '0% Complete';
    errorMessage.style.display = 'none';
    successToast.classList.remove('show');
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function showSuccess() {
    successToast.classList.add('show');
    setTimeout(() => {
        successToast.classList.remove('show');
    }, 5000);
}

function handleFiles(files) {
    if (files.length === 0) return;
    
    const file = files[0];
    const formData = new FormData();
    formData.append('files', file);

    videoContainer.innerHTML = '';
    errorMessage.style.display = 'none';

    const originalVideoCard = createVideoCard(file, 'Original Image');
    videoContainer.appendChild(originalVideoCard);

    const processedVideoCard = createVideoCard(null, 'Processed Image');
    videoContainer.appendChild(processedVideoCard);
    formData.append('checked', checked)
    uploadFile(formData);
}

function createVideoCard(file, title) {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    
    const video = document.createElement('img');
    video.controls = true;
    
    if (file) {
        video.src = URL.createObjectURL(file);
    }
    
    const content = document.createElement('div');
    content.className = 'video-card-content';
    
    const titleElement = document.createElement('h3');
    titleElement.className = 'video-card-title';
    titleElement.textContent = title;
    
    content.appendChild(titleElement);
    
    if (file) {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(file);
        downloadLink.className = 'download-btn';
        downloadLink.download = file.name;
        downloadLink.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Image
        `;
        content.appendChild(downloadLink);
    }
    
    videoCard.appendChild(video);
    videoCard.appendChild(content);
    return videoCard;
}

function uploadFile(formData) {
    
    
    progressContainer.style.display = 'block';
    let progress = 0;
    const duration = 60000; // 60 seconds
    const interval = 100; // Update every 100ms
    const step = (100 * interval) / duration;
    
    const progressInterval = setInterval(() => {
        progress = Math.min(progress + step, 99);
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '% Complete';
    }, interval);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);

    xhr.onload = function() {
        clearInterval(progressInterval);
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            progressBar.style.width = '100%';
            progressText.textContent = '100% Complete';
            
            setTimeout(() => {
                progressContainer.style.display = 'none';
                showSuccess();
            }, 500);
            
            if (response.filenames && response.filenames.length > 0) {
                const processedVideo = videoContainer.children[1].querySelector('img');
                processedVideo.src = '/processed_video/' + response.filenames[0];
                
                const processedContent = videoContainer.children[1].querySelector('.video-card-content');
                const downloadLink = document.createElement('a');
                downloadLink.href = '/processed_video/' + response.filenames[0];
                downloadLink.className = 'download-btn';
                downloadLink.download = 'processed_' + response.filenames[0];
                downloadLink.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                `;
                processedContent.appendChild(downloadLink);
            }
        } else {
            showError('Error processing image. Please try again.');
            progressContainer.style.display = 'none';
        }
    };

    xhr.onerror = function() {
        clearInterval(progressInterval);
        showError('Network error occurred. Please try again.');
        progressContainer.style.display = 'none';
    };

    xhr.send(formData);
}