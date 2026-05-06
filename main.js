import { initMasonry } from './masonry.js';

const add = initMasonry({ gridSelector: '#galleryGrid' });

const gen = n => Array.from({length: n}, () => ({
    id: Math.random() * 1000 | 0,
                                                h: Math.random() * 300 + 300 | 0
}));

const tpl = i => `<img class="gallery-image" data-src="https://picsum.photos/seed/${i.id}/400/${i.h}">`;

add(gen(30), tpl);

window.addEventListener('scroll', () => {
    if (innerHeight + scrollY >= document.documentElement.offsetHeight - 500) {
        add(gen(6), tpl);
    }
});
