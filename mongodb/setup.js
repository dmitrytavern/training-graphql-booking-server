let DATABASE_ROOT_USER = "root"
let DATABASE_ROOT_PASS = "root"
let DATABASE_NAME = "node"
let DATABASE_USER = "node_user"
let DATABASE_PASS = "root"

let db = Mongo().getDB('admin')

db.auth(DATABASE_ROOT_USER, DATABASE_ROOT_PASS)

if (db.getUser(DATABASE_USER) === null) {
	db.createUser({
		user: DATABASE_USER,
		pwd: DATABASE_PASS,
		roles: [
			{
				role: "userAdminAnyDatabase",
				db: "admin"
			},
			"readWriteAnyDatabase"
		]
	})

	db["system.users"].update({_id: "admin." + DATABASE_USER}, {$unset: {db: DATABASE_NAME}})
	db["system.users"].update({_id: "admin." + DATABASE_USER}, {$set: {db: DATABASE_NAME}})
}

db = Mongo().getDB(DATABASE_NAME)

print('Success script')
quit(1)
