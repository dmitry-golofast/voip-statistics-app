const Router = require('express');
const router = Router();
const baseController = require('./controller');

router.get('/callsday/:date', baseController.selectOutCallsDay);
router.get('/incallsday/:date', baseController.selectInCallsDay);
router.get('/inminday/:date', baseController.selectOutMinutesDay);
router.get('/outminday/:date', baseController.selectInMinutesDay);

// router.get('/callsmissedday', baseController.selectMissedCallsDay);
// router.get('/callsmonth', baseController.selectCallsMonth);
// router.get('/callsmissedmonth', baseController.selectCallsMissedMonth);
// router.get('/callsrecordeddingday', baseController.selectCallsRecordedDay);

module.exports = router;