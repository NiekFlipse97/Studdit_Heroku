const express = require("express");
const router = express.Router();
const apiErrors = require("../errorMessages/apiErrors.js");
const repo = require('../dataAccess/commentRepository');

router.get('/', (req, res) => {

});

/* Create a new comment based on thead id, user needs to be logged in*/
router.post('/:threadId', (req, res) => {
    const threadId = req.params.threadId;
    const createCommentObject = req.body;

    if (!CheckObjects.isValidComment(createCommentObject)) {
        const error = apiErrors.wrongRequestBodyProperties;
        res.status(error.code).json(error);
        return;
    }

    const content = createCommentObject.content;

    repo.createComment(threadId, req.user.username, content, res);
});

router.delete('/:commentId', (req, res) => {
    const threadId = req.params.threadId;
    const commentId = req.params.commentId;

    repo.deleteComment(threadId, commentId, res)
});

class CheckObjects {
    static isValidComment(object) {
        const tmp =
            object && typeof object == "object" &&
            object.content && typeof object.content == "string";
        console.log(`Is comment valid: ${tmp == undefined ? false : tmp}`);
        return tmp == undefined ? false : tmp;
    }
}

module.exports = router;