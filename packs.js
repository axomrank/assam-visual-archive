const picker = document.getElementById('pack');
const content = document.getElementById('pack-content');
const status = document.getElementById('pack-status');
const records = new Map();

async function read(path) {
  if (!records.has(path)) {
    records.set(path, fetch(path).then((response) => {
      if (!response.ok) throw new Error(`Could not load ${path}`);
      return response.json();
    }));
  }
  return records.get(path);
}

function add(parent, tag, text) {
  const node = document.createElement(tag);
  node.textContent = text;
  parent.append(node);
  return node;
}

function link(parent, text, href) {
  const node = add(parent, 'a', text);
  node.href = href;
  return node;
}

async function resolvePack(pack) {
  const [place, period, production, claims, assets] = await Promise.all([
    read(pack.place),
    read(pack.period),
    read(pack.production),
    Promise.all(pack.claims.map(async (path) => {
      const claim = await read(path);
      return {...claim, sources: await Promise.all(claim.sources.map(read))};
    })),
    Promise.all(pack.assets.map(async (path) => {
      const asset = await read(path);
      if (!asset.galleryId) return asset;
      const catalogue = await read(asset.galleryFile);
      const record = catalogue.find((entry) => entry.id === asset.galleryId);
      if (!record) throw new Error(`Missing catalogue asset ${asset.galleryId}`);
      return {...asset, record};
    })),
  ]);
  return {...pack, place, period, production, claims, assets};
}

function render(pack) {
  const fragment = document.createDocumentFragment();
  add(fragment, 'h2', pack.title);
  add(fragment, 'p', `${pack.place.locality} · ${pack.period.startYear}–${pack.period.endYear} · ${pack.status}`);
  add(fragment, 'p', pack.summary);
  add(fragment, 'p', pack.period.note);
  const button = add(fragment, 'button', 'Download scene pack JSON');
  button.className = 'export-pack';
  button.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(pack, null, 2)], {type: 'application/json'});
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = `${pack.id}-v${pack.version}.json`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  });

  add(fragment, 'h3', 'Visual references and reconstructions');
  const comparison = add(fragment, 'div', '');
  comparison.className = 'pack-comparison';
  for (const asset of pack.assets) {
    const figure = add(comparison, 'figure', '');
    const media = asset.record ?? asset;
    if (media.image) {
      const image = add(figure, 'img', '');
      image.src = media.image;
      image.alt = media.alt ?? asset.title;
      image.loading = 'lazy';
    }
    const caption = add(figure, 'figcaption', '');
    add(caption, 'strong', `${asset.title} · ${asset.kind}`);
    add(caption, 'p', `${asset.use} ${asset.limit}`);
    if (media.credit) add(caption, 'p', [media.credit, media.license].filter(Boolean).join(' · '));
    if (media.source) link(caption, 'Source image', media.source);
    if (media.licenseUrl) link(caption, 'License', media.licenseUrl);
  }

  add(fragment, 'h3', 'What the evidence supports');
  for (const claim of pack.claims) {
    add(fragment, 'h4', `${claim.title} · ${claim.status}`);
    add(fragment, 'p', claim.statement);
    add(fragment, 'p', claim.limit);
    const sources = add(fragment, 'ul', '');
    for (const source of claim.sources) {
      link(add(sources, 'li', ''), `${source.title} — ${source.locator}`, source.url);
    }
  }

  add(fragment, 'h3', `Shot list · ${pack.production.title}`);
  add(fragment, 'p', pack.production.kind);
  const shots = add(fragment, 'ol', '');
  for (const shot of pack.production.shots) {
    const item = add(shots, 'li', '');
    add(item, 'strong', shot.frame);
    add(item, 'p', `${shot.action} ${shot.continuity}`);
  }
  add(fragment, 'h3', 'Research gaps');
  const gaps = add(fragment, 'ul', '');
  for (const gap of pack.gaps) add(gaps, 'li', gap);
  content.replaceChildren(fragment);
}

async function show() {
  const id = picker.value;
  status.textContent = 'Loading research…';
  content.replaceChildren();
  try {
    const pack = await resolvePack(packs.find((item) => item.id === id));
    if (picker.value !== id) return;
    render(pack);
    status.textContent = '';
    const url = new URL(location.href);
    url.searchParams.set('pack', id);
    history.replaceState(null, '', url);
  } catch (error) {
    if (picker.value === id) status.textContent = 'This pack could not be loaded.';
    console.error(error);
  }
}

let packs;
try {
  packs = await Promise.all((await read('data/packs/index.json')).map(read));
  for (const pack of packs) picker.add(new Option(pack.title, pack.id));
  const requested = new URLSearchParams(location.search).get('pack');
  if (packs.some((pack) => pack.id === requested)) picker.value = requested;
  picker.addEventListener('change', show);
  await show();
} catch (error) {
  status.textContent = 'The pack index could not be loaded.';
  console.error(error);
}
