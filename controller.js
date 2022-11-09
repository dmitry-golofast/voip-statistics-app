const db = require('./db');

class baseController {
    async selectOutCallsDay(req, res) {
        const date = req.params.date
        const sql = `SELECT COUNT(*) FROM cdr where src LIKE '1%' and dst NOT LIKE '1%' and calldate LIKE '%${date}%'`
        await db.query(sql, function (err, response) {
            if (err) console.log(err)
            const count = 'COUNT(*)'
            res.json(response[0][count])
        })
    }

    async selectInCallsDay(req, res) {
        const date = req.params.date
        const sql = `SELECT COUNT(*) FROM cdr where dst <> '1109' and dst <> 's' and src LIKE '8%' and disposition = 'ANSWERED' and calldate LIKE '%${date}%'`
        await db.query(sql , function (err, response) {
            if (err) console.log(err)
            const count = 'COUNT(*)'
            res.json(response[0][count])
        })
    }

    async selectOutMinutesDay(req, res) {
        const date = req.params.date
        const sql = `SELECT SUM(billsec)/60 FROM cdr where src LIKE '1%' and dst NOT LIKE '1%' and disposition = 'ANSWERED' and calldate LIKE '%${date}%'`
        await db.query(sql , function (err, response) {
            if (err) console.log(err)
            const billsec = 'SUM(billsec)/60'
            res.json(response[0][billsec])
        })
    }

    async selectInMinutesDay(req, res) {
        const date = req.params.date
        const sql = `SELECT SUM(billsec)/60 FROM cdr where dst <> '1109' and dst <> 's' and src LIKE '8%' and disposition = 'ANSWERED' and calldate LIKE '%${date}%'`
        await db.query(sql , function (err, response) {
            if (err) console.log(err)
            const billsec = 'SUM(billsec)/60'
            res.json(response[0][billsec])
        })
    }

    async selectInStatMonth(req, res) {
        const month = req.params.month
        const sql = `SELECT src, COUNT(*) FROM cdr where src LIKE '1%' and dst NOT LIKE '1%' and disposition = 'ANSWERED' and calldate LIKE '%${month}%' GROUP BY src`
        await db.query(sql , function (err, response) {
            if (err) console.log(err)

            const result = JSON.parse(JSON.stringify(response));
            res.json(result)
            // const line = 'src'
            // const count = 'COUNT(*)'
            Object.entries(result).forEach((entry) => {
                const [key, value] = entry;
                console.log(entry);
            });
        })
    }

    // async selectMissedCallsDay(req, res) {
    //
    // }
    // async selectCallsMonth(req, res) {
    //
    // }
    // async selectCallsMissedMonth(req, res) {
    //
    // }
    // async selectCallsRecordedDay(req, res) {
    //
    // }
}

module.exports = new baseController();
