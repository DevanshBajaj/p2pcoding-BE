const {Sequelize} = require("sequelize");
const UserModel = require("./models/user");
const ProblemModel = require("./models/problem");
const SolutionModel = require("./models/solution");
const ActivityModel = require("./models/activity");

// Connect to database
const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	port: DB_PORT,
	dialect: "postgres",
	dialectOptions: {
		ssl: true,
	},
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
	},
});
(async () => {
    try {
        const res = await sequelize.sync();
    } catch (err) {
        console.log(err);
    }
})();

const User = UserModel(sequelize);
const Problem = ProblemModel(sequelize);
const Solution = SolutionModel(sequelize);
const Activity = ActivityModel(sequelize);

Problem.belongsTo(Solution, { foreignKey: 'solutionId' })

Activity.belongsTo(Problem, { foreignKey: 'problemId' })
Activity.belongsTo(Solution, { foreignKey: 'solutionId' })
Activity.belongsTo(User, { foreignKey: 'userId' })

module.exports = {
    User,
    Problem,
    Solution,
    Activity,
    sequelize,
};