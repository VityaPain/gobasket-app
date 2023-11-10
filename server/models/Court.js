const { v4: uuidv4 } = require('uuid');
const db = require('../config/db')

class Court {
    constructor(adress, description, region) {
        this.adress = adress
        this.description = description
        this.region = region
    }
    get getId() {
        return uuidv4().toString().slice(0, 11)
    }

    async save() {  
        let sql = `
        INSERT INTO court (
            court_id,
            adress,
            description,
            region_id
        )
        VALUES (
            '${this.getId}',
            '${this.adress}',
            '${this.description}',
            '${this.region}'
        );
        `

        const [newUser, _] = await db.execute(sql)

        return newUser
    }

    static findAll() {
        let sql = `
        SELECT * FROM court;
        `

        return db.execute(sql)
    }

    static findById(id) {
        let sql = `
        SELECT c.*, i.path
        FROM court c, court_images i
        WHERE c.court_id = '${id}' and c.court_id = i.court_id
        `

        return db.execute(sql)
    }

    static findAllAdress() {
        let sql = `
        SELECT court_id, adress
        FROM court
        `

        return db.execute(sql)
    }

    static findDescrAndImages(courtId) {
        let sql = `
        select c.description, i.path
        from court c, court_images i
        where c.court_id = i.court_id and c.court_id = '${courtId}'
        `

        return db.execute(sql)
    }

    static getMarkers() {
        let sql = `
        SELECT c.court_id, c.adress, c.longitude, c.latitude
        FROM court c
        `

        return db.execute(sql)
    }
}

module.exports = Court