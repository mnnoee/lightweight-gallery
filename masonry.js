// masonry.js
export function initMasonry({ gridSelector, rowHeight = 10, gap = 15 }) {
    const grid = document.querySelector(gridSelector);
    if (!grid) return;

    const resizeItem = (item) => {
        const img = item.querySelector('img');
        if (!img) return;

        const update = () => {
            const w = item.getBoundingClientRect().width;
            const span = Math.ceil(((img.naturalHeight / img.naturalWidth) * w + gap) / (rowHeight + gap));
            item.style.gridRowEnd = `span ${span}`;
            item.style.opacity = 1;
        };

        img.complete ? update() : img.addEventListener('load', update, { once: true });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    delete img.dataset.src;
                    img.onload = () => {
                        resizeItem(img.parentElement);
                        observer.unobserve(img);
                    };
                }
            }
        });
    }, { rootMargin: '200px' });

    window.addEventListener('resize', () => {
        [...grid.children].forEach(resizeItem);
    });

    return (data, templateFn) => {
        const fragment = document.createDocumentFragment();
        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.style.opacity = 0;
            div.innerHTML = templateFn(item);
            fragment.appendChild(div);
            observer.observe(div.querySelector('img'));
        });
        grid.appendChild(fragment);
    };
}
