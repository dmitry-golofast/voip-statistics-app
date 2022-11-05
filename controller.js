const db = require('./db');

class baseController {
    async selectCallsDay(req, res) {
        const sql = `SELECT calldate, src, dst, disposition, billsec FROM cdr WHERE calldate LIKE '%2022-10-25%'`;
        await db.query(sql , function (err, results) {
            if (err) console.log(err);
            console.log(results)
            res.json(results)
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
