
function matchPermission(permit, permission) {

  const permitParts = permit.split('.');
  const permissionParts = permission.split('.');

  for (let i = 0, len = permitParts.length; i < len; i++) {

    const curPermission = permissionParts[i];
    const curPermit = permitParts[i];

    if (curPermit.includes('**')) {
      return curPermission.startsWith( curPermit.slice(0, curPermit.indexOf('**')) );
    }
    else if (curPermit.includes('*')) {

      const testReg = new RegExp(`^${curPermit.replaceAll('*', '.+')}$`);

      if (!testReg.test(curPermission)) {
        return false;
      }

    }
    else if (curPermit !== curPermission) {
      return false;
    }

  }

  return permitParts.length === permissionParts.length;

}

function hasPermission(allPermissions, permission) {
  return allPermissions.some(permit => matchPermission(permit, permission));
}

export function hasPermissions(allPermissions, neededPermissions) {
  return neededPermissions.every(permission => hasPermission(allPermissions, permission));
}
