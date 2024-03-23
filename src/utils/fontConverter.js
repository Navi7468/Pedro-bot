// a - 𝒜 𝒶
// b - 𝐵 𝒷
// c - 𝒞 𝒸
// d - 𝒟 𝒹
// e - 𝐸 𝑒
// f - 𝐹 𝒻
// g - 𝒢 𝑔
// h - 𝐻 𝒽
// i - 𝐼 𝒾
// j - 𝒥 𝒿
// k - 𝒦 𝓀
// l - 𝐿 𝓁
// m - 𝑀 𝓂
// n - 𝒩 𝓃
// o - 𝒪 𝑜
// p - 𝒫 𝓅
// q - 𝒬 𝓆
// r - 𝑅 𝓇
// s - 𝒮 𝓈
// t - 𝒯 𝓉
// u - 𝒰 𝓊
// v - 𝒱 𝓋
// w - 𝒲 𝓌
// x - 𝒳 𝓍
// y - 𝒴 𝓎
// z - 𝒵 𝓏
const letters = {
    a: '𝒶',
    b: '𝒷',
    c: '𝒸',
    d: '𝒹',
    e: '𝑒',
    f: '𝒻',
    g: '𝑔',
    h: '𝒽',
    i: '𝒾',
    j: '𝒿',
    k: '𝓀',
    l: '𝓁',
    m: '𝓂',
    n: '𝓃',
    o: '𝑜',
    p: '𝓅',
    q: '𝓆',
    r: '𝓇',
    s: '𝓈',
    t: '𝓉',
    u: '𝓊',
    v: '𝓋',
    w: '𝓌',
    x: '𝓍',
    y: '𝓎',
    z: '𝓏',
    A: '𝒜',
    B: '𝐵',
    C: '𝒞',
    D: '𝒟',
    E: '𝐸',
    F: '𝐹',
    G: '𝒢',
    H: '𝐻',
    I: '𝐼',
    J: '𝒥',
    K: '𝒦',
    L: '𝐿',
    M: '𝑀',
    N: '𝒩',
    O: '𝒪',
    P: '𝒫',
    Q: '𝒬',
    R: '𝑅',
    S: '𝒮',
    T: '𝒯',
    U: '𝒰',
    V: '𝒱',
    W: '𝒲',
    X: '𝒳',
    Y: '𝒴',
    Z: '𝒵'
};

function fontConverter(text) {
    let converted = '';
    for (let i = 0; i < text.length; i++) {
        if (letters[text[i].toLowerCase()]) {
            if (i === 0 || text[i - 1] === ' ' || text[i - 1] === '-') {
                converted += letters[text[i].toUpperCase()] || letters[text[i].toLowerCase()];
            } else {
                converted += letters[text[i].toLowerCase()];
            }
        } else {
            converted += text[i];
        }
    }
    return converted;
}



module.exports = { fontConverter };