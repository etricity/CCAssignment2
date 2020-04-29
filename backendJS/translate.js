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


}

function configTranslate(req, res) {
  console.log(req.query);
  text = req.query.text;
  target = req.query.lang;
}
