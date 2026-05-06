# Lightweight Masonry Grid

A simple and lightweight (~1kb) script for creating a masonry-style grid layout without any dependencies. It uses modern CSS Grid and Intersection Observer for lazy-loading images.

This is a great alternative to heavy libraries like Masonry or Isotope.

## Demo / Examples

- Live site [https://old.xn--b1afkhhhz2d6c.xn--p1ai/](https://old.xn--b1afkhhhz2d6c.xn--p1ai/) - a live demo with (almost) infinite scrolling

- Github Pages []() - A simple demo with infinite scrolling

---

# Легковесная сетка в стиле Masonry

Простой и легковесный (~1кб) скрипт для создания сеточного макета в стиле masonry без каких-либо зависимостей. Он использует современный CSS Grid и Intersection Observer для ленивой загрузки изображений.

Это отличная альтернатива тяжелым библиотекам, таким как Masonry или Isotope.

Изначально бибилиотека писалась для замены тяжелой masonry библиоткеи

## Demo / Примеры

- Реальный сайт [https://old.xn--b1afkhhhz2d6c.xn--p1ai/](https://old.xn--b1afkhhhz2d6c.xn--p1ai/) - живая демонстрация с бесконечным скроллом (почти)

- Github Pages []() - Лёгкая демонстрация с бесконечным скроллом

## How to use / Как использовать

1.  **HTML Structure:**

    Create a container for your grid.

    ```html
    <div id="galleryGrid"></div>
    ```

2.  **CSS Styling:**

    Apply a grid layout to your container. The `grid-auto-rows` and `gap` values should be passed to the script for correct calculations.

    ```css
    #galleryGrid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        grid-auto-rows: 10px; /* This value is used in the script */
        gap: 15px; /* This value is used in the script */
        align-items: start;
    }

    .gallery-item {
        /* Your item styles */
    }

    .gallery-image {
        width: 100%;
        display: block;
    }
    ```

3.  **JavaScript Initialization:**

    Import and initialize the script.

    ```javascript
    import { initMasonry } from './masonry.js';

    // Initialize with your grid selector and CSS values
    const addItems = initMasonry({
        gridSelector: '#galleryGrid',
        rowHeight: 10, // Must match grid-auto-rows
        gap: 15      // Must match gap
    });

    // Prepare your data
    const generateItems = (count) => Array.from({length: count}, () => ({
        id: Math.floor(Math.random() * 1000),
        height: Math.floor(Math.random() * 200) + 200 // Random height
    }));

    // Create a template function for an item
    const itemTemplate = (item) => `<img class="gallery-image" data-src="https://picsum.photos/seed/${item.id}/400/${item.height}">`;

    // Add items to the grid
    addItems(generateItems(20), itemTemplate);
    ```

## `masonry.js`

This is the full code for the script.

```javascript
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
```

## License

[MIT](LICENSE)
