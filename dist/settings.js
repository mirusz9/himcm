const settingsDiv = document.querySelector('#settings');
export const createSetting = (name, defaultValue, min, max, description) => {
    const div = document.createElement('div');
    div.classList.add('settingDiv');
    const title = document.createElement('h4');
    title.innerText = name;
    div.appendChild(title);
    if (description) {
        const desc = document.createElement('p');
        desc.innerText = description;
        div.appendChild(desc);
    }
    const input = document.createElement('input');
    input.type = 'number';
    input.value = defaultValue.toString();
    input.required = true;
    if (min)
        input.min = min.toString();
    if (max)
        input.max = max.toString();
    div.appendChild(input);
    settingsDiv.appendChild(div);
    return () => {
        let r = +input.value;
        if (min)
            r = Math.max(min, r);
        if (max)
            r = Math.min(max, r);
        return r;
    };
};
