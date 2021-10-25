const fs = require('fs');
const myArgs = process.argv.slice(2);
const { createCanvas, loadImage } = require('canvas');
const canvas = createCanvas(1000, 1000);
const ctx = canvas.getContext('2d');
const { layers } = require('./input/config');
const { log } = require('console');
const editionSize = myArgs.length > 0 ? Number(myArgs[0]) : 1;

// Metadata
var metadataList = [];
var attributesList = [];
var dnaList = [];

const saveImage = (_editionCount) => {
  fs.writeFileSync(`./output/${_editionCount}.png`, canvas.toBuffer('image/png'));
}

const signImage = (_sig) => {
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 1.8rem Courier';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(_sig, 40, 40);
}

const addMetadata = (_dna, _edition) => {
  let timeStamp = Date.now();
  let tempMetadata = {
    dna: _dna,
    edition: _edition,
    date: timeStamp,
    attributes: attributesList
  };
  metadataList.push(tempMetadata);
  attributesList = [];
}

const writeMetaData = (_data) => {
  fs.writeFileSync('./output/_metadata.json', _data)
}

const addAttribute = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    name: selectedElement.name,
    rarity: selectedElement.rarity
  })
}

const loadLayerImg = async (_layer) => {
  const image  = await loadImage(`${_layer.location}${_layer.selectedElement.fileName}`);
  return Promise.resolve({layer: _layer, loadedImage: image})
}

const drawElement = (_element) => {
  ctx.drawImage(
    _element.loadedImage, 
    _element.layer.position.x, 
    _element.layer.position.y, 
    _element.layer.size.width, 
    _element.layer.size.height);
  addAttribute(_element);
}

const constructLayerToDna = (_dna, _layers) => {
  let dnaSegment = _dna.toString().match(/.{1,2}/g);
  let mappedDnaToLayers = _layers.map((layer) => {
    let selectedElement = layer.elements[parseInt(dnaSegment) % layer.elements.length]
    return {
      location: layer.location,
      position: layer.position,
      size: layer.size,
      selectedElement
    }
  })
  return mappedDnaToLayers;
}

const isDnaUnique = (_DnaList = [], _dna) => {
  let foundDna = _DnaList.find((i) => i === _dna)
  return !foundDna;
}

const createDna = () => {
  let len = layers.length * 2 - 1;
  return Math.floor(Number(`1e${len}`) + Math.random() * Number(`9e${len}`));
}

const startCreating = async () => {
  writeMetaData('');
  let editionCount = 1;
  while (editionCount <= editionSize) {
    let newDna = createDna()
    if (isDnaUnique(dnaList, newDna)) {
      let results = constructLayerToDna(newDna, layers);
      let loadedElements = [];
      results.forEach((layer) => {
        loadedElements.push(loadLayerImg(layer));
      })

      await Promise.all(loadedElements).then((elementsArray) => {
        elementsArray.forEach((element) => {
          drawElement(element);
        })
        signImage(`#${editionCount}/${editionSize}`)
        saveImage(editionCount);
        addMetadata(newDna, editionCount);
        console.log(`Created edition: ${editionCount} with DNA: ${newDna}`);
      })

      dnaList.push(newDna);
      editionCount++
    } else {
      console.log('DNA Exists!');
    }
  }
  writeMetaData(JSON.stringify(metadataList, null, 2));
}

startCreating()
