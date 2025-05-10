document.addEventListener('DOMContentLoaded', function() {

  const radioButtons = document.querySelectorAll('input[type="radio"]');

  const radioContainer = document.createElement('div');
  radioContainer.className = 'radio-group';

  const originalContainer = document.querySelector('.button-container:nth-of-type(2)');
  const titleParagraph = originalContainer.querySelector('p');

  originalContainer.innerHTML = '';
  originalContainer.appendChild(titleParagraph);
  originalContainer.appendChild(radioContainer);

  radioButtons.forEach(radio => {
    const originalLabel = document.querySelector(`label[for="${radio.id}"]`);
    const labelText = originalLabel.textContent;

    const newRadio = document.createElement('input');
    newRadio.type = 'radio';
    newRadio.id = radio.id;
    newRadio.name = radio.name;
    newRadio.value = radio.value;

    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', radio.id);
    newLabel.textContent = labelText;

    radioContainer.appendChild(newRadio);
    radioContainer.appendChild(newLabel);
  });

  const errorMessage = document.getElementById('errorMessage');
  if (errorMessage) {
    const showError = (message) => {
      errorMessage.textContent = message;
      errorMessage.classList.add('show');
      setTimeout(() => {
        errorMessage.classList.remove('show');
      }, 5000);
    };

    window.showEnhancedError = showError;
  }

  const dropZone = document.getElementById('dropZone');
  if (dropZone) {
    dropZone.addEventListener('dragenter', () => {
      dropZone.classList.add('dragging');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragging');
    });

    dropZone.addEventListener('drop', () => {
      dropZone.classList.remove('dragging');

      dropZone.style.animation = 'pulse 0.5s ease-out';
      setTimeout(() => {
        dropZone.style.animation = '';
      }, 500);
    });
  }

  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const progressContainer = document.getElementById('progressContainer');

  if (progressBar && progressText) {
    const updateProgressEnhanced = (percent) => {
      progressBar.style.width = `${percent}%`;
      progressText.textContent = `${percent}% Complete`;

      if (percent > 75) {
        progressBar.style.background = 'linear-gradient(90deg, var(--success-500), var(--success-600))';
      }
    };

    window.updateProgressEnhanced = updateProgressEnhanced;
  }

  const successToast = document.getElementById('successToast');
  if (successToast) {
    const showSuccessEnhanced = (message = 'Image processed successfully!') => {
      successToast.textContent = message;

      const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgIcon.setAttribute('fill', 'none');
      svgIcon.setAttribute('viewBox', '0 0 24 24');
      svgIcon.setAttribute('stroke', 'currentColor');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('d', 'M5 13l4 4L19 7');

      svgIcon.appendChild(path);
      successToast.prepend(svgIcon);

      successToast.classList.add('show');
      setTimeout(() => {
        successToast.classList.remove('show');

        setTimeout(() => {
          if (svgIcon.parentNode === successToast) {
            successToast.removeChild(svgIcon);
          }
        }, 500);
      }, 3000);
    };

    window.showSuccessEnhanced = showSuccessEnhanced;
  }
});
