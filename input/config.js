const dir = __dirname;
const fs = require('fs');
const width = 1000;
const height = 1000;

const rarity = [
  { key: '_c', val: 'common' },
  { key: '_r', val: 'rare' }
]

const addRarity = (_str) => {
  let itemRarity;
  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  })
  return itemRarity;
}

const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, '');
  })
  return name;
}

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      return {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
        rarity: addRarity(i)
      };
    })
}

const layers = [
  {
    location: `${dir}/Background/`,
    elements: getElements(`${dir}/Background/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height}
  },
  {
    location: `${dir}/Splatters/`,
    elements: getElements(`${dir}/Splatters/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height}
  },
  {
    location: `${dir}/Tea/`,
    elements: getElements(`${dir}/Tea/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height}
  },
  {
    location: `${dir}/Boba/`,
    elements: getElements(`${dir}/Boba/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height}
  },
  {
    location: `${dir}/Cup/`,
    elements: getElements(`${dir}/Cup/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height}
  },
  {
    location: `${dir}/Lid/`,
    elements: getElements(`${dir}/Lid/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height}
  },
  {
    location: `${dir}/Straw/`,
    elements: getElements(`${dir}/Straw/`),
    position: { x: 0, y: 0 },
    size: { width: width, height: height}
  },
]

module.exports = { layers, width, height };