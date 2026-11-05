const select = (id) => document.getElementById(id);
const search = select('search');
const section = select('section');
const collection = select('collection');
const gallery = select('gallery');
const status = select('status');
const more = select('more');
const details = select('details');
const pageSize = 48;
let collections;
let records;
let matches = [];
let shown = 0;

async function readJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function element(tag, value) {
  const node = document.createElement(tag);
  if (value) node.textContent = value;
  return node;
}

function image(record) {
  const photo = element('img');
  photo.src = record.image;
  photo.alt = record.alt || record.title;
  photo.loading = 'lazy';
  return photo;
}

function addLink(container, label, url) {
  if (!url || !/^https?:\/\//i.test(url)) return;
  const link = element('a', label);
  link.href = url;
  container.append(link);
}

function openDetails(record) {
  const content = select('detail-content');
  content.replaceChildren(element('p', `${record.section} / ${record.collectionTitle}`), element('h2', record.title));
  if (record.image) content.append(image(record));
  if (record.note) content.append(element('p', record.note));
  if (record.credit || record.license) {
    content.append(element('p', [record.credit, record.license].filter(Boolean).join(' · ')));
  }
  addLink(content, 'View source', record.source);
  addLink(content, 'View license', record.licenseUrl);
  details.showModal();
}

function showMore() {
  const cards = matches.slice(shown, shown + pageSize).map((record) => {
    const card = element('button');
    card.className = 'card';
    if (record.image) {
      card.append(image(record));
    } else {
      const placeholder = element('span', record.source ? 'SOURCE RECORD' : 'CATALOGUE RECORD');
      placeholder.className = 'placeholder';
      card.append(placeholder);
    }
    const caption = element('span');
    caption.append(element('small', record.collectionTitle), element('strong', record.title));
    card.append(caption);
    card.addEventListener('click', () => openDetails(record));
    return card;
  });
  gallery.append(...cards);
  shown += cards.length;
  more.hidden = shown >= matches.length;
}

function filter() {
  const terms = search.value.toLowerCase().trim().split(/\s+/);
  matches = records.filter((record) =>
    (!section.value || record.section === section.value) &&
    (!collection.value || record.collectionId === collection.value) &&
    terms.every((term) => record.searchText.includes(term))
  );
  status.textContent = matches.length ? `${matches.length.toLocaleString()} records` : 'No records match your search.';
  gallery.replaceChildren();
  shown = 0;
  showMore();
}

function updateCollections() {
  collection.replaceChildren(new Option('All collections', ''));
  for (const group of collections) {
    if (!section.value || group.section === section.value) {
      collection.add(new Option(group.title, group.id));
    }
  }
}

try {
  collections = await readJson('data/collections.json');
  const groups = await Promise.all(collections.map(async (group) =>
    (await readJson(group.file)).map((item) => ({
      ...item,
      section: group.section,
      collectionId: group.id,
      collectionTitle: group.title,
      searchText: [item.id, item.title, item.note, item.credit, group.title, group.section].join(' ').toLowerCase(),
    }))
  ));
  records = groups.flat();
  for (const name of new Set(collections.map((group) => group.section))) {
    section.add(new Option(name, name));
  }
  if (new URLSearchParams(location.search).get('category') === 'characters') {
    section.value = 'Community character sheets';
  }
  updateCollections();
  search.form.addEventListener('submit', (event) => event.preventDefault());
  search.addEventListener('input', filter);
  section.addEventListener('change', () => {
    updateCollections();
    filter();
  });
  collection.addEventListener('change', filter);
  more.addEventListener('click', showMore);
  filter();
} catch (error) {
  status.textContent = 'The catalogue could not load. Serve the site over HTTP and reload.';
  console.error(error);
}
