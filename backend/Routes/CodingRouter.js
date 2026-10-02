const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth');

const ensureAdmin = require('../Middlewares/Admin');
const CodingController = require('../Controllers/CodingController');






// ✅ Sidebar — topics + difficulty-wise count
router.get('/topics', CodingController.getTopics);

// ✅ Topic/difficulty se filter karke question list
// example: GET /api/coding/questions?topic=Arrays&difficulty=easy
router.get('/questions', CodingController.getQuestions);

// ✅ Leaderboard (public)
router.get('/leaderboard', CodingController.getLeaderboard);




router.get(
    '/progress',
    ensureAuthenticated,
    CodingController.getCodingProgress
);

router.get(
    '/progress/:slug',
    ensureAuthenticated,
    CodingController.getQuestionProgress
);

router.post(
    '/progress/:slug',
    ensureAuthenticated,
    CodingController.saveCodingProgress
);

router.post(
    '/progress/:slug/complete',
    ensureAuthenticated,
    CodingController.completeCodingQuestion
);

// ✅ Single question ki detail (editor khulne pe)
router.get('/question/:slug', CodingController.getQuestionBySlug);

// ✅ "Show Answer" — reference solution
router.get('/question/:slug/solution', ensureAuthenticated, CodingController.getSolution);

// ✅ Run — sirf sample test cases
router.post('/question/:slug/run', ensureAuthenticated, CodingController.runCode);

// ✅ Submit — sample + hidden test cases, verdict + points
router.post('/question/:slug/submit', ensureAuthenticated, CodingController.submitCode);

router.post('/question/:slug/generate-tests', ensureAuthenticated, ensureAdmin, CodingController.generateTestCases);

// TEMPORARY: Reset Two Sum generated test cases
router.post(
    '/question/two-sum/reset-tests',
    ensureAuthenticated,
    CodingController.resetTwoSumTestCases
);



// =====================================================
// ADMIN CODING QUESTION ROUTES
// =====================================================

router.get(
    '/admin/questions',
    ensureAuthenticated,
    ensureAdmin,
    CodingController.getAdminQuestions
);

router.get(
    '/admin/questions/:id',
    ensureAuthenticated,
    ensureAdmin,
    CodingController.getAdminQuestionById
);

router.post(
    '/admin/questions',
    ensureAuthenticated,
    ensureAdmin,
    CodingController.createAdminQuestion
);

router.post(
    '/admin/questions/bulk',
    ensureAuthenticated,
    ensureAdmin,
    CodingController.bulkCreateAdminQuestions
);

router.put(
    '/admin/questions/:id',
    ensureAuthenticated,
    ensureAdmin,
    CodingController.updateAdminQuestion
);

router.delete(
    '/admin/questions/:id',
    ensureAuthenticated,
    ensureAdmin,
    CodingController.deleteAdminQuestion
);

module.exports = router;