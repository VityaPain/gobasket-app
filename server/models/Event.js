const { v4: uuidv4 } = require('uuid');
const db = require('../config/db')

class Event {
    constructor(eventId, time, playersNum, descr, courtId, creator) {
        this.eventId = eventId
        this.time = time
        this.playersNum = playersNum
        this.descr = descr
        this.courtId = courtId
        this.creator = creator
    }
    // get getId() {
    //     return uuidv4().toString().slice(0, 11)
    // }

    async save() {  
        let sql = `
        INSERT INTO event (
            event_id,
            time,
            players_num,
            description,
            court_id,
            creator
        )
        VALUES (
            '${this.eventId}',
            '${this.time}',
            '${this.playersNum}',
            '${this.descr}',
            '${this.courtId}',
            '${this.creator}'
        );
        `

        const [newEvent, _] = await db.execute(sql)

        return newEvent
    }

    static findAll() {
        let sql = `
        select ev.event_id 'id', ev.time 'time', ev.players_num 'playersAll', c.adress 'adress', (select count(s.user_id) from sub_user_event as s where s.event_id = ev.event_id) as 'playersNow'
        from gobasket_t1.event as ev, court as c, sub_user_event as sub
        where ev.time >= (SELECT CURRENT_TIMESTAMP()) and ev.court_id = c.court_id
        group by ev.event_id
        `
        // where ev.time >= (SELECT CURRENT_TIMESTAMP()) and ev.court_id = c.court_id and ev.event_id = sub.event_id

        return db.execute(sql)
    }

    static findById(id) {
        let sql = `
        select ev.event_id, ev.time, ev.players_num 'playersAll', c.court_id 'court_id',c.adress, ev.description 'eventDescr', count(sub.event_id) 'playersNow', c.description 'adresDescr', ev.creator
        from gobasket_t1.event as ev, court as c, sub_user_event as sub
        where ev.court_id = c.court_id and ev.event_id = sub.event_id and ev.event_id = '${id}'
        group by event_id
        `

        return db.execute(sql)
    }

    async editEventByUser(event_id, time, players_num, description, court_id ) {
        const sql = `
        UPDATE event
        SET time='${time}', players_num='${players_num}', description='${description}', court_id='${court_id}'
        WHERE event_id='${event_id}'
        `

        return db.execute(sql)
    }

}

module.exports = Event