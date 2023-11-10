const { v4: uuidv4 } = require('uuid');
const db = require('../config/db')

class User {
    constructor(name, password, descr) {
        this.name = name
        this.password = password
        this.descr = descr
    }
    get getId() {
        return uuidv4().toString().slice(0, 11)
    }

    async save() {  
        let sql = `
        INSERT INTO user (
            user_id,
            user_name,
            password,
            description
        )
        VALUES (
            '${this.getId}',
            '${this.name}',
            '${this.password}',
            '${this.descr}'
        );
        `

        const [newUser, _] = await db.execute(sql)

        return newUser
    }

    static findAll() {
        let sql = `
        SELECT * FROM user;
        `

        return db.execute(sql)
    }

    static findById(id) {
        let sql = `
        select u.user_id, u.user_name, u.description, t.team_name
        from user u, team t
        where u.user_id = '${id}' and u.team_id = t.team_id 
        `

        return db.execute(sql)
    }

    async editProfile(userId) {
        let sql = `
        UPDATE USER
        SET user_name='${this.name}', description='${this.descr}'
        WHERE user_id='${userId}';
        `

        return db.execute(sql)
    }

    static authUser(login, password) {
        let sql = `
        select u.user_id, u.user_name, u.description, t.team_name
        from user u, team t
        where u.user_name = '${login}' and u.password = '${password}' and u.team_id = t.team_id
        `

        return db.execute(sql)
    }
}

module.exports = User