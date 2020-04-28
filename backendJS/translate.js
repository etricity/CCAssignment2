const {Translate} = require('@google-cloud/translate').v2;

// Creates a client
const translate = new Translate();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
 var text;
 var target;

exports.translateText = async function(req, res) {
  // Translates the text into the target language. "text" can be a string for
  // translating a single piece of text, or an array of strings for translating
  // multiple texts.
  //

//Uncomment for testing or final!!
  configTranslate(req, res);
  let [translations] = await translate.translate(text, target);
  translations = Array.isArray(translations) ? translations : [translations];
  console.log('Translations:');
  translations.forEach((translation, i) => {
    console.log(`${text[i]} => (${target}) ${translation}`);
  });
  res.send(translations);
   console.log(translations);

//Comment this for testing or final
   // console.log(typeof text);
   // res.send(JSON.stringify(text).toUpperCase());

}

function configTranslate(req, res) {
  console.log(req.query);
  text = jsonToArray(req.query);
  target = req.query.lang;
}

function jsonToArray(jOb) {
  var data = Object.values(jOb);
  var array = [];
  //skip first element (target language)
  for(var i = 1; i < data.length; i++) {
    array.push(data[i]);
  }
  return array;
}

async function listLanguages() {
  // Lists available translation language with their names in English (the default).
  const [languages] = await translate.getLanguages();

  console.log('Languages:');
  languages.forEach(language => console.log(language));
}
