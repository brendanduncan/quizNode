
/*
 * GET home page.
 */

function indexController(app) {
	app.get('/', function(req, res) {
  		res.render('index', { title: 'QuizNode' });
	});
}

module.exports.controller = indexController;