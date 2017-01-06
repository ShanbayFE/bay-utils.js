import { merge } from './validator';

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

const setButtonStatus = (targetEl, isValid) => {
    if (isValid) {
        targetEl.classList.remove('disable');
        targetEl.setAttribute('disabled', false);
    } else {
        targetEl.classList.add('disable');
        targetEl.setAttribute('disabled', true);
    }
};

export const countDownBtn = (targetEl, options) => {
    const defaultOptions = {
        time: 60,
        processText: (countDownTime) => `${countDownTime}s后重发`,
        endText: '重新获取验证码',
    };
    options = merge(options, defaultOptions);
    targetEl.innerText = options.processText(options.time);
    setButtonStatus(targetEl, false);

    // 开始倒计时
    let countDownTime = options.time;
    const cdInterval = window.setInterval(() => {
        if (countDownTime > 0) {
            countDownTime -= 1;
            targetEl.innerText = options.processText(countDownTime);
        } else {
            window.clearInterval(cdInterval);
            targetEl.innerText = options.endText;
            setButtonStatus(targetEl, true);
        }
    }, 1000);
};
