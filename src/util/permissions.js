
function matchPermission(permit, permission) {

  const permitParts = permit.split('.');
  const permissionParts = permission.split('.');

  for (let i = 0, len = permitParts.length; i < len; i++) {
    if (permitParts[i] === '*') return  true;
    if (permitParts[i] !== permissionParts[i]) return false;
  }

  return permitParts.length === permissionParts.length;

}

function hasPermission(allPermissions, permission) {
  return allPermissions.some(permit => matchPermission(permit, permission));
}

export function hasPermissions(allPermissions, neededPermissions) {
  return neededPermissions.every(permission => hasPermission(allPermissions, permission));
}
