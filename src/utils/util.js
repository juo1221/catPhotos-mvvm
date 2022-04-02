export const sel = (v, el = document) => el.querySelector(v);
export const el = (tag, ...attr) => {
  const el = typeof tag === 'string' ? document.createElement(tag) : tag;
  for (let i = 0; i < attr.length; ) {
    const k = attr[i++];
    const v = attr[i++];
    if (typeof el[k] == 'function') el[k](...(Array.isArray(v) ? v : [v]));
    else if (k[0] == '@') el.style[k.substr(1)] = v;
    else el[k] = v;
  }
  return el;
};
export const append = (v, ...elem) => {
  elem.reduce((prev, curr) => (prev.appendChild(curr), prev), el(v));
  return v;
};
export const appendDep = (v, ...elem) => {
  elem.reduce((prev, curr) => (prev.appendChild(curr), curr), el(v));
  return v;
};
export const err = (msg = 'invalid') => {
  throw new Error(msg);
};
export const is = (obj1, obj2) => obj1 instanceof obj2;

export const override = () => err('override!');
export const prop = (obj, attr) => Object.assign(obj, attr);
