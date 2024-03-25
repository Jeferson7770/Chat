// Objeto para armazenar as informações de curtidas e descurtidas
var likes = {};

function sendMessage() {
    var username = document.getElementById('username').value.trim();
    var nameColor = document.getElementById('name-color').value;
    var message = document.getElementById('message').value.trim();
    var fileInput = document.getElementById('file');
    var file = fileInput.files[0];
    
    if (!username && !message && !file) {
        alert("Por favor, preencha ao menos um campo.");
        return;
    }
    
    if (file && file.size > 5 * 1024 * 1024) { // Limite de 5MB
        alert("Por favor, selecione uma imagem de tamanho menor (até 5MB).");
        return;
    }
    
    var reader = new FileReader();
    reader.onload = function(event) {
        var imgSrc = event.target.result;
        
        if (file) {
            // Redimensionamento da imagem
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            var img = new Image();
            img.onload = function() {
                var MAX_WIDTH = 500; // Largura máxima da imagem
                var MAX_HEIGHT = 500; // Altura máxima da imagem
                var width = img.width;
                var height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                var imgResized = canvas.toDataURL('image/jpeg');

                displayMessage(username, nameColor, message, imgResized);
            };
            img.src = imgSrc;
        } else {
            displayMessage(username, nameColor, message);
        }
    };
    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onload({ target: { result: '' } });
    }
    document.getElementById('username').value = '';
    document.getElementById('message').value = '';
    fileInput.value = '';
}

function displayMessage(username, nameColor, message, imgSrc) {
    var messageContainer = document.getElementById('message-board');
    var messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    var userSpan = document.createElement('span');
    userSpan.className = 'message-user';
    userSpan.textContent = username ? username + ':' : 'Anônimo:';
    userSpan.style.color = nameColor;
    messageElement.appendChild(userSpan);
    
    if (message) {
        var messageText = document.createElement('p');
        messageText.className = 'message-text';
        messageText.textContent = message;
        messageElement.appendChild(messageText);
    }
    
    if (imgSrc) {
        var img = document.createElement('img');
        img.className = 'message-img';
        img.src = imgSrc;
        img.onclick = function() {
            enlargeImage(imgSrc);
        };
        messageElement.appendChild(img);
        
        // Adiciona elementos para contabilizar as curtidas e descurtidas
        var likesCount = document.createElement('span');
        likesCount.className = 'likes-count';
        likesCount.textContent = '0';
        messageElement.appendChild(likesCount);

        var unlikesCount = document.createElement('span');
        unlikesCount.className = 'unlikes-count';
        unlikesCount.textContent = '0';
        messageElement.appendChild(unlikesCount);

        // Adiciona eventos de clique para curtir/descurtir a imagem
        var likeBtn = document.createElement('button');
        likeBtn.textContent = 'Curtir';
        likeBtn.className = 'like-btn';
        likeBtn.onclick = function(event) {
            event.stopPropagation(); // Impede a propagação do evento de clique para a imagem
            toggleLike(imgSrc, username, true);
        };
        messageElement.appendChild(likeBtn);

        var unlikeBtn = document.createElement('button');
        unlikeBtn.textContent = 'Descurtir';
        unlikeBtn.className = 'unlike-btn';
        unlikeBtn.onclick = function(event) {
            event.stopPropagation(); // Impede a propagação do evento de clique para a imagem
            toggleLike(imgSrc, username, false);
        };
        messageElement.appendChild(unlikeBtn);
    }
    
    messageContainer.appendChild(messageElement);
}

function enlargeImage(imgSrc) {
    // Cria um modal para exibir a imagem ampliada
    var modal = document.createElement('div');
    modal.className = 'modal';
    
    var modalImg = document.createElement('img');
    modalImg.src = imgSrc;
    
    modal.appendChild(modalImg);
    document.body.appendChild(modal);
    
    // Adiciona um evento de clique no modal para fechá-lo
    modal.onclick = function() {
        modal.remove();
    };
}

function toggleLike(imgSrc, username, isLike) {
    // Verifica se a imagem já foi curtida ou descurtida pelo usuário
    if (!likes[imgSrc]) {
        likes[imgSrc] = {};
    }

    // Atualiza o estado da curtida ou descurtida
    likes[imgSrc][username] = isLike;

    // Atualiza o estilo do botão de acordo com o estado da curtida ou descurtida
    var messageElements = document.getElementsByClassName('message');
    for (var i = 0; i < messageElements.length; i++) {
        var imgElement = messageElements[i].querySelector('.message-img');
        if (imgElement && imgElement.src === imgSrc) {
            var likeBtn = messageElements[i].querySelector('.like-btn');
            var unlikeBtn = messageElements[i].querySelector('.unlike-btn');
            var likesCount = messageElements[i].querySelector('.likes-count');
            var unlikesCount = messageElements[i].querySelector('.unlikes-count');

            // Contabiliza as curtidas e descurtidas
            var totalLikes = Object.values(likes[imgSrc]).filter(val => val === true).length;
            var totalUnlikes = Object.values(likes[imgSrc]).filter(val => val === false).length;

            // Atualiza o texto das contagens
            likesCount.textContent = totalLikes === 0 ? '' : totalLikes;
            unlikesCount.textContent = totalUnlikes === 0 ? '' : totalUnlikes;

            // Atualiza o estilo dos botões
            likeBtn.style.backgroundColor = isLike ? '#00ff00' : '#ccc';
            unlikeBtn.style.backgroundColor = !isLike ? '#ff0000' : '#ccc';
        }
    }
}
