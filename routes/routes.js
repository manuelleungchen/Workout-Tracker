

module.exports = (app) => {
  app.get('/', (req, res) => {
    db.Note.find({})
    .then(dbNote => {
      res.json(dbNote);
    })
    .catch(err => {
      res.json(err);
    });
  });
};

