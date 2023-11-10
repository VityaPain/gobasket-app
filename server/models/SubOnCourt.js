const { v4: uuidv4 } = require('uuid');
const db = require('../config/db')

class SubOnCourt {
    constructor(courtId, userId) {
        this.courtId = courtId
        this.userId = userId
    }
    get getId() {
        return uuidv4().toString().slice(0, 11)
    }

    // новая подписка на площадку
    async save() {  
        let sql = `
        INSERT INTO sub_user_court (
            sub_id,
            court_id,
            user_id
        )
        VALUES (
            '${this.getId}',
            '${this.courtId}',
            '${this.userId}'
        );
        `

        const [newSub, _] = await db.execute(sql)

        return newSub
    }

    // площадки пользователя
    static findCourtsBySubUser(userId) {
        let sql = `
        SELECT DISTINCT c.court_id, c.adress
        FROM sub_user_court AS sub, user AS u, court AS c
        WHERE sub.court_id = c.court_id AND sub.user_id = '${userId}'
        `

        return db.execute(sql)
    }

    // отмена подписки на площадку
    static cancelSubOnCourt(courtId, userId) {
        let sql = `
        DELETE FROM sub_user_court
        WHERE court_id = '${courtId}' AND user_id = '${userId}';
        `

        return db.execute(sql)
    }

}

module.exports = SubOnCourt