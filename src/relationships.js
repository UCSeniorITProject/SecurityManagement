const UserRole = require('./userrole/UserRoleModel');
const Role = require('./role/RoleModel');
const User = require('./user/UserModel');
const RolePrivilege = require('./roleprivilege/RolePrivilegeModel');
const Privilege = require('./privilege/PrivilegeModel');

module.exports = () => {
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleID',
  });
  
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userID',
  });

  Role.belongsToMany(Privilege, {
    through: RolePrivilege,
    foreignKey: 'roleID',
  });

  Privilege.belongsToMany(Role, {
    through: RolePrivilege,
    foreignKey: 'privilegeID',
  });
};
