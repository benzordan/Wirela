import { Router, Request, Response } from 'express'
import { flash_message, FlashType  } from '../helpers/flash-messenger'
import { ModelVideo, ModelUser } from '../models/models'
import { UserRole } from '../../build/models/users';
/**
 * Configure router parameters
 * @see "http://expressjs.com/en/5x/api.html#express.router"
 */
const router = Router({
	caseSensitive: false,   //	Ensure that /home vs /HOME does exactly the same thing
	mergeParams  : false,   //	Cascade all parameters down to children routes.
	strict       : false    //	Whether we should strictly differenciate "/home/" and "/home"
});

/**
 * Sub routes
 * /video/create
 * /video/list
 * /video/update
 * /video/delete
**/
router.use("/",                authorizer);
router.get('/',                page_default);
router.get('/list',            page_video_list);
router.get('/create',          page_video_create);
router.get('/update/:uuid',    page_video_update);

router.put  ('/create',         handle_video_create);	//..Some server had caching for this kind of stuff... prevent spams
router.patch('/update/:uuid',   handle_video_update);

//	Query = ?h=x&p=tt
//	Body  = Form Body
//	Params = http://......../yourpath/:param1/:param2/:param3 ... 
// router.get("/delete/:uuid", handle_video_delete);	//..Does this even make sense???
router.delete("/delete/:uuid", handle_video_delete);
module.exports = router;

/**
 * A authorizer
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
 function authorizer(req, res, next) {

	if (req.user === undefined) {
		return res.render("error", {
			"code"   : 401,
			"message": "Unauthorized. Please login!"
		});	//	Unauthorized
	}
	//	Allows only admin accounts
	else {
		 next();
	}
	// else
	// 	return res.render("error", {
	// 		"code"   : 403,
	// 		"message": "You do not have previleges to access this stuff"
	// 	});	//	Unauthorized
}

/**
 * Default page handler
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
function page_default(req, res) {
	return res.redirect('/video/list');
}

/**
 * Renders video list page
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
async function page_video_list(req, res) {
	try {
		const videos = await ModelVideo.findAll({
			order: [
				['title', 'ASC']
			],
			raw: true
		});
		
		// videos[0].update()	//	This will crash... if raw is enabled
		return res.render('video/listVideos', {
			"videos": videos
		});
	}
	catch (error) {
		console.error("Failed to retrieve list of videos");
		console.error(error);
		return res.status(500).end();
	}
}

/**
 * Renders the video creation page
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
function page_video_create(req, res) {
	return res.render('video/detailVideo', {
		mode   : "create",
		content: {}
	});
}

/**
 * Handles the creation of video
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
async function handle_video_create(req, res) {

	try {
		/** @type {string} */
		const csv_language = Array.isArray(req.body["language"])? req.body["language"].join(',') : req.body["language"];
		/** @type {string} */
		const csv_subtitle = Array.isArray(req.body["subtitle"])? req.body["subtitle"].join(',') : req.body["subtitle"];

		//	Fire and forget....
		const new_video = await ModelVideo.create({
			"title"         : req.body["title"],
			"story"         : req.body["story"],
			"dateReleased"  : req.body["dateReleased"],
			"language"      : csv_language,
			"subtitle"      : csv_subtitle,
			"classification": req.body["classification"],
			"uuid_user"     : req.user.uuid
		});

		return res.redirect("/video/list");
	}
	catch (error) {
		console.error("Failed to create new video");
		console.error(error);

		flash_message(res, FlashType.Error, "Failed to create new video");
		return res.render('video/detailVideo', {
			"mode"   : "create",
			"content": req.body
		});
	}
}


/**
 * Renders the video update page, Basically the same page as detailVideo with
 * prefills and cancellation.
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
 async function page_video_update(req, res) {

	try {
		const content = await ModelVideo.findOne({where: { "uuid": req.params["uuid"] }});
		if (content) {
			return res.render('video/detailVideo', {
				"mode"   : "update",
				"content": content
			});
		}
		else {
			console.error(`Failed to retrieve video ${req.params["uuid"]}`);
			console.error(error);
			return res.status(410).end();
		}
	}
	catch (error) {
		console.error(`Failed to retrieve video ${req.params["uuid"]}`);
		console.error(error);
		return res.status(500).end();	//	Internal server error	# Usually should not even happen !!
	}
}

/**
 * Handles the creation of video.
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
async function handle_video_update(req, res) {

	try {
		//	Please verify your contents
		if (!req.body["title"])
			throw Error("Missing title");
	}
	catch(error) {
		console.error(`Malformed request to update video ${req.params["uuid"]}`);
		console.error(req.body);
		console.error(error);
		return res.status(400).end();
	}

	try {
		const contents = await ModelVideo.findAll({where: { "uuid": req.params["uuid"], "uuid_user": req.user.uuid } });
		switch (contents.length) {
			case 0      : return res.redirect(410, "/video/list")
			case 1      : break;
			     default: return res.status(409, "/video/list")
		}
		//	Ignore the uuid
		delete req.body["uuid"];
		delete req.body["dateCreated"];
		delete req.body["dateUpdated"];

		/** @type {string} */
		req.body["language"] = Array.isArray(req.body["language"])? req.body["language"].join(',') : req.body["language"];
		/** @type {string} */
		req.body["subtitle"] = Array.isArray(req.body["subtitle"])? req.body["subtitle"].join(',') : req.body["subtitle"];
		
		await (await contents[0].update(req.body)).save();
		
		flash_message(res, FlashType.Success, "Video updated");
		return res.redirect(`/video/update/${req.params["uuid"]}`);
	}
	catch(error) {
		console.error(`Failed to update video ${req.params["uuid"]}`);
		console.error(error);

		flash_message(res, FlashType.Error, "The server met an unexpected error");
		return res.redirect(500, "/video/list")
	}	
}


/**
 * Handles the deletion of video.
 * @param {Request}  req Express request  object
 * @param {Response} res Express response object
 */
 async function handle_video_delete(req, res) {

	const regex_uuidv4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

	if (!regex_uuidv4.test(req.params["uuid"]))
		return res.status(400);
	
	//	Perform additional checks such as whether it belongs to the current user
	/** @type {ModelUser} */
	const user = req.user;

	try {
		const targets = await ModelVideo.count({where: { "uuid_user": user.uuid, "uuid": req.params["uuid"] }});
		
		switch(targets) {
			case 0      : return res.status(409);
			case 1      : console.log("Found 1 eligible video to be deleted"); break;
			     default: return res.status(409);
		}
	}
	catch (error) {
		console.error(`Failed to delete video: ${req.params["uuid"]}`);
		console.error(error);
		return res.status(500);
	}

	try {
		const affected = await ModelVideo.destroy({where: { "uuid": req.params["uuid"]}});
		if (affected == 1) {
			console.log(`Deleted video: ${req.params["uuid"]}`);
			return res.redirect("/video/list");
		}
		//	There should only be one, so this else should never occur anyway
		else {
			console.error(`More than one entries affected by: ${req.params["uuid"]}, Total: ${affected}`);
			return res.status(409);
		}
	}
	catch (error) {
		console.error(`Failed to delete video: ${req.params["uuid"]}`);
		console.error(error);
		return res.status(500);
	}
}