
document.getElementById('year').textContent = new Date().getFullYear();

let publicationData = null;
const list = document.getElementById('publication-list');

function render(type) {
  if (!publicationData) return;

  list.replaceChildren();

  for (const item of publicationData[type] || []) {
    const row = document.createElement('article');
    row.className = 'pub';

    // Publication citation
    const p = document.createElement('p');
    p.textContent = item.text;
    row.appendChild(p);

    // Publication status (e.g., NoisyBox)
    if (item.status) {
      const status = document.createElement('p');
      status.className = 'muted';
      status.textContent = item.status;
      row.appendChild(status);
    }

    // Publication link
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'View publication ↗';
      row.appendChild(a);
    }

    // Additional resources (dataset, code, etc.)
    if (item.resources) {
      for (const resource of item.resources) {
        const a = document.createElement('a');
        a.href = resource.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = resource.label + ' ↗';
        a.style.marginRight = '1rem';
        row.appendChild(a);
      }
    }

    list.appendChild(row);
  }
}

// Journal / Conference filters
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(x => {
      x.classList.remove('active');
    });

    button.classList.add('active');
    render(button.dataset.filter);
  });
});

// Load publications
fetch('data/publications.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Cannot load publications');
    }
    return response.json();
  })
  .then(data => {
    publicationData = data;
    render('journals');
  })
  .catch(error => {
    console.error('Publication loading error:', error);
    document.getElementById('pub-fallback').hidden = false;
  });
