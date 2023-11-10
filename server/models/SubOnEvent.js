const { v4: uuidv4 } = require('uuid');
const db = require('../config/db')

class SubOnEvent {
    constructor(eventId, userId) {
        this.eventId = eventId
        this.userId = userId
    }
    get getId() {
        return uuidv4().toString().slice(0, 11)
    }

    async save() {  
        let sql = `
        INSERT INTO sub_user_event (sub_id,event_id,user_id)
        VALUES ('${this.getId}', '${this.eventId}', '${this.userId}');`

        const [newEvent, _] = await db.execute(sql)

        return newEvent
    }

    // подписанные пользователи на событие
    static findUserSubsOnEvent(eventId) {
        let sql = `
        select u.user_id, u.user_name from sub_user_event as sub, user as u
        where u.user_id = sub.user_id and sub.event_id = '${eventId}'`
        return db.execute(sql)
    }

    // события пользователя
    static findEventsBySubUser(userId) {
        let sql = `
        select e.event_id, c.adress, e.time, e.players_num 'playersAll', 
            (select count(s.user_id) from sub_user_event as s where s.event_id = sub.event_id) 'playersNow'
        from sub_user_event as sub, event as e, court as c
        where e.time >= (SELECT CURRENT_TIMESTAMP()) and sub.event_id = e.event_id and e.court_id = c.court_id and sub.user_id = '${userId}'
        group by e.event_id
        `
        return db.execute(sql)
    }

    // отмена события
    async cancelSubOrDeleteEvent(userId, eventId) {
        let sql = `call del_event('${userId}', '${eventId}')`

        return db.execute(sql)
    }

    // список айди подписок пользователя
    static getOnlyIdSubs(userId) {
        let sql = `
        select e.event_id
        from sub_user_event as sub, event as e, court as c
        where e.time >= (SELECT CURRENT_TIMESTAMP()) and sub.event_id = e.event_id and e.court_id = c.court_id and sub.user_id = '${userId}'
        group by e.event_id
        `

        return db.execute(sql)
    }
}

module.exports = SubOnEvent