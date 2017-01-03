export const getFormData = formEl => {
    const data = {};
    const inputEls = formEl.querySelectorAll('input, textarea');
    const inputList = Array.prototype.slice.call(inputEls);
    inputList.forEach(el => {
        const name = el.getAttribute('name');
        const type = el.getAttribute('type');
        let value = el.value;

        if (!name || (type === 'radio' && !el.checked)) {
            return null;
        }
        if (type === 'radio') {
            value = value === 'true' ? true : value;
            value = value === 'false' ? false : value;
        }
        if (type === 'checkbox') {
            value = el.checked;
        }
        if (type === 'number') {
            value = ~~value;
        }
        data[name] = value;
        return null;
    });
    return data;
};

export const clearFormData = formEl => {
    const inputEls = formEl.querySelectorAll('input, textarea');
    const inputList = Array.prototype.slice.call(inputEls);
    inputList.forEach(el => {
        el.value = null; // eslint-disable-line
    });
};

export const selectElement = (element) => {
    if (document.selection) {
        const range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        const range = document.createRange();
        range.selectNode(element);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
};

export const copyToClipboard = (text) => {
    const element = document.createElement('div');
    element.textContent = text;
    document.body.appendChild(element);
    selectElement(element);
    document.execCommand('copy');
    element.remove();
};

export const lazyloadImage = () => {
    const requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame;
    const imageEls = document.querySelectorAll('img');

    const loadImage = (el) => {
        if (el.getAttribute('loaded')) {
            return;
        }
        const imageSrc = el.getAttribute('data-src');
        el.setAttribute('src', imageSrc);
        el.setAttribute('loaded', true);
    };

    const loadViewedImage = () => {
        const imageElsArray = Array.prototype.slice.call(imageEls);
        imageElsArray.forEach(el => {
            requestAnimationFrame(() => {
                const elTop = el.getBoundingClientRect().top;
                const documentHeight = window.innerHeight;

                if (elTop < documentHeight) {
                    loadImage(el);
                }
            });
        });
    };

    window.addEventListener('scroll', loadViewedImage, false);
    window.addEventListener('load', loadViewedImage, false);
};