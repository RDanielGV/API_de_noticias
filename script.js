let currentPage = 1;
const pageSize = 5;  // Número de noticias por página

// Pedir permiso para notificaciones al cargar la página
if ("Notification" in window) {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Permiso para notificaciones concedido.");
    }
  });
}

document.getElementById('fetchNewsBtn').addEventListener('click', fetchNews);
document.getElementById('pagination-next').addEventListener('click', () => {
  currentPage++;
  fetchNews();
});

document.getElementById('pagination-previous').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNews();
  }
});

function fetchNews() {
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = '<p>Cargando noticias...</p>';  // Indicador de carga

  const apiKey = '03f127032b97464093dd754372d2d62e';
  const searchQuery = document.getElementById('searchInput').value.trim();
  const category = document.getElementById('categorySelect').value;
  
  let url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&country=us&page=${currentPage}&pageSize=${pageSize}`;
  
  if (searchQuery) {
    url += `&q=${encodeURIComponent(searchQuery)}`;
  }
  if (category) {
    url += `&category=${category}`;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener las noticias');
      }
      return response.json();
    })
    .then(data => {
      displayNews(data.articles);

      // Enviar una notificación con la primera noticia recibida
      if (data.articles.length > 0 && Notification.permission === "granted") {
        data.articles.forEach(article => {
          displayNotifications(article);  // Mostrar notificación en la página
          new Notification("Nueva noticia", {
            body: article.title,
            icon: article.urlToImage || './img/not_found.png'
          });
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      newsContainer.innerHTML = `<p>${error.message}</p>`;
    });
}

function displayNews(articles) {
  const newsContainer = document.getElementById('newsContainer');
  newsContainer.innerHTML = ''; 

  if (articles.length === 0) {
    newsContainer.innerHTML = '<p>No se encontraron noticias.</p>';
    return;
  }

  articles.forEach(article => {
    newsContainer.innerHTML += `
      <div class="card">
        <img src="${article.urlToImage || './img/not_found.png'}" class="card-img-top" alt="Imagen de noticia">
        <div class="card-body">
          <h5 class="card-title">${article.title}</h5>
          <p class="card-text">${article.description || 'No hay descripción disponible.'}</p>
          <a href="${article.url}" class="btn btn-primary" target="_blank">Leer más</a>
        </div>
      </div>
    `;
  });
}

// Mostrar notificación dentro de la página
function displayNotifications(article) {
  const notificationList = document.getElementById('notificationList');
  const listItem = document.createElement('li');
  listItem.textContent = article.title;
}
