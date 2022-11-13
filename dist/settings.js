const settingsDiv = document.querySelector('#settings');
export const createSetting = (name, defaultValue, min, max, description) => {
    const div = document.createElement('div');
    div.classList.add('settingDiv');
    const title = document.createElement('h4');
    title.innerText = name;
    div.appendChild(title);
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
        return input.value;
    };
};
