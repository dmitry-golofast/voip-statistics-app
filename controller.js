const db = require('./db');

class baseController {
    async selectOutCallsDay(req, res) {
        const date = req.params.date;
        const sql = `SELECT COUNT(*) FROM cdr where src LIKE '1%' and calldate LIKE '%${date}%'`
        await db.query(sql , function (err, response) {
            if (err) console.log(err);
            const count = 'COUNT(*)';
            res.json(response[0][count])
        })

    }
    async selectMissedCallsDay(req, res) {

    }
    async selectCallsMonth(req, res) {

    }
    async selectCallsMissedMonth(req, res) {

    }
    async selectCallsRecordedDay(req, res) {

    }
}

module.exports = new baseController();
