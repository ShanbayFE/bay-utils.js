import { merge } from './validator';

export const hasClass = (el, className) => {
    if (el.classList) {
        return el.classList.contains(className);
    }
    return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
};

export const addClass = (el, className) => {
    if (el.classList) {
        el.classList.add(className);
    } else if (!hasClass(el, className)) {
        el.className += ` ${className}`;
    }
};

export const removeClass = (el, className) => {
    if (el.classList) {
        el.classList.remove(className);
    } else if (hasClass(el, className)) {
        const reg = new RegExp(`(\\s|^)${className}(\\s|$)`);
        el.className = el.className.replace(reg, ' ');
    }
};

export const getFormData = (formEl) => {
    const data = {};
    const inputEls = formEl.querySelectorAll('input, textarea');
    const inputList = Array.prototype.slice.call(inputEls);
    inputList.forEach((el) => {
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

export const clearFormData = (formEl) => {
    const inputEls = formEl.querySelectorAll('input, textarea');
    const inputList = Array.prototype.slice.call(inputEls);
    inputList.forEach((el) => {
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

export const lazyloadImage = (threshold = 100) => {
    /*
     * Note: The images which need lazyload must have 'data-src' property
     * @params threshold {Number} preload image before it shown
     */
    const requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame;
    const imageEls = document.querySelectorAll('img[data-src]');

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
        imageElsArray.forEach((el) => {
            requestAnimationFrame(() => {
                const elTop = el.getBoundingClientRect().top;
                const documentHeight = window.innerHeight;

                if (elTop - threshold < documentHeight) {
                    loadImage(el);
                }
            });
        });
    };

    window.addEventListener('scroll', loadViewedImage, false);
    window.addEventListener('load', loadViewedImage, false);
};

const setButtonStatus = (targetEl, isValid) => {
    if (isValid) {
        removeClass(targetEl, 'disable');
        targetEl.setAttribute('disabled', false);
    } else {
        addClass(targetEl, 'disable');
        targetEl.setAttribute('disabled', true);
    }
};

export const countDownBtn = (targetEl, options) => {
    const defaultOptions = {
        time: 60,
        getProcessText: countDownTime => `${countDownTime}s后重发`,
        endText: '重新获取验证码',
    };
    options = merge(options, defaultOptions);
    targetEl.innerText = options.getProcessText(options.time);
    setButtonStatus(targetEl, false);

    // 开始倒计时
    let countDownTime = options.time;
    const cdInterval = window.setInterval(() => {
        if (countDownTime > 0) {
            countDownTime -= 1;
            targetEl.innerText = options.getProcessText(countDownTime);
        } else {
            window.clearInterval(cdInterval);
            targetEl.innerText = options.endText;
            setButtonStatus(targetEl, true);
        }
    }, 1000);
    return cdInterval;
};

// disabledList: color, bold, italic
export const parsePasteDataToMarkdown = (e, disabledList = [], type = 'google-docs') => {
    const html = e.clipboardData.getData('text/html');
    const $dom = $(html);
    const $result = $dom.filter((i, dom) => ['META'].indexOf(dom.tagName.toUpperCase()) === -1);

    const traverseDom = ($root, handler) => {
        if ($root.children().length) {
            $root.children().each((i, dom) => traverseDom($(dom), handler));
        } else {
            handler($root);
        }
    };

    const resultStrs = [];
    traverseDom($result, ($node) => {
        let content = $node.html();
        const color = $node.css('color');

        const isBoldDisabled = disabledList.indexOf('bold') > -1;
        const isItalicDisabled = disabledList.indexOf('italic') > -1;
        const isColorDisabled = disabledList.indexOf('color') > -1;

        const isBold = $node.css('font-weight') > 400 && !isBoldDisabled;
        const isItalic = $node.css('font-style') === 'italic' && !isItalicDisabled;
        const hasColor = $node.css('color') !== 'rgb(0, 0, 0)' && !isColorDisabled;

        if (isBold && isItalic) {
            content = `__${content}__`;
        } else if (isBold) {
            content = `**${content}**`;
        } else if (isItalic) {
            content = `*${content}*`;
        }

        if (hasColor) {
            content = `<span style="color:${color}">${content}</span>`;
        }

        if ($node[0].tagName.toUpperCase() === 'BR') {
            resultStrs.push('\n\r');
        } else {
            resultStrs.push(content);
        }
    });

    return resultStrs.join('');
};
